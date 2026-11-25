import { track as trackSite } from "@/lib/analytics";

/**
 * The one canonical origin. Every canonical, og:url, sitemap <loc>, robots line, JSON-LD @id and llms.txt link
 * is built from this. Apex, no trailing slash. Deliberately not read from env: a stray NEXT_PUBLIC_SITE_URL
 * (for example the www host) must never split the site across two origins again.
 * Vercel serves the apex as the primary domain; www redirects to it with a 308.
 */
export const SITE_URL = "https://dreamsvin.com";

/**
 * Official profiles. One list, used by the footer, the /about page, Organization/Person `sameAs` and llms.txt,
 * so they never disagree.
 */
export const SOCIAL = {
  instagram: "https://www.instagram.com/dreamsvin.in/",
  linkedin: "https://in.linkedin.com/company/dreamsvinconsultancy",
  facebook: "https://www.facebook.com/p/Dreamsvin-Consultancy-61579511030293/",
  luma: "https://luma.com/calendar/cal-hNkrq3I7q7fPG55",
} as const;

export const FOUNDER_SOCIAL = {
  linkedin: "https://www.linkedin.com/in/isha-ostwal-2112641a9",
  instagram: "https://www.instagram.com/ishaostwal_/",
} as const;

/**
 * Real-world contact details. Every value comes from env so nothing
 * unverified is hard-coded. Missing values render as visible TODOs.
 */
export const site = {
  name: "DreamSVin",
  url: SITE_URL,
  calLink: process.env.NEXT_PUBLIC_CAL_LINK ?? "", // e.g. "dreamsvin/diagnostic"
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "", // E.164 digits only, e.g. "9198XXXXXXXX"
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "grow@dreamsvin.com",
  city: process.env.NEXT_PUBLIC_CITY ?? "",
  hours: process.env.NEXT_PUBLIC_HOURS ?? "",
} as const;

export const whatsappHref = (text = "Hello DreamSVin — I'd like to talk about my business.") =>
  site.whatsapp ? `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(text)}` : undefined;

/** Named events for Stage 09 pages; sent through the site-wide tracker. */
type EventName =
  | "Contact Submitted"
  | "Contact Failed"
  | "Cal Booking Opened"
  | "Cal Booking Completed"
  | "WhatsApp Clicked"
  | "Email Clicked"
  | "Insight Read 75%"
  | "404 Link Clicked";

export function track(name: EventName, props?: Record<string, string>) {
  trackSite(name, props);
}
