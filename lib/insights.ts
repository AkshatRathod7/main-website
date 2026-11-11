import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const DIR = path.join(process.cwd(), "content", "insights");

const frontmatter = z.object({
  title: z.string(),
  dek: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  category: z.string(),
  author: z.string().default("DreamSVin"),
  featured: z.boolean().default(false),
  draft: z.boolean().default(false),
});

export type InsightMeta = z.infer<typeof frontmatter> & {
  slug: string;
  minutes: number;
  toc: { id: string; text: string }[];
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’'"“”]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

function readingMinutes(body: string) {
  const words = body.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 230));
}

function toc(body: string) {
  return [...body.matchAll(/^##\s+(.+)$/gm)].map((m) => ({ id: slugify(m[1]), text: m[1].trim() }));
}

async function load(file: string) {
  const raw = await fs.readFile(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  const meta = frontmatter.parse(data);
  return {
    meta: { ...meta, slug: file.replace(/\.mdx$/, ""), minutes: readingMinutes(content), toc: toc(content) } satisfies InsightMeta,
    content,
  };
}

const visible = (m: InsightMeta) => process.env.NODE_ENV !== "production" || !m.draft;

export async function getAllInsights(): Promise<InsightMeta[]> {
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith(".mdx"));
  const all = await Promise.all(files.map(async (f) => (await load(f)).meta));
  return all.filter(visible).sort((a, b) => b.date.localeCompare(a.date));
}

export async function getInsight(slug: string) {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  try {
    const item = await load(`${slug}.mdx`);
    return visible(item.meta) ? item : null;
  } catch {
    return null;
  }
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00+05:30`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
