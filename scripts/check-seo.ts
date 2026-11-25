// Crawls every URL in the sitemap of a running build and checks the SEO basics.
//   npm run build && npm start   (in another terminal)
//   npm run check:seo                         # against http://localhost:3000
//   npm run check:seo -- https://<preview>    # against a deployment
// Checks, per page: exactly one canonical, equal to SITE_URL + path; title ≤ 60 and description ≤ 155
// characters; every JSON-LD block parses as JSON with a schema.org @context; every @id / url / item in it is on
// SITE_URL (or an external profile); no page outside SITE_URL in the sitemap. Exits 1 on any failure.
import { SITE_URL } from "../lib/site";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const fails: string[] = [];
const fail = (page: string, msg: string) => fails.push(`${page}: ${msg}`);

const attr = (tag: string, name: string) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const decode = (s: string) => s.replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function walk(node: unknown, visit: (k: string, v: unknown) => void) {
  if (Array.isArray(node)) node.forEach((n) => walk(n, visit));
  else if (node && typeof node === "object") for (const [k, v] of Object.entries(node)) { visit(k, v); walk(v, visit); }
}

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!locs.length) fail("sitemap", "no <loc> entries");
for (const loc of locs) if (!loc.startsWith(SITE_URL)) fail("sitemap", `off-origin URL ${loc}`);

const types = new Map<string, Set<string>>();
for (const loc of locs) {
  const path = loc.slice(SITE_URL.length) || "/";
  const res = await fetch(`${base}${path}`, { redirect: "manual" });
  if (res.status !== 200) { fail(path, `status ${res.status}`); continue; }
  const html = await res.text();

  const canon = [...html.matchAll(/<link[^>]+rel="canonical"[^>]*>/g)].map((m) => attr(m[0], "href"));
  const want = path === "/" ? SITE_URL : `${SITE_URL}${path}`;
  if (canon.length !== 1) fail(path, `${canon.length} canonical tags`);
  else if (canon[0] !== want) fail(path, `canonical ${canon[0]} ≠ ${want}`);

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  if (!title) fail(path, "no <title>");
  if (title.length > 60) fail(path, `title is ${title.length} chars: ${title}`);
  const desc = decode(attr(html.match(/<meta name="description"[^>]*>/)?.[0] ?? "", "content") ?? "");
  if (!desc) fail(path, "no meta description");
  if (desc.length > 155) fail(path, `description is ${desc.length} chars`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  const found = new Set<string>();
  for (const b of blocks) {
    let data: unknown;
    try { data = JSON.parse(b); } catch (e) { fail(path, `JSON-LD does not parse: ${(e as Error).message}`); continue; }
    if ((data as { "@context"?: string })["@context"] !== "https://schema.org") fail(path, "JSON-LD without schema.org @context");
    walk(data, (k, v) => {
      if (k === "@type" && typeof v === "string") found.add(v);
      if ((k === "@id" || k === "url" || k === "item" || k === "mainEntityOfPage") && typeof v === "string" && v.includes("dreamsvin.com") && !v.startsWith(SITE_URL))
        fail(path, `JSON-LD ${k} off-origin: ${v}`);
    });
  }
  types.set(path, found);
}

for (const [path, t] of types) console.log(`${path.padEnd(44)} ${[...t].sort().join(", ")}`);
const home = types.get("/");
for (const t of ["Organization", "Person", "ProfessionalService", "WebSite", "FAQPage"]) if (!home?.has(t)) fail("/", `missing ${t}`);
if (!types.get("/about")?.has("Person")) fail("/about", "missing Person");

const robots = await (await fetch(`${base}/robots.txt`)).text();
if (/^Host:/im.test(robots)) fail("robots.txt", "has a Host: line");
if (!robots.includes("Disallow: /api/")) fail("robots.txt", "/api/ not disallowed");
if (!robots.includes(`Sitemap: ${SITE_URL}/sitemap.xml`)) fail("robots.txt", "Sitemap line not on SITE_URL");

for (const p of ["/about-us-nope", "/definitely-not-a-page"]) {
  const r = await fetch(`${base}${p}`, { redirect: "manual" });
  if (r.status !== 404) fail(p, `unknown route returned ${r.status}, expected 404`);
}

console.log(`\n${locs.length} pages checked.`);
if (fails.length) {
  console.error(`\n${fails.length} problem(s):\n  ${fails.join("\n  ")}`);
  process.exit(1);
}
console.log("All SEO checks passed.");
