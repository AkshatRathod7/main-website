import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo";
import { getAllInsights } from "@/lib/insights";
import { CASES } from "@/content/cases";
import { SERVICES } from "@/content/services";

/** Every indexable route. /api is excluded. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const fixed: { path: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "monthly" },
    { path: "/health-check", priority: 0.6, changeFrequency: "monthly" },
    { path: "/insights", priority: 0.7, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { path: "/accessibility", priority: 0.3, changeFrequency: "yearly" },
  ];
  const insights = await getAllInsights();

  return [
    ...fixed.map((r) => ({ url: `${SITE}${r.path === "/" ? "" : r.path}`, lastModified: now, changeFrequency: r.changeFrequency, priority: r.priority })),
    ...insights.map((a) => ({ url: `${SITE}/insights/${a.slug}`, lastModified: a.date ? new Date(a.date) : now, changeFrequency: "yearly" as const, priority: 0.6 })),
    ...SERVICES.map((s) => ({ url: `${SITE}/what-we-do/${s.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 })),
    ...CASES.map((c) => ({ url: `${SITE}/work/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
