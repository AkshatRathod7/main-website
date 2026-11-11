import { ogImage, ogSize, ogContentType } from "@/lib/og";
import { getAllInsights, getInsight } from "@/lib/insights";

export const size = ogSize;
export const contentType = ogContentType;
export const alt = "DreamSVin insight";

export async function generateStaticParams() {
  return (await getAllInsights()).map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const item = await getInsight((await params).slug);
  return ogImage({
    eyebrow: `Insights${item?.meta.category ? ` · ${item.meta.category}` : ""}`,
    lead: item?.meta.title ?? "Insights from DreamSVin",
    tone: "paper",
  });
}
