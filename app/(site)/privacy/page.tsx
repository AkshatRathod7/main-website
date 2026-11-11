import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { LegalPage, R, type LegalSection } from "@/components/editorial/legal-page";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Privacy notice",
  description:
    "How DreamSVin collects, uses and protects personal data shared through this website.",
  path: "/privacy",
  noindex: true, // placeholders until counsel signs off
});

const sections: LegalSection[] = [
  {
    id: "who",
    title: "Who we are",
    body: (
      <p>
        This website is operated by <R>registered legal entity name</R>, trading as DreamSVin, with its registered office at <R>address</R>
        {" "}(“we”, “us”). For the purposes of the Digital Personal Data Protection Act, 2023 and its rules, we are the Data Fiduciary for the personal data described here.
      </p>
    ),
  },
  {
    id: "collect",
    title: "What we collect",
    body: (
      <>
        <p>Only what you choose to give us, plus minimal technical data:</p>
        <ul>
          <li><strong>Contact form:</strong> name, work email, business name, optional phone number, and your message.</li>
          <li><strong>Call booking:</strong> the details you enter in our scheduling tool (Cal.com), such as name, email and the time you choose.</li>
          <li><strong>WhatsApp and email:</strong> whatever you send us through those channels.</li>
          <li><strong>Analytics:</strong> aggregated, cookie-free page statistics <R>confirm: Plausible / Vercel Analytics</R>. These do not identify you.</li>
          <li><strong>Security logs:</strong> IP address and browser details, held briefly to prevent spam and abuse.</li>
        </ul>
      </>
    ),
  },
  {
    id: "use",
    title: "Why we use it",
    body: (
      <ul>
        <li>To reply to you and arrange the conversation you asked for.</li>
        <li>To prepare for that conversation and, if we work together, to deliver the engagement.</li>
        <li>To keep this website secure and understand, in aggregate, which pages are useful.</li>
      </ul>
    ),
  },
  {
    id: "basis",
    title: "Consent and lawful use",
    body: (
      <p>
        We process your data on the basis of your consent when you submit the form, book a call or message us, and for the legitimate uses the law permits. You can withdraw consent at any time by writing to us; this won’t affect anything done before you withdrew. <R>Counsel to confirm wording against current DPDP Rules.</R>
      </p>
    ),
  },
  {
    id: "share",
    title: "Who we share it with",
    body: (
      <>
        <p>We don’t sell personal data. We share it only with service providers who help us run this website and our business, under contract:</p>
        <ul>
          <li>Hosting <R>e.g. Vercel</R></li>
          <li>Scheduling: Cal.com</li>
          <li>Lead handling and records <R>CRM / Google Workspace / n8n: confirm</R></li>
          <li>Analytics <R>confirm provider</R></li>
        </ul>
        <p>Some of these providers may store data outside India. Where they do, we rely on transfers permitted under Indian law. <R>Confirm transfer position.</R></p>
      </>
    ),
  },
  {
    id: "retain",
    title: "How long we keep it",
    body: (
      <p>
        Enquiries that don’t lead to an engagement are deleted after <R>12 months</R>. Client records are kept for as long as the engagement and our legal obligations require. Security logs are kept for <R>30 days</R>.
      </p>
    ),
  },
  {
    id: "rights",
    title: "Your rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>tell you what personal data we hold about you and how we use it;</li>
          <li>correct, complete or update it;</li>
          <li>erase it, where we’re not required to keep it;</li>
          <li>nominate someone to exercise these rights on your behalf.</li>
        </ul>
        <p>We’ll respond within <R>timeframe per DPDP Rules</R>. If you’re not satisfied, you may complain to the Data Protection Board of India.</p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    body: <p>We use encrypted connections, access controls and reputable providers. No system is perfectly secure; if a breach affects you, we’ll tell you and the authorities as the law requires.</p>,
  },
  {
    id: "cookies",
    title: "Cookies",
    body: <p>This site doesn’t use advertising or tracking cookies. Our scheduling tool may set functional cookies needed to book a call. <R>Confirm after final analytics choice.</R></p>,
  },
  {
    id: "children",
    title: "Children",
    body: <p>This website is for businesses. We don’t knowingly collect data from anyone under 18.</p>,
  },
  {
    id: "contact",
    title: "Grievance officer and contact",
    body: (
      <p>
        <R>Name</R>, Grievance Officer, <R>email</R>, <R>address</R>. We’ll acknowledge your request promptly and resolve it within the period the law requires.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy notice"
      updated="[date of counsel sign-off]"
      intro={<p>Short version: we collect only what you send us, use it to reply and to do the work, never sell it, and delete it when it’s no longer needed.</p>}
      sections={sections}
    />
  );
}
