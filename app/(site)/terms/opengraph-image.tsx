import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "DreamSVin terms of use.";

export default function Image() {
  return ogImage({ eyebrow: "Legal", lead: "Terms of", serif: "use." });
}
