/**
 * DreamSVin website contact form → Google Sheet (+ email alert).
 *
 * Lives in Apps Script, bound to the leads Google Sheet (Extensions → Apps Script).
 * This copy is kept in the repo for version control only; the site never imports it.
 *
 * After ANY change here: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy.
 * That keeps the same /exec URL. "New deployment" would create a different URL.
 */

const SHEET_NAME = 'Leads';
const NOTIFY_EMAIL = 'hr.dreamsvin@gmail.com';
const MAX_FIELD_LENGTH = 5000;

// Accepted form fields, in column order. Fields the form doesn't send yet stay blank,
// so new form fields from this list need no script change or redeploy.
const FIELDS = [
  ['name', 'Name'],
  ['email', 'Email'],
  ['company', 'Company'],
  ['phone', 'Phone'],
  ['stage', 'Business stage'],
  ['budget', 'Budget'],
  ['challenge', 'Challenge'],
  ['consent', 'Consent'],
  ['page', 'Page'],
  ['referrer', 'Referrer'],
];
const REQUIRED = ['name', 'email', 'challenge'];

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Honeypot: the hidden "website" field is only ever filled in by bots.
    if (data.website) return json({ ok: true });

    const lead = {};
    FIELDS.forEach(([key]) => (lead[key] = clean(data[key])));

    if (REQUIRED.some((key) => !lead[key])) return json({ ok: false, error: 'missing_fields' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) return json({ ok: false, error: 'invalid_email' });

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      getSheet().appendRow([new Date()].concat(FIELDS.map(([key]) => safeCell(lead[key]))));
    } finally {
      lock.releaseLock();
    }

    // The lead is already saved; a failed alert (e.g. daily mail quota) must not fail the submit.
    try {
      notify(lead);
    } catch (err) {
      console.error('Lead saved but alert email failed', err);
    }

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server_error' });
  }
}

// Opening the /exec URL in a browser should show this, which confirms the deployment works.
function doGet() {
  return ContentService.createTextOutput('DreamSVin leads endpoint is running.');
}

// Run once from the editor (select "setup" → Run) to grant permissions and create the header row.
function setup() {
  getSheet();
  MailApp.sendEmail(NOTIFY_EMAIL, 'DreamSVin leads sheet connected', 'Website leads will be added to this sheet:\n' +
    SpreadsheetApp.getActiveSpreadsheet().getUrl());
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Submitted at'].concat(FIELDS.map(([, label]) => label)));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, FIELDS.length + 1).setFontWeight('bold');
  }
  return sheet;
}

function notify(lead) {
  const lines = FIELDS.filter(([key]) => lead[key]).map(([key, label]) => label + ': ' + lead[key]);
  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    replyTo: lead.email,
    subject: 'New website lead: ' + lead.name,
    body: lines.join('\n\n') + '\n\nAll leads: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl(),
  });
}

function clean(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, MAX_FIELD_LENGTH);
}

// Stop values like "=HYPERLINK(...)" from running as formulas in the sheet.
function safeCell(value) {
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function json(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
