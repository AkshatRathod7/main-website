// Service page. Template from the copy doc: headline, who it's for, what you get, how it runs in 90 days,
// one related case, CTA.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMetadata, JsonLd, graph, breadcrumbNode } from "@/lib/seo";
import { Reveal } from "@/components/brand/motion";
import { BrandIcon } from "@/components/brand/icons";
import { CaseCard, FinalCta, Head, PageHero } from "@/components/brand/sections";
import { SERVICES, serviceBySlug } from "@/content/services";
import { SPRINT, STAGES } from "@/content/site";
import { caseBySlug } from "@/content/cases";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.name, description: `${s.headline} ${s.opening}`, path: `/what-we-do/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const stage = STAGES.find((x) => x.key === s.stage)!;
  const related = caseBySlug(s.related);
  const idx = SERVICES.findIndex((x) => x.slug === s.slug);
  const next = SERVICES[(idx + 1) % SERVICES.length];

  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbNode([
            { name: s.name, path: `/what-we-do/${s.slug}` },
          ]),
          { "@type": "Service", name: s.name, description: s.opening, provider: { "@id": `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://dreamsvin.com"}/#organization` } },
        )}
      />
      <PageHero kicker={`${stage.name} · ${s.name}`} lines={[s.headline]} sub={s.opening} icon={s.icon} />

      {/* Who it's for + what you get */}
      <section aria-labelledby="for-h" className="py-section-sm">
        <div className="container-ds grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 id="for-h" className="label-mono text-fg-subtle">
              Who it's for
            </h2>
            <Reveal as="ul" className="mt-6 grid gap-3">
              {s.forWho.map((w, i) => (
                <li key={w} className="rv flex items-start gap-4 rounded-2xl bg-bg-elevated p-5 text-body-lg" style={{ ["--i" as string]: i }}>
                  <BrandIcon name="spark" size={24} className="mt-0.5" />
                  {w}
                </li>
              ))}
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7">
            <h2 className="label-mono text-fg-subtle">What you get</h2>
            <Reveal as="ul" className="mt-6 border-b border-line">
              {s.get.map((g, i) => (
                <li key={g} className="rv flex items-baseline gap-5 py-4" style={{ ["--i" as string]: i }}>
                  <span className="numeric text-body-sm text-accent-text">0{i + 1}</span>
                  <span className="font-display text-heading-md font-bold">{g}</span>
                </li>
              ))}
            </Reveal>
            <p className="mt-6 text-body-sm text-fg-subtle">Some work we deliver ourselves. Some we deliver with trusted partners. We tell you which, up front.</p>
          </div>
        </div>
      </section>

      {/* 90 days */}
      <section aria-labelledby="ninety-h" data-tone="ink" className="py-section">
        <div className="container-ds">
          <Head id="ninety-h" kicker="The 90-day sprint" lines={["How it runs in 90 days."]} intro="The same four steps as every engagement. You always know what is happening and who owns it." />
          <Reveal as="ol" className="mt-14 grid gap-4 md:grid-cols-4">
            {SPRINT.map((p, i) => (
              <li key={p.title} className="rv flex flex-col rounded-3xl bg-bg-raised p-6" style={{ ["--i" as string]: i }}>
                <span className="label-mono text-accent-text">{p.days}</span>
                <h3 className="mt-6 text-heading-lg">{p.title}</h3>
                <p className="mt-3 text-body text-fg-muted">{s.sprint[i]}</p>
                <span aria-hidden="true" className="mt-auto block pt-8">
                  <span className="block h-1 rounded-full bg-line">
                    <span className="block h-full rounded-full bg-gradient-to-r from-coral to-gold" style={{ width: `${((i + 1) / 4) * 100}%` }} />
                  </span>
                </span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Related case */}
      {related && (
        <section aria-labelledby="related-h" className="py-section">
          <div className="container-ds grid gap-10 md:grid-cols-12 md:items-center">
            <div className="md:col-span-4">
              <p className="text-body font-semibold tracking-[-0.01em] text-accent-text">Related work</p>
              <h2 id="related-h" className="mt-4 text-display-md">
                {related.client}
              </h2>
              <p className="mt-4 text-body-lg text-fg-muted">{related.line}</p>
            </div>
            <Reveal className="md:col-span-7 md:col-start-6">
              <CaseCard c={related} />
            </Reveal>
          </div>
        </section>
      )}

      <nav aria-label="Next service" className="bg-bg-raised">
        <Link href={`/what-we-do/${next.slug}`} className="group container-ds flex min-h-24 items-center justify-between gap-6 py-8 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-focus">
          <span>
            <span className="label-mono block text-fg-subtle">Next service</span>
            <span className="mt-2 block font-display text-heading-lg font-bold">{next.name}</span>
          </span>
          <span aria-hidden="true" className="nudge text-display-md">→</span>
        </Link>
      </nav>

      <FinalCta title={`${stage.cta}.`} copy="Book a free consultation. We'll look at where you are and what a focused 90 days could change." />
    </>
  );
}
