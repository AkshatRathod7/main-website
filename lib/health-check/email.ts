/**
 * The lead's copy of their results.
 *
 * Provider is chosen by env: EMAIL_PROVIDER = "resend" | "postmark" | "none".
 * Both are called over plain fetch so no SDK is required.
 */
import "server-only";
import type { HealthResult } from "./scoring";
import type { Lead } from "./schema";
import { bookingUrl } from "./booking";

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

// Brand book, light: cream canvas, charcoal text, rust (text-safe coral) accent. Names kept for the template.
const C = {
  canvas: "#F9F5EF",
  surface: "#FFFFFF",
  hairline: "#E4DCCF",
  ivory: "#25282D",
  muted: "#5E6168",
  accent: "#B03A26",
};

const subjectLine = (r: HealthResult) => `Your Health Check: ${r.overall}/100, ${r.tier.name}`;

export function renderResultsEmail(r: HealthResult, lead: Lead) {
  const first = lead.name.split(" ")[0];
  const book = bookingUrl(r, lead);
  const bar = (score: number) => `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      <tr>
        <td width="${score}%" style="height:2px;background:${C.accent};font-size:0;line-height:0">&nbsp;</td>
        <td width="${100 - score}%" style="height:2px;background:${C.hairline};font-size:0;line-height:0">&nbsp;</td>
      </tr>
    </table>`;

  const pillars = r.pillars
    .map(
      (p) => `
      <tr><td style="padding:14px 0 6px;font:14px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.ivory}">
        ${esc(p.name)}<span style="float:right;font-family:Menlo,Consolas,monospace;color:${p.weak ? C.accent : C.muted}">${p.score}</span>
      </td></tr>
      <tr><td>${bar(p.score)}</td></tr>`,
    )
    .join("");

  const focus = r.focus
    .map(
      (f) => `
      <tr><td style="padding:28px 0 8px;font:11px/1.4 Menlo,Consolas,monospace;letter-spacing:.12em;text-transform:uppercase;color:${C.accent}">
        ${f.reason === "weak" ? "Weak pillar" : "Next edge"} · ${esc(f.name)} · ${f.score}
      </td></tr>
      ${f.recommendations
        .map(
          (rec, i) => `
        <tr><td style="padding:10px 0;border-top:1px solid ${C.hairline};font:15px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.ivory}">
          <span style="font-family:Menlo,Consolas,monospace;color:${C.muted}">0${i + 1}</span>&nbsp;&nbsp;<strong style="font-weight:600">${esc(rec.title)}</strong><br>
          <span style="color:${C.muted}">${esc(rec.body)}</span>
        </td></tr>`,
        )
        .join("")}`,
    )
    .join("");

  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(subjectLine(r))}</title></head><body style="margin:0;background:${C.canvas}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.canvas}">
  <tr><td align="center" style="padding:48px 20px">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
      <tr><td style="font:11px/1.4 Menlo,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;color:${C.muted}">DreamSVin · Business Health Check</td></tr>
      <tr><td style="padding:32px 0 4px;font:15px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.muted}">${esc(first)}, here is where ${esc(lead.company)} stands.</td></tr>
      <tr><td style="padding:8px 0 0;font:600 64px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:-.03em;color:${C.ivory}">${r.overall}<span style="font-size:20px;color:${C.muted};letter-spacing:0">&nbsp;/ 100</span></td></tr>
      <tr><td style="padding:12px 0 0;font:11px/1.4 Menlo,Consolas,monospace;letter-spacing:.14em;text-transform:uppercase;color:${C.accent}">${esc(r.tier.name)}</td></tr>
      <tr><td style="padding:12px 0 24px;font:16px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.ivory}">${esc(r.tier.summary)}</td></tr>
      ${r.context ? `<tr><td style="padding:0 0 24px;font:15px/1.55 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.muted}">${esc(r.context)}</td></tr>` : ""}
      <tr><td style="padding:0 0 28px"><a href="${esc(book)}" style="font:600 15px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.accent};text-decoration:none">Book a free consultation &rarr;</a></td></tr>
      <tr><td style="border-top:1px solid ${C.hairline}"></td></tr>
      ${pillars}
      ${focus}
      <tr><td style="padding:40px 0 0">
        <a href="${esc(book)}" style="display:inline-block;background:${C.accent};color:${C.canvas};font:600 15px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;text-decoration:none;padding:16px 24px;border-radius:6px">Book a free consultation</a>
      </td></tr>
      <tr><td style="padding:16px 0 0;font:14px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.muted}">A free 30-minute consultation. We go through your answers and show what we would fix first, and in what order. You leave with a clear view of what&rsquo;s slowing you down, whether or not we work together.</td></tr>
      <tr><td style="padding:48px 0 0;font:12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${C.muted}">You received this because you completed the Health Check at dreamsvin.com and asked for your report. We do not add you to a newsletter.</td></tr>
    </table>
  </td></tr></table></body></html>`;

  const text = [
    `${first}, here is where ${lead.company} stands.`,
    ``,
    `Overall: ${r.overall}/100 — ${r.tier.name}`,
    r.tier.summary,
    r.context ?? "",
    ``,
    ...r.pillars.map((p) => `${p.name}: ${p.score}`),
    ``,
    ...r.focus.flatMap((f) => [
      `${f.name} (${f.score})`,
      ...f.recommendations.map((rec, i) => `  ${i + 1}. ${rec.title}. ${rec.body}`),
      ``,
    ]),
    `Book a free consultation: ${book}`,
  ].join("\n");

  return {
    subject: subjectLine(r),
    html,
    text,
  };
}

export async function sendResultsEmail(r: HealthResult, lead: Lead): Promise<"sent" | "skipped"> {
  const provider = (process.env.EMAIL_PROVIDER ?? "none").toLowerCase();
  const from = process.env.EMAIL_FROM ?? "DreamSVin <healthcheck@dreamsvin.com>";
  const replyTo = process.env.EMAIL_REPLY_TO;
  const bcc = process.env.EMAIL_BCC; // optional internal copy
  const { subject, html, text } = renderResultsEmail(r, lead);

  if (provider === "resend") {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [lead.email],
        subject,
        html,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(bcc ? { bcc: [bcc] } : {}),
        tags: [{ name: "source", value: "health-check" }],
      }),
    });
    if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
    return "sent";
  }

  if (provider === "postmark") {
    const res = await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN ?? "",
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        From: from,
        To: lead.email,
        Subject: subject,
        HtmlBody: html,
        TextBody: text,
        ReplyTo: replyTo,
        Bcc: bcc,
        MessageStream: "outbound",
        Tag: "health-check",
      }),
    });
    if (!res.ok) throw new Error(`Postmark ${res.status}: ${await res.text()}`);
    return "sent";
  }

  return "skipped";
}
