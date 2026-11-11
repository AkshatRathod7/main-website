// Fails `npm run build:launch` while any visible placeholder (<Todo> / <ProofTodo>, TODO-CONFIRM) is still
// used on a page. The two files that define the markers are skipped. Skip the check with ALLOW_TODOS=1.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

if (process.env.ALLOW_TODOS === "1") process.exit(0);

const roots = ["app", "components", "content"];
const DEFINED_IN = ["components/ui/layout.tsx", "components/editorial/primitives.tsx"];
const hits: string[] = [];
const walk = (dir: string) => {
  let entries: string[] = [];
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) { if (name !== "node_modules") walk(p); continue; }
    if (!/\.(tsx?|mdx?)$/.test(name) || DEFINED_IN.some((f) => p.endsWith(f))) continue;
    readFileSync(p, "utf8").split("\n").forEach((line, i) => {
      if (/<(Proof)?Todo[\s>]|TODO-CONFIRM/.test(line)) hits.push(`${p}:${i + 1}`);
    });
  }
};
roots.forEach(walk);

if (hits.length) {
  console.error(`\n${hits.length} placeholder(s) still need real content:\n  ${hits.join("\n  ")}\n`);
  process.exit(1);
}
