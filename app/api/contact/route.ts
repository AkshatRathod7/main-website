import { NextResponse, type NextRequest } from "next/server";
import { contactSchema, MIN_FILL_MS, type FieldErrors } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";
import { sendToSheet } from "@/lib/leads";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8_000;

function clientIp(req: NextRequest) {
  return (
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

/** Same-origin only. Blocks drive-by cross-site posts without needing a CSRF token. */
function sameOrigin(req: NextRequest) {
  const origin = req.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host === req.headers.get("host");
  } catch {
    return false;
  }
}

// Bots get a convincing 200 and learn nothing.
const silentOk = () => NextResponse.json({ ok: true }, { status: 200 });

export async function POST(req: NextRequest) {
  if (!sameOrigin(req)) return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) return NextResponse.json({ ok: false, error: "That message is too large." }, { status: 413 });

  const limit = await rateLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "We’ve had a few messages from you in a short time. Try again in a few minutes, or email grow@dreamsvin.com." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(limit.resetMs / 1000)) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn’t read that submission." }, { status: 400 });
  }

  // Honeypot + time-trap: checked before validation so bots never see field errors.
  const raw = body as Record<string, unknown>;
  if (typeof raw?.website === "string" && raw.website.length > 0) return silentOk();
  if (Date.now() - Number(raw?.startedAt ?? 0) < MIN_FILL_MS) return silentOk();

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors: FieldErrors = {};
    for (const issue of parsed.error.issues) {
      const k = issue.path[0] as keyof FieldErrors;
      fieldErrors[k] ??= issue.message;
    }
    return NextResponse.json({ ok: false, fieldErrors }, { status: 422 });
  }

  const { website: _hp, startedAt: _t, ...lead } = parsed.data;
  // Leads go to the DreamSVin leads Google Sheet (lib/leads.ts).
  try {
    await sendToSheet({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      phone: lead.phone ?? "",
      stage: lead.stage,
      budget: lead.budget ?? "",
      challenge: lead.message,
      consent: lead.consent ? "Yes" : "No",
      page: req.headers.get("referer") ?? "website:/contact",
      referrer: typeof raw.referrer === "string" ? raw.referrer.slice(0, 300) : "",
    });
  } catch (err) {
    console.error("[contact] delivery failed", err);
    return NextResponse.json(
      { ok: false, error: "Something on our side didn’t go through. Your words are still in the form; try again or email grow@dreamsvin.com." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
