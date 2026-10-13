// Google Apps Script web app that appends leads to the DreamSVin leads Google Sheet.
// Source: google-apps-script/leads.gs. The URL is public by design, so it lives here, not in env vars.
const LEADS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyONFSLfhBPxu7uRdVyDVeoOH26rCTb-OZZVCjNZ1_Krfy2gTANd-7QE0ZvfkgoNy0O1A/exec';

export interface Lead {
  name: string;
  email: string;
  company: string;
  phone: string;
  stage: string;
  challenge: string;
  website: string; // honeypot, must stay empty
}

export async function submitLead(lead: Lead): Promise<void> {
  // text/plain keeps this a "simple" request, so the browser skips the CORS preflight Apps Script can't answer.
  const response = await fetch(LEADS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ ...lead, page: window.location.href, referrer: document.referrer }),
  });
  const result: { ok?: boolean; error?: string } = await response.json();
  if (!result.ok) {
    throw new Error(result.error || 'submit_failed');
  }
}
