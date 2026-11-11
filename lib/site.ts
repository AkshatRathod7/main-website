import { track as trackSite } from "@/lib/analytics";

/**
 * Real-world contact details. Every value comes from env so nothing
 * unverified is hard-coded. Missing values render as visible TODOs.
 */
export const site = {
  name: "DreamSVin",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamsvin.com",
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
