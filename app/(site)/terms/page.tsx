import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { LegalPage, R, type LegalSection } from "@/components/editorial/legal-page";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Terms of use",
  description:
    "The terms that apply to your use of the DreamSVin website.",
  path: "/terms",
  noindex: true, // placeholders until counsel signs off
});

const sections: LegalSection[] = [
  {
    id: "scope",
    title: "What these terms cover",
    body: (
      <p>
        These terms apply to your use of this website, operated by <R>registered legal entity name</R> (“DreamSVin”, “we”). They don’t cover client engagements; those are governed by a separate written agreement, which takes priority if the two ever conflict.
      </p>
    ),
  },
  {
    id: "information",
    title: "Information, not advice",
    body: (
      <p>
        Essays, tools and examples on this site, including the health check, are general information. They are not legal, financial, tax or professional advice for your specific situation. Make decisions with advice that accounts for your circumstances.
      </p>
    ),
  },
  {
    id: "use",
    title: "Using the site",
    body: (
      <>
        <p>Please don’t:</p>
        <ul>
          <li>attempt to disrupt, overload or gain unauthorised access to the site or its systems;</li>
          <li>submit false information or someone else’s details through our forms;</li>
          <li>scrape or copy the site at scale, or use it to train automated systems, without our written permission.</li>
        </ul>
      </>
    ),
  },
  {
    id: "ip",
    title: "Our content",
    body: (
      <p>
        The text, design, code and graphics on this site belong to DreamSVin or its licensors. You’re welcome to share links and quote short passages with attribution. For anything more, ask us.
      </p>
    ),
  },
  {
    id: "third",
    title: "Third-party services",
    body: (
      <p>
        We use third-party tools such as Cal.com for booking and WhatsApp for messaging. Your use of those services is also subject to their terms. We aren’t responsible for third-party sites we link to.
      </p>
    ),
  },
  {
    id: "liability",
    title: "Liability",
    body: (
      <p>
        We work to keep this site accurate and available but provide it “as is”. To the extent the law allows, we aren’t liable for losses arising from your use of the site or reliance on its general content. Nothing here limits liability that cannot be limited by law. <R>Counsel to set the cap and exclusions.</R>
      </p>
    ),
  },
  {
    id: "law",
    title: "Governing law",
    body: (
      <p>
        These terms are governed by the laws of India. Courts at <R>city</R> have exclusive jurisdiction.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes",
    body: <p>We may update these terms. The date at the top shows the latest version. Continued use of the site means you accept the current terms.</p>,
  },
  {
    id: "contact",
    title: "Contact",
    body: <p>Questions about these terms: <R>legal contact email</R>.</p>,
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of use"
      updated="[date of counsel sign-off]"
      intro={<p>Plain terms for using this website. Client work runs on its own written agreement.</p>}
      sections={sections}
    />
  );
}
