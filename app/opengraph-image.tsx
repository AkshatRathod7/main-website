import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "DreamSVin. Your Business Architects. Your Growth Partners.";

export default function Image() {
  return ogImage({ eyebrow: "Build · Grow · Scale", lead: "Your Business Architects.", serif: "Your Growth Partners." });
}
