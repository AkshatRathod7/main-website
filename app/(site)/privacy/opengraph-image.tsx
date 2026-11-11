import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "DreamSVin privacy notice.";

export default function Image() {
  return ogImage({ eyebrow: "Legal", lead: "Privacy", serif: "notice." });
}
