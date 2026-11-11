import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Contact DreamSVin.";

export default function Image() {
  return ogImage({ eyebrow: "Book a Free Consultation", lead: "Let's find what's holding your business back." });
}
