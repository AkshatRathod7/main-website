import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const alt = "DreamSVin Business Health Check: what's holding your business back?";
export const size = ogSize;
export const contentType = ogContentType;

/** Same brand card as every other route: cream, charcoal, coral rule, gold edge band, the wordmark. */
export default function OgImage() {
  return ogImage({
    eyebrow: "Business Health Check · 3 minutes",
    lead: "What's holding your business back?",
    serif: "14 questions. A score out of 100.",
  });
}
