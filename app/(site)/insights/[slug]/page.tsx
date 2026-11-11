import { JsonLd, SITE, breadcrumbNode, graph, orgRef } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { Container } from "@/components/editorial/primitives";
import { mdxComponents } from "@/components/editorial/mdx";
import { formatDate, getAllInsights, getInsight } from "@/lib/insights";
import { site } from "@/lib/site";
import { ReadingProgress } from "./reading-progress";

type Params = { slug: string };

export async function generateStaticParams() {
  return (await getAllInsights()).map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const item = await getInsight((await params).slug);
  if (!item) return {};
  const { title, dek, date, slug } = item.meta;
  return {
    title,
    description: dek,
    alternates: { canonical: `/insights/${slug}` },
    openGraph: { type: "article", title, description: dek, publishedTime: date, url: `/insights/${slug}`, siteName: "DreamSVin", locale: "en_IN" },
    twitter: { card: "summary_large_image", title, description: dek },
  };
}

export default async function InsightPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const item = await getInsight(slug);
  if (!item) notFound();
  const { meta } = item;

  const { content } = await compileMDX({ source: item.content, components: mdxComponents, options: { parseFrontmatter: true } });

  const all = await getAllInsights();
  const next = all.find((a) => a.slug !== slug);

  const jsonLd = graph(
    {
      "@type": "Article",
      headline: meta.title,
      description: meta.dek,
      datePublished: meta.date,
      inLanguage: "en-IN",
      author: meta.author && meta.author !== site.name ? { "@type": "Person", name: meta.author } : orgRef,
      publisher: orgRef,
      image: `${SITE}/opengraph-image`,
      mainEntityOfPage: `${SITE}/insights/${slug}`,
    },
    breadcrumbNode([
      { name: "Insights", path: "/insights" },
      { name: meta.title, path: `/insights/${slug}` },
    ]),
  );

  return (
    <>
      <ReadingProgress />
      <JsonLd data={jsonLd} />

      {/* Title plate — dark, quiet */}
      <header className="pt-40 pb-20 md:pt-52 md:pb-28">
        <Container>
          <nav aria-label="Breadcrumb" className="eyebrow">
            <Link href="/insights" className="inline-flex min-h-11 items-center hover:text-ivory">Insights</Link>
            <span className="mx-2 text-hairline-strong">/</span>
            <span>{meta.category}</span>
          </nav>
          <h1 className="reveal-load display mt-8 max-w-[18ch] text-display-lg leading-[1]">{meta.title}</h1>
          <div className="mt-12 grid gap-8 border-t border-hairline pt-8 md:grid-cols-12">
            <p className="font-serif text-heading-md italic leading-[1.25] text-muted md:col-span-7">{meta.dek}</p>
            <dl className="grid grid-cols-3 gap-6 md:col-span-4 md:col-start-9 md:grid-cols-1 md:gap-3">
              {[
                ["Published", <time key="d" dateTime={meta.date}>{formatDate(meta.date)}</time>],
                ["Reading", `${meta.minutes} minutes`],
                ["By", meta.author],
              ].map(([k, v]) => (
                <div key={k as string} className="md:flex md:justify-between md:border-b md:border-hairline md:pb-3">
                  <dt className="eyebrow">{k}</dt>
                  <dd className="mt-1 text-body-sm md:mt-0">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </header>

      {/* Paper — the editorial moment */}
      <article className="bg-paper py-24 text-ink md:py-32">
        <Container className="relative lg:grid lg:grid-cols-12">
          {meta.toc.length > 2 && (
            <nav aria-label="In this essay" className="hidden lg:col-span-3 lg:block">
              <div className="sticky top-28">
                <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">In this essay</p>
                <ol className="space-y-2.5 text-body-sm leading-[1.35]">
                  {meta.toc.map((h, i) => (
                    <li key={h.id} className="flex gap-3">
                      <span className="font-mono text-[11px] tabular-nums text-ink-muted">{String(i + 1).padStart(2, "0")}</span>
                      <a href={`#${h.id}`} className="inline-flex min-h-8 items-center rounded-xs text-ink-muted transition-colors hover:text-ink">{h.text}</a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>
          )}
          <div className="prose-dsv lg:col-span-8 lg:col-start-4">{content}</div>
        </Container>
      </article>

      {/* Close — dark again */}
      <section className="border-t border-hairline py-28 md:py-40">
        <Container className="grid gap-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow">If this sounded familiar</p>
            <p className="display mt-5 text-display-md leading-[1.05]">
              Let’s find what’s holding you back. <span className="serif-accent text-muted">Then fix it together.</span>
            </p>
            <Link href="/contact" className="mt-10 inline-flex min-h-11 items-center rounded-full bg-btn px-6 text-body-sm font-medium text-on-btn transition-colors hover:bg-accent-hover">
              Book a Free Consultation
            </Link>
          </div>
          {next && (
            <Link href={`/insights/${next.slug}`} className="group self-end border-t border-hairline pt-6 md:col-span-5 md:col-start-8">
              <p className="eyebrow">Read next</p>
              <p className="mt-4 text-heading-md font-medium leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-accent">{next.title}</p>
              <p className="mt-3 text-body-sm text-muted">{next.dek}</p>
            </Link>
          )}
        </Container>
      </section>
    </>
  );
}
