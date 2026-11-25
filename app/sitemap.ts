import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getAllInsights } from "@/lib/insights";
import { CASES } from "@/content/cases";
import { SERVICES } from "@/content/services";
import { LANDINGS } from "@/content/landing";

/**
 * Every indexable route, on SITE_URL only. /api is excluded; /privacy and /terms stay out while they are noindex.
 * lastModified is the date the page's copy last changed, not the build time. Update the date beside a page
 * when you change its words (insights read `updated` / `date` from their frontmatter; landing pages read
 * `updated` in content/landing.ts).
 */
const FIXED: { path: string; updated: string; priority: number; changeFrequency: "weekly" | "monthly" | "yearly" }[] = [
  { path: "/", updated: "2026-11-25", priority: 1, changeFrequency: "monthly" },
  { path: "/about", updated: "2026-11-25", priority: 0.8, changeFrequency: "monthly" },
  { path: "/health-check", updated: "2026-11-11", priority: 0.6, changeFrequency: "monthly" },
  { path: "/insights", updated: "2026-11-11", priority: 0.7, changeFrequency: "weekly" },
  { path: "/contact", updated: "2026-11-11", priority: 0.7, changeFrequency: "yearly" },
  { path: "/accessibility", updated: "2026-11-11", priority: 0.3, changeFrequency: "yearly" },
];
const SERVICES_UPDATED = "2026-11-25";
const CASES_UPDATED = "2026-11-11";

const url = (path: string) => `${SITE_URL}${path === "/" ? "" : path}`;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const insights = await getAllInsights();
  return [
    ...FIXED.map((r) => ({ url: url(r.path), lastModified: new Date(r.updated), changeFrequency: r.changeFrequency, priority: r.priority })),
    ...LANDINGS.map((l) => ({ url: url(l.path), lastModified: new Date(l.updated), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...SERVICES.map((s) => ({ url: url(`/what-we-do/${s.slug}`), lastModified: new Date(SERVICES_UPDATED), changeFrequency: "monthly" as const, priority: 0.7 })),
    ...CASES.map((c) => ({ url: url(`/work/${c.slug}`), lastModified: new Date(CASES_UPDATED), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...insights.map((a) => ({ url: url(`/insights/${a.slug}`), lastModified: new Date(a.updated ?? a.date), changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
