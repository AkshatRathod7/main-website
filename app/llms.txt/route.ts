// /llms.txt: a plain-text map of the site for AI assistants and answer engines (llmstxt.org).
// Built from the same content files as the pages, so it never drifts. Static at build time.
import { SITE } from "@/lib/seo";
import { HERO, STAGES } from "@/content/site";
import { SERVICES } from "@/content/services";
import { CASES } from "@/content/cases";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# DreamSVin",
    "",
    `> Business architects and growth partners. ${HERO.sub}`,
    "",
    "DreamSVin works with founders, established businesses, institutions and leadership teams in three stages:",
    ...STAGES.map((s) => `- ${s.name} (${s.tag.replace(/\.$/, "")}): ${s.summary}`),
    "Every engagement runs as a 90-day sprint: Diagnose, Plan, Execute, Optimise. Growth runs on the CCC engine: Content, Community and Collaborations.",
    "",
    "## Pages",
    `- [Home](${SITE}/): the whole story on one page, in chapters:`,
    `  - [What We Do](${SITE}/#what-we-do): the three stages, services and capabilities`,
    `  - [How We Work](${SITE}/#how-we-work): the 90-day sprint, what to expect, FAQ`,
    `  - [Our Work](${SITE}/#work): case studies`,
    `  - [About](${SITE}/#about): who it's for, beliefs, founder Isha Vijay Ostwal`,
    `  - [Insights](${SITE}/insights): essays`,
    `- [Contact](${SITE}/contact): book a free 30-minute consultation`,
    "",
    "## Services",
    ...SERVICES.map((s) => `- [${s.name}](${SITE}/what-we-do/${s.slug}): ${s.opening}`),
    "",
    "## Case studies",
    ...CASES.map((c) => `- [${c.client}](${SITE}/work/${c.slug}): ${c.line}`),
    "",
    "## Optional",
    `- [Insights](${SITE}/insights): short reads on strategy, growth and execution`,
    `- [Business Health Check](${SITE}/health-check): a 3-minute self-assessment`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
