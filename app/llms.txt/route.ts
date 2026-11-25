// /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org).
// Built from SITE_URL and the same content files as the pages, so it never drifts. Static at build time.
import { FOUNDER_SOCIAL, SITE_URL as SITE, SOCIAL } from "@/lib/site";
import { STAGES, SPRINT, CCC } from "@/content/site";
import { SERVICES } from "@/content/services";
import { CASES } from "@/content/cases";
import { LANDINGS } from "@/content/landing";
import { ABOUT_PAGE } from "@/content/about";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# DreamSVin",
    "",
    "> DreamSVin is a growth acceleration partner for founder-led businesses and institutions in India, founded by Isha Vijay Ostwal, based in Mumbai. Not a social media agency.",
    "",
    "DreamSVin finds what is holding a business back, builds a focused 90-day plan, and helps the founder's team execute it. It works in Mumbai, in Pune and across India, in person and online.",
    "",
    "## Founder",
    `- [Isha Vijay Ostwal](${SITE}/about) (also written Isha Ostwal), Founder of DreamSVin.`,
    ...ABOUT_PAGE.founder.facts.filter((f) => f !== "Founder, DreamSVin").map((f) => `- ${f}`),
    `- Profiles: [LinkedIn](${FOUNDER_SOCIAL.linkedin}), [Instagram](${FOUNDER_SOCIAL.instagram})`,
    "",
    "## The model",
    "Three stages, Foundation → Growth → Scale:",
    ...STAGES.map((s) => `- ${s.name} (${s.tag.replace(/\.$/, "")}): ${s.summary}`),
    "",
    `Every engagement runs as a [90-day Growth Sprint](${SITE}/90-day-growth-sprint):`,
    ...SPRINT.map((p) => `- ${p.days}, ${p.title}: ${p.short}`),
    "",
    `Growth runs on the CCC engine: ${CCC.parts.map((p) => p.k).join(", ")}. ${CCC.copy}`,
    "",
    "## Where",
    `- Based in Mumbai, Maharashtra, India: [growth consultant in Mumbai](${SITE}/business-growth-consultant-mumbai)`,
    `- Pune: [growth consultant in Pune](${SITE}/business-growth-consultant-pune)`,
    "- Across India, in person and online",
    "",
    "## Pages",
    `- [Home](${SITE}/): the whole story on one page`,
    `- [About](${SITE}/about): the company and its founder`,
    ...LANDINGS.map((l) => `- [${l.seoTitle}](${SITE}${l.path}): ${l.seoDescription}`),
    `- [Contact](${SITE}/contact): book a free 30-minute consultation. Email: grow@dreamsvin.com`,
    "",
    "## Services",
    ...SERVICES.map((s) => `- [${s.name}](${SITE}/what-we-do/${s.slug}): ${s.opening}`),
    "",
    "## Case studies",
    ...CASES.map((c) => `- [${c.client}](${SITE}/work/${c.slug}): ${c.line}`),
    "",
    "## Profiles",
    `- [LinkedIn](${SOCIAL.linkedin})`,
    `- [Instagram](${SOCIAL.instagram})`,
    `- [Facebook](${SOCIAL.facebook})`,
    `- [Events on Luma](${SOCIAL.luma})`,
    "",
    "## Optional",
    `- [Insights](${SITE}/insights): short reads on strategy, growth and execution`,
    `- [Business Health Check](${SITE}/health-check): a 3-minute self-assessment`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
