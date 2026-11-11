/**
 * The DreamSVin leads Google Sheet, through its Apps Script web app (docs/leads.gs).
 * The URL was public in the old site's client bundle; CONTACT_WEBHOOK_URL overrides it.
 * Accepted fields: name, email, company, phone, stage, budget, challenge, consent, page, referrer
 * (name, email and challenge are required). Both forms post here, so no lead depends on an optional env var.
 */
export const LEADS_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyONFSLfhBPxu7uRdVyDVeoOH26rCTb-OZZVCjNZ1_Krfy2gTANd-7QE0ZvfkgoNy0O1A/exec";

export const leadsUrl = () => process.env.CONTACT_WEBHOOK_URL || LEADS_ENDPOINT;

export type SheetLead = {
  name: string;
  email: string;
  challenge: string;
  company?: string;
  phone?: string;
  stage?: string;
  budget?: string;
  consent?: string;
  page?: string;
  referrer?: string;
};

/** Posts one row to the leads sheet. Throws when the sheet does not confirm. */
export async function sendToSheet(lead: SheetLead) {
  const res = await fetch(leadsUrl(), {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(lead),
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`webhook ${res.status}`);
  const out = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
  if (out.ok === false) throw new Error(`sheet ${out.error ?? "rejected"}`);
}
