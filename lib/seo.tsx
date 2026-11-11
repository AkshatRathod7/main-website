/**
 * SEO + structured data (Stage 10). One source for the site URL, page metadata and JSON-LD.
 * Facts only: no ratings, reviews, invented clients, addresses or social profiles.
 * Values that need a real business fact read from env and are omitted when empty.
 */
import type { Metadata } from "next";

export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamsvin.com").replace(/\/$/, "");
export const SITE_NAME = "DreamSVin";
export const TAGLINE = "Your Business Architects. Your Growth Partners.";
export const DEFAULT_DESCRIPTION =
  "We find what's holding your business back, build a focused 90-day plan, and help you execute it. Business architects and growth partners for startups, established businesses and institutions.";

const ORG_ID = `${SITE}/#organization`;
const SERVICE_ID = `${SITE}/#professional-service`;
const WEBSITE_ID = `${SITE}/#website`;

/** Page metadata with a canonical URL. The per-route opengraph-image file supplies og:image. */
export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
  absolute = false,
  type = "website",
  ownImage = false,
}: {
  title: string;
  /** Use the title as written, without the " - DreamSVin" suffix (when it already names the brand). */
  absolute?: boolean;
  description: string;
  path: string;
  noindex?: boolean;
  type?: "website" | "article";
  /** The route has its own opengraph-image file. A page's openGraph replaces its parent's (no merge),
   *  so every other page must name the site-wide card itself or it shares with no image at all. */
  ownImage?: boolean;
}): Metadata {
  const images = ownImage ? undefined : ["/opengraph-image"];
  return {
    title: absolute ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: SITE_NAME, locale: "en_IN", type, ...(images && { images }) },
    twitter: { card: "summary_large_image", title, description, ...(images && { images }) },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // `<` escaped so content can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grow@dreamsvin.com";
const city = process.env.NEXT_PUBLIC_CITY || "";
const sameAs = (process.env.NEXT_PUBLIC_SAME_AS || "").split(",").map((s) => s.trim()).filter(Boolean);

export const organizationNode = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  url: SITE,
  logo: `${SITE}/icon.svg`,
  slogan: TAGLINE,
  email,
  ...(sameAs.length ? { sameAs } : {}),
});

export const professionalServiceNode = () => ({
  "@type": "ProfessionalService",
  "@id": SERVICE_ID,
  name: SITE_NAME,
  url: SITE,
  image: `${SITE}/opengraph-image`,
  description: DEFAULT_DESCRIPTION,
  email,
  parentOrganization: { "@id": ORG_ID },
  areaServed: { "@type": "Country", name: "India" },
  knowsAbout: [
    "Business strategy and positioning",
    "Brand identity and websites",
    "Content and personal branding",
    "Community and collaborations",
    "Growth systems and automation",
    "Go-to-market and market expansion",
  ],
  ...(city ? { address: { "@type": "PostalAddress", addressLocality: city, addressCountry: "IN" } } : {}),
});

export const websiteNode = () => ({
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE,
  name: SITE_NAME,
  inLanguage: "en-IN",
  publisher: { "@id": ORG_ID },
});

export const faqNode = (items: readonly { q: string; text: string }[]) => ({
  "@type": "FAQPage",
  mainEntity: items.map((i) => ({
    "@type": "Question",
    name: i.q,
    acceptedAnswer: { "@type": "Answer", text: i.text },
  })),
});

export const breadcrumbNode = (trail: readonly { name: string; path: string }[]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: t.name,
    item: `${SITE}${t.path === "/" ? "" : t.path}`,
  })),
});

/** Wraps nodes in one @graph so Organization is referenced, not repeated. */
export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });

export const homeGraph = (faq: readonly { q: string; text: string }[]) =>
  graph(organizationNode(), websiteNode(), professionalServiceNode(), faqNode(faq));

export const orgRef = { "@id": ORG_ID };
