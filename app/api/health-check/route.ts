/**
 * POST /api/health-check
 *
 * 1. Validate with Zod (all 14 answers, lead fields, honeypot).
 * 2. Re-score on the server. Client scores are never trusted.
 * 3. Forward answers + scores + lead to HEALTH_CHECK_WEBHOOK_URL (CRM / Sheets / n8n).
 * 4. Email the lead their results (EMAIL_PROVIDER).
 *
 * The response tells the client what happened to each side effect so the
 * results page can say "A copy is on its way" truthfully.
 */
import { NextResponse } from "next/server";
import { submissionSchema } from "@/lib/health-check/schema";
import { scoreHealthCheck } from "@/lib/health-check/scoring";
import { QUESTIONS } from "@/lib/health-check/questions";
import { sendResultsEmail } from "@/lib/health-check/email";
import { sendToSheet } from "@/lib/leads";

export const runtime = "nodejs";

// Small in-memory limiter. Per instance only; put Upstash/Vercel KV in front for real abuse protection.
const hits = new Map<string, number[]>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > LIMIT;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) {
    return NextResponse.json({ ok: false, error: "Too many submissions. Try again in a few minutes." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const parsed = submissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Some answers are missing or invalid.", issues: parsed.error.flatten() },
      { status: 422 },
    );
  }

  const { answers, lead, meta, website } = parsed.data;
  // Honeypot filled: pretend success, do nothing.
  if (website) return NextResponse.json({ ok: true, webhook: "skipped", email: "skipped" });

  const result = scoreHealthCheck(answers, { teamSize: lead.teamSize, locations: lead.locations });

  const payload = {
    event: "health_check.completed",
    version: result.version,
    submittedAt: new Date().toISOString(),
    lead,
    scores: {
      overall: result.overall,
      tier: result.tier.id,
      tierName: result.tier.name,
      pillars: Object.fromEntries(result.pillars.map((p) => [p.id, p.score])),
      focus: result.focus.map((f) => ({ pillar: f.id, reason: f.reason, recommendations: f.recommendations.map((r) => r.questionId) })),
    },
    // Full answers, human-readable, so a sheet row makes sense without the code.
    answers: QUESTIONS.map((q) => ({
      id: q.id,
      pillar: q.pillar,
      question: q.prompt,
      score: answers[q.id],
      answer: q.options[answers[q.id] as number],
    })),
    meta: { ...meta, ip, userAgent: req.headers.get("user-agent") ?? "" },
  };

  const [webhook, email] = await Promise.allSettled([
    (async () => {
      const url = process.env.HEALTH_CHECK_WEBHOOK_URL;
      if (!url) {
        // No dedicated webhook: the lead still lands in the leads sheet, with the score as the "challenge".
        const focus = result.focus.map((f) => f.id).join(", ");
        await sendToSheet({
          name: lead.name,
          email: lead.email,
          company: lead.company,
          phone: lead.whatsapp ?? "",
          stage: `${lead.role} · team ${lead.teamSize} · ${lead.locations} location(s)`,
          challenge: `Business Health Check: ${result.overall}/100 (${result.tier.name}). Focus: ${focus || "none"}.`,
          consent: lead.consent ? "Yes" : "No",
          page: "website:/health-check",
        });
        return "sent" as const;
      }
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.HEALTH_CHECK_WEBHOOK_SECRET
            ? { "X-Webhook-Secret": process.env.HEALTH_CHECK_WEBHOOK_SECRET }
            : {}),
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) throw new Error(`Webhook ${res.status}`);
      return "sent" as const;
    })(),
    sendResultsEmail(result, lead),
  ]);

  if (webhook.status === "rejected") console.error("[health-check] webhook failed", webhook.reason);
  if (email.status === "rejected") console.error("[health-check] email failed", email.reason);

  const status = (s: PromiseSettledResult<"sent" | "skipped">) => (s.status === "fulfilled" ? s.value : "failed");

  return NextResponse.json({
    ok: true,
    result,
    webhook: status(webhook),
    email: status(email),
  });
}
