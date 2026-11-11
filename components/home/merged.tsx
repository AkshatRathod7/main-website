import Link from "next/link";
import { BrandIcon } from "@/components/brand/icons";
import { Reveal, Spotlight } from "@/components/brand/motion";
import { Head } from "@/components/brand/sections";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { FAQ } from "@/content/site";
import { SERVICES } from "@/content/services";
import { formatDate, type InsightMeta } from "@/lib/insights";

/**
 * Sections that used to live only on the inner pages, merged into the home page
 * (the home page is the site; the inner pages keep the deep detail).
 */

/** What we do: the five services, each linking to its own detail page. */
export function HomeServices() {
  return (
    <section aria-labelledby="services-h" className="pb-section">
      <div className="container-ds">
        <Head id="services-h" kicker="Services" lines={["Five ways in."]} intro="Each service runs on the same 90-day rhythm, with the same team behind it." />
        <Reveal as="ul" className="mt-14 grid gap-4 md:grid-cols-6">
          {SERVICES.map((s, i) => (
            <li key={s.slug} className={i < 2 ? "md:col-span-3" : "md:col-span-2"}>
              <Link
                href={`/what-we-do/${s.slug}`}
                className="rv group block h-full rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus"
                style={{ ["--i" as string]: i }}
              >
                <Spotlight className="svc-card lift flex h-full min-h-[260px] flex-col rounded-3xl p-6 md:p-8" data-tint={i % 5}>
                  <span className="flex items-start justify-between">
                    <BrandIcon name={s.icon} size={44} />
                    <span aria-hidden="true" className="nudge text-heading-md text-fg-subtle">↗</span>
                  </span>
                  <span className="svc-stage label-mono mt-auto pt-10">{s.stage}</span>
                  <span className="mt-2 block font-display text-heading-md font-bold">{s.name}</span>
                  <span className="mt-2 block text-body text-fg-muted">{s.headline}</span>
                </Spotlight>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/** How we work: the questions founders ask first. */
export function HomeFaq() {
  return (
    <section aria-labelledby="faq-h" className="py-section">
      <div className="container-ds grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 id="faq-h" className="text-display-md">
            Questions we hear first.
          </h2>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Accordion items={FAQ.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={[0]} />
        </div>
      </div>
    </section>
  );
}

/** Insights: the latest three essays; each essay stays its own page. */
export function HomeInsights({ items }: { items: InsightMeta[] }) {
  if (!items.length) return null;
  return (
    <section aria-labelledby="insights-h" className="py-section" data-tone="paper">
      <div className="container-ds">
        <Head
          id="insights-h"
          kicker="Insights"
          lines={["Notes on building what lasts."]}
          intro="Short reads on strategy, growth and execution, from the work."
          aside={
            <ButtonLink href="/insights" variant="tertiary" arrow className="mt-4">
              All essays
            </ButtonLink>
          }
        />
        <Reveal as="ul" className={`mt-14 grid gap-4 ${items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
          {items.slice(0, 3).map((a, i) => (
            <li key={a.slug}>
              <Link
                href={`/insights/${a.slug}`}
                className="rv lift group flex h-full min-h-[260px] flex-col rounded-3xl bg-bg-elevated p-6 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus md:p-8"
                style={{ ["--i" as string]: i }}
              >
                <span className="label-mono text-accent-text">
                  {a.category} · {a.minutes} min
                </span>
                <span className="mt-4 block font-display text-heading-md font-bold">{a.title}</span>
                <span className="mt-3 block text-body text-fg-muted">{a.dek}</span>
                <span className="mt-auto flex items-center justify-between pt-8 text-body-sm text-fg-subtle">
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                  <span aria-hidden="true" className="nudge">→</span>
                </span>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
