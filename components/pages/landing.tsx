// One template for the intent pages in content/landing.ts: hero, written sections, the four sprint phases,
// related case studies, a visible FAQ (with FAQPage schema), related pages and the call to action.
// Server-rendered and complete without JavaScript; the only motion is the shared Reveal.
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd, breadcrumbNode, faqNode, graph, organizationNode, pageMetadata, serviceNode } from "@/lib/seo";
import { Reveal } from "@/components/brand/motion";
import { CaseCard, FinalCta, Head, PageHero } from "@/components/brand/sections";
import { SPRINT } from "@/content/site";
import { caseBySlug } from "@/content/cases";
import { LANDING_LINKS, landingByPath, type Landing } from "@/content/landing";

const AREA = {
  india: { "@type": "Country", name: "India" },
  mumbai: { "@type": "City", name: "Mumbai", containedInPlace: { "@type": "State", name: "Maharashtra" } },
  pune: { "@type": "City", name: "Pune", containedInPlace: { "@type": "State", name: "Maharashtra" } },
  maharashtra: { "@type": "State", name: "Maharashtra", containedInPlace: { "@type": "Country", name: "India" } },
} as const;

function get(path: string): Landing {
  const l = landingByPath(path);
  if (!l) notFound();
  return l;
}

export function landingMetadata(path: string): Metadata {
  const l = get(path);
  return pageMetadata({ title: l.seoTitle, description: l.seoDescription, path: l.path });
}

const linkCls =
  "group inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-semibold text-fg underline decoration-line-strong underline-offset-[0.22em] hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus";

export function LandingPage({ path }: { path: string }) {
  const l = get(path);
  const cases = l.cases.map(caseBySlug).filter((c): c is NonNullable<typeof c> => Boolean(c));
  const before = l.sprintAfter === undefined ? l.sections : l.sections.slice(0, l.sprintAfter);
  const after = l.sprintAfter === undefined ? [] : l.sections.slice(l.sprintAfter);
  const others = LANDING_LINKS.filter((x) => x.href !== l.path);

  return (
    <>
      <JsonLd
        data={graph(
          organizationNode(),
          serviceNode({
            name: l.service.name,
            description: l.seoDescription,
            path: l.path,
            serviceType: l.service.type,
            ...(l.service.area ? { area: AREA[l.service.area] } : {}),
          }),
          breadcrumbNode([{ name: l.crumb, path: l.path }]),
          faqNode(l.faq.map((f) => ({ q: f.q, text: f.a }))),
        )}
      />
      <PageHero kicker={l.kicker} lines={l.h1} sub={l.sub} />

      <Sections items={before} />

      {l.sprintAfter !== undefined && (
        <section aria-labelledby="sprint-h" data-tone="ink" className="py-section">
          <div className="container-ds">
            <Head id="sprint-h" kicker="The 90-day Growth Sprint" lines={["How it runs in 90 days."]} intro={l.sprintIntro} />
            <ol className="mt-14 grid gap-4 md:grid-cols-4">
              {SPRINT.map((p) => (
                <li key={p.title} className="flex flex-col rounded-3xl bg-bg-raised p-6">
                  <span className="label-mono text-accent-text">{p.days}</span>
                  <h3 className="mt-6 text-heading-lg">{p.title}</h3>
                  <p className="mt-3 text-body text-fg-muted">{p.short}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      <Sections items={after} />

      {cases.length > 0 && (
        <section aria-labelledby="cases-h" className="py-section-sm">
          <div className="container-ds">
            <Head id="cases-h" kicker="Our work" lines={[l.casesTitle]} size="display-md" />
            <Reveal className={`mt-10 grid gap-6 ${cases.length > 1 ? "md:grid-cols-2" : ""}`}>
              {cases.map((c, i) => (
                <CaseCard key={c.slug} c={c} i={i} size={cases.length === 1 ? "wide" : "md"} />
              ))}
            </Reveal>
          </div>
        </section>
      )}

      <section aria-labelledby="faq-h" className="py-section-sm">
        <div className="container-ds grid gap-10 md:grid-cols-12">
          <h2 id="faq-h" className="text-display-md md:col-span-4">Questions</h2>
          <dl className="border-b border-line md:col-span-8">
            {l.faq.map((f) => (
              <div key={f.q} className="border-t border-line py-6">
                <dt className="font-display text-heading-sm font-bold">{f.q}</dt>
                <dd className="mt-3 max-w-measure text-body-lg text-fg-muted">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <nav aria-labelledby="more-h" className="py-section-sm">
        <div className="container-ds">
          <h2 id="more-h" className="label-mono text-fg-subtle">Related</h2>
          <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-1">
            {others.map((o) => (
              <li key={o.href}>
                <Link href={o.href} className={linkCls}>
                  {o.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/about" className={linkCls}>
                About DreamSVin
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      <FinalCta title={l.cta.title} copy={l.cta.copy} />
    </>
  );
}

function Sections({ items }: { items: Landing["sections"] }) {
  return (
    <>
      {items.map((s, i) => {
        const id = `s-${s.h2.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
        return (
          <section key={s.h2} aria-labelledby={id} className={i === 0 ? "pb-section-sm pt-4" : "py-section-sm"}>
            <div className="container-ds grid gap-8 md:grid-cols-12">
              <h2 id={id} className="text-display-md md:col-span-4">
                {s.h2}
              </h2>
              <div className="grid gap-5 md:col-span-7 md:col-start-6">
                {s.paras?.map((p) => (
                  <p key={p.slice(0, 32)} className="max-w-measure text-body-lg text-fg-muted">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="grid gap-3">
                    {s.list.map((li) => (
                      <li key={li} className="flex items-start gap-4 rounded-2xl bg-bg-elevated p-5 text-body-lg">
                        <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" />
                        {li}
                      </li>
                    ))}
                  </ul>
                )}
                {s.links && (
                  <ul className="flex flex-wrap gap-x-8">
                    {s.links.map((lk) => (
                      <li key={lk.href}>
                        <Link href={lk.href} className={linkCls}>
                          {lk.label}
                          <span aria-hidden="true" className="nudge">→</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
