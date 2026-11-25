/**
 * SEO + structured data (Stage 10). One source for the site URL, page metadata and JSON-LD.
 * Facts only: no ratings, reviews, invented clients or street addresses. Social profiles come from SOCIAL /
 * FOUNDER_SOCIAL in lib/site.ts, the same list the footer and /about link to.
 */
import type { Metadata } from "next";
import { FOUNDER_SOCIAL, SITE_URL, SOCIAL } from "@/lib/site";

/** Alias of SITE_URL (lib/site.ts), kept so existing imports read the same constant. */
export const SITE = SITE_URL;
export const SITE_NAME = "DreamSVin";
export const TAGLINE = "Your Business Architects. Your Growth Partners.";
export const DEFAULT_DESCRIPTION =
  "Growth acceleration partner for founder-led businesses and institutions in India. We find what's holding the business back, build a focused 90-day plan, and help execute it.";

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

export const PERSON_ID = `${SITE}/about#isha`;
export const personRef = { "@id": PERSON_ID };

/** Where we work. Cities are where the team and the BNC community are; no street address is published. */
const AREA_SERVED = [
  { "@type": "Country", name: "India" },
  { "@type": "City", name: "Mumbai", containedInPlace: { "@type": "State", name: "Maharashtra" } },
  { "@type": "City", name: "Pune", containedInPlace: { "@type": "State", name: "Maharashtra" } },
];
const ADDRESS = { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" };
export const ORG_DESCRIPTION =
  "Growth acceleration partner for founder-led businesses and institutions in India. DreamSVin finds what is holding a business back, builds a focused 90-day Growth Sprint and helps execute it. Not a social media agency.";

// TODO(isha): confirm the founding year. "2025" comes from the brief, not a registry record.
const FOUNDING_DATE = "2025";

export const organizationNode = () => ({
  "@type": "Organization",
  "@id": ORG_ID,
  name: SITE_NAME,
  alternateName: "DreamSVin Consultancy",
  url: SITE,
  logo: `${SITE}/icon.svg`,
  slogan: TAGLINE,
  description: ORG_DESCRIPTION,
  email,
  foundingDate: FOUNDING_DATE,
  founder: personRef,
  areaServed: AREA_SERVED,
  address: ADDRESS,
  sameAs: Object.values(SOCIAL),
});

export const personNode = () => ({
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Isha Vijay Ostwal",
  alternateName: "Isha Ostwal",
  jobTitle: "Founder",
  description:
    "Founder of DreamSVin and of Bombay Networking Circle. World Economic Forum Global Shaper. National Co-Convenor, JITO Incubation & Innovation Foundation (JIIF). Based in Mumbai.",
  url: `${SITE}/about`,
  image: `${SITE}/people/isha.jpg`,
  worksFor: { "@id": ORG_ID },
  homeLocation: { "@type": "City", name: "Mumbai" },
  sameAs: Object.values(FOUNDER_SOCIAL),
  affiliation: [
    { "@type": "Organization", name: "World Economic Forum Global Shapers Community" },
    { "@type": "Organization", name: "JITO Incubation & Innovation Foundation (JIIF)" },
    { "@type": "Organization", name: "Bombay Networking Circle", founder: personRef },
  ],
  knowsAbout: ["Business growth strategy", "Founder-led businesses", "Execution", "Community building", "Personal branding"],
});

export const professionalServiceNode = () => ({
  "@type": "ProfessionalService",
  "@id": SERVICE_ID,
  name: SITE_NAME,
  alternateName: "DreamSVin Consultancy",
  url: SITE,
  image: `${SITE}/opengraph-image`,
  description: ORG_DESCRIPTION,
  email,
  founder: personRef,
  parentOrganization: { "@id": ORG_ID },
  areaServed: AREA_SERVED,
  address: ADDRESS,
  sameAs: Object.values(SOCIAL),
  knowsAbout: [
    "90-day Growth Sprint",
    "Business strategy and positioning",
    "Brand identity and websites",
    "Content and personal branding",
    "Community and collaborations",
    "Growth systems and automation",
    "Go-to-market and market expansion",
  ],
});

/** A service page (or a city / sector page that sells the same sprint). */
export const serviceNode = ({ name, description, path, serviceType, area }: { name: string; description: string; path: string; serviceType?: string; area?: object | object[] }) => ({
  "@type": "Service",
  "@id": `${SITE}${path}#service`,
  name,
  description,
  url: `${SITE}${path}`,
  ...(serviceType ? { serviceType } : {}),
  provider: { "@id": ORG_ID },
  areaServed: area ?? AREA_SERVED,
});

/** An insight. Author is the founder; dateModified falls back to datePublished. */
export const articleNode = ({ title, description, path, published, modified }: { title: string; description: string; path: string; published: string; modified?: string }) => ({
  "@type": "Article",
  "@id": `${SITE}${path}#article`,
  headline: title,
  description,
  datePublished: published,
  dateModified: modified ?? published,
  inLanguage: "en-IN",
  author: personRef,
  publisher: { "@id": ORG_ID },
  image: `${SITE}/opengraph-image`,
  mainEntityOfPage: `${SITE}${path}`,
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
  graph(organizationNode(), personNode(), websiteNode(), professionalServiceNode(), faqNode(faq));

export const orgRef = { "@id": ORG_ID };
