import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { CASES, caseBySlug } from "@/content/cases";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "DreamSVin case study";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  return ogImage({ eyebrow: `Our Work · ${c?.sector ?? "Case study"}`, lead: c ? `${c.client}.` : "Real businesses.", serif: c ? c.line : "Real work." });
}
