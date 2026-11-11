import { ogImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "Insights from DreamSVin: notes on building, growing and scaling.";

export default function Image() {
  return ogImage({ eyebrow: "Insights", lead: "Insights.", serif: "Notes on building, growing and scaling." });
}
