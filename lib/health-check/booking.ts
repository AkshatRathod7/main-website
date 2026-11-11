import type { HealthResult } from "./scoring";

/** The 30-minute results walkthrough. Separate from the /contact conversation event (NEXT_PUBLIC_CAL_LINK);
 *  Stage 07 and Stage 09 both read NEXT_PUBLIC_CAL_LINK for two different events, split at Stage 10. */
export const CAL_LINK = process.env.NEXT_PUBLIC_CAL_LINK_HEALTH_CHECK || process.env.NEXT_PUBLIC_CAL_LINK || "dreamsvin/health-check-walkthrough";
export const CAL_ORIGIN = process.env.NEXT_PUBLIC_CAL_ORIGIN ?? "https://cal.com";

export function bookingNotes(r: HealthResult, company?: string) {
  const pillars = r.pillars.map((p) => `${p.name} ${p.score}`).join(" · ");
  return [
    `Health Check${company ? ` — ${company}` : ""}`,
    `Overall ${r.overall}/100 (${r.tier.name})`,
    pillars,
    r.focus.length ? `Focus: ${r.focus.map((f) => f.name).join(", ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Cal.com prefill config, used by both the inline embed and the fallback link. */
export function bookingPrefill(r: HealthResult, lead: { name?: string; email?: string; company?: string }) {
  return {
    name: lead.name ?? "",
    email: lead.email ?? "",
    notes: bookingNotes(r, lead.company),
    "metadata[source]": "health-check",
    "metadata[score]": String(r.overall),
    "metadata[tier]": r.tier.id,
  };
}

export function bookingUrl(r: HealthResult, lead: { name?: string; email?: string; company?: string }) {
  const qs = new URLSearchParams(bookingPrefill(r, lead));
  return `${CAL_ORIGIN}/${CAL_LINK}?${qs.toString()}`;
}
