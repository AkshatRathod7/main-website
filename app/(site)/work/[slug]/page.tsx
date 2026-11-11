// Case study. Template from the copy doc: hero, one-line summary, Challenge, Mandate, What we built,
// Impact, What's next, client quote slot, related cases, CTA.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, JsonLd, graph, breadcrumbNode } from "@/lib/seo";
import { Headline } from "@/components/ui/headline";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/brand/motion";
import { CaseCard, FinalCta, Kicker } from "@/components/brand/sections";
import { CASES, caseBySlug, showQuote } from "@/content/cases";
import { PRIMARY_CTA } from "@/content/site";

export function generateStaticParams() {
  return CASES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const c = caseBySlug((await params).slug);
  if (!c) return {};
  return pageMetadata({
    ownImage: true, title: `${c.client}: ${c.line.replace(/\.$/, "")}`, description: c.challenge, path: `/work/${c.slug}`, type: "article" });
}

export default async function CasePage({ params }: { params: Promise<{ slug: string }> }) {
  const c = caseBySlug((await params).slug);
  if (!c) notFound();
  const idx = CASES.findIndex((x) => x.slug === c.slug);
  const related = [CASES[(idx + 1) % CASES.length], CASES[(idx + 2) % CASES.length]];

  const blocks = [
    { k: "Challenge", v: c.challenge },
    { k: "Mandate", v: c.mandate },
  ];

  return (
    <>
      <JsonLd
        data={graph(breadcrumbNode([
          { name: c.client, path: `/work/${c.slug}` },
        ]))}
      />
      <section aria-labelledby="page-h" className="hero pb-section-sm pt-[calc(var(--nav-height)+clamp(2.5rem,6vw,5rem))]">
        <span aria-hidden="true" className="hero-glow" />
        <div className="container-ds">
          <nav aria-label="Breadcrumb" className="mb-8">
            <Link href="/#work" className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-body-sm text-fg-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
              <span aria-hidden="true" className="transition-transform duration-base ease-out group-hover:-translate-x-1">←</span> Our Work
            </Link>
          </nav>
          <Kicker>
            {c.track} · {c.sector} · {c.focus}
          </Kicker>
          <Headline as="h1" id="page-h" size="display-xl" reveal="load" lines={[c.client]} className="mt-6" />
          <p className="mt-6 max-w-[40ch] font-display text-heading-lg font-bold text-fg-muted">{c.line}</p>
          <div className="case-card mt-12" data-tone-card={c.tone}>
            <div className="case-art relative flex min-h-[220px] sm:aspect-[21/9] items-end justify-between overflow-hidden rounded-[32px] p-6 md:p-12">
              <p aria-hidden="true" className="case-art-mark text-[clamp(4rem,14vw,13rem)]">{c.client}</p>
              {c.result && (
                <p className="relative hidden text-right md:block">
                  <span className="result-v block">{c.result.v}</span>
                  <span className="case-art-sub mt-2 block max-w-[20ch] text-body-sm">{c.result.k}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <article aria-labelledby="page-h" className="pb-section">
        <div className="container-ds grid gap-12 md:grid-cols-12">
          <aside className="md:col-span-3">
            <dl className="grid gap-5 md:sticky md:top-[calc(var(--nav-height)+32px)]">
              {[
                ["Client", c.client],
                ["Sector", c.sector],
                ["Track", c.track],
                ["Focus", c.focus],
              ].map(([k, v]) => (
                <div key={k} className="pt-3">
                  <dt className="label-mono text-fg-subtle">{k}</dt>
                  <dd className="mt-1 text-body">{v}</dd>
                </div>
              ))}
            </dl>
          </aside>

          <div className="md:col-span-8 md:col-start-5">
            {blocks.map((b) => (
              <section key={b.k} className="py-10">
                <h2 className="label-mono text-accent-text">{b.k}</h2>
                <p className="mt-4 font-display text-heading-lg font-bold">{b.v}</p>
              </section>
            ))}

            <section className="py-10">
              <h2 className="label-mono text-accent-text">What we built</h2>
              <Reveal as="ul" className="mt-6 grid gap-3">
                {c.built.map((b, i) => (
                  <li key={b} className="rv flex gap-4 rounded-2xl bg-bg-raised p-5 text-body-lg" style={{ ["--i" as string]: i }}>
                    <span className="numeric pt-1 text-body-sm text-fg-subtle">0{i + 1}</span>
                    {b}
                  </li>
                ))}
              </Reveal>
            </section>

            <section className="py-10">
              <h2 className="label-mono text-accent-text">Impact</h2>
              <p className="mt-4 flex flex-wrap items-center gap-3 font-display text-heading-lg font-bold">
                {c.impactInProgress && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-highlight px-3 py-1 font-sans text-body-sm font-semibold text-charcoal">
                    <span aria-hidden="true" className="size-1.5 animate-pulse rounded-full bg-charcoal" /> In progress
                  </span>
                )}
                {c.impact}
              </p>
            </section>

            <section className="py-10">
              <h2 className="label-mono text-accent-text">What's next</h2>
              <p className="mt-4 text-body-lg text-fg-muted">{c.next}</p>
            </section>

            {showQuote(c.quote) && (
              <figure className="rounded-[12px] bg-coral p-8 text-charcoal md:p-12">
                <blockquote className="font-display text-display-md font-extrabold">“{c.quote.text}”</blockquote>
                <figcaption className="mt-6 text-body font-semibold">{c.quote.by}</figcaption>
              </figure>
            )}

            <div className="mt-12 flex flex-col gap-3 rounded-[12px] border border-line p-6 md:flex-row md:items-center md:justify-between md:p-8">
              <p className="font-display text-heading-md font-bold">Want a case like this?</p>
              <ButtonLink href={PRIMARY_CTA.href} size="lg" arrow data-event={`Case CTA ${c.client}`}>
                {PRIMARY_CTA.label}
              </ButtonLink>
            </div>
          </div>
        </div>
      </article>

      <section aria-labelledby="more-h" className="py-section-sm">
        <div className="container-ds">
          <h2 id="more-h" className="text-display-md">
            More work
          </h2>
          <Reveal className="mt-10 grid gap-x-6 gap-y-12 md:grid-cols-2">
            {related.map((r, i) => (
              <CaseCard key={r.slug} c={r} i={i} />
            ))}
          </Reveal>
        </div>
      </section>

      <FinalCta title="Your business could be the next case." copy="Tell us where you are. We'll show you how we would start." />
    </>
  );
}
