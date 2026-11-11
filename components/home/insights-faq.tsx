import Link from "next/link";
import { Reveal } from "@/components/brand/motion";
import { Kicker } from "@/components/brand/sections";
import { Accordion } from "@/components/ui/accordion";
import { ButtonLink } from "@/components/ui/button";
import { FAQ } from "@/content/site";
import { formatDate, type InsightMeta } from "@/lib/insights";

/**
 * Home, Insights and questions: read on the left, ask on the right. One screen instead of two
 * (it replaces HomeInsights + HomeFaq on the home page). Both columns are ruled lists, so they read as a pair.
 * The FAQ keeps every item and the same accordion; its JSON-LD stays in page.tsx (FAQ_SCHEMA).
 * Styles: styles/home-c.css (.iq-*).
 */
export function HomeInsightsFaq({ items }: { items: InsightMeta[] }) {
  const essays = items.slice(0, 2);
  return (
    <section aria-labelledby={essays.length ? "insights-h" : "faq-h"} className="py-section">
      <Reveal className="container-ds iq-grid" data-solo={essays.length ? undefined : ""}>
        {essays.length > 0 && (
          <div className="iq-col">
            <Kicker className="rv">Insights</Kicker>
            <h2 id="insights-h" className="rv iq-h">
              Notes on building what lasts.
            </h2>
            <ul className="iq-list">
              {essays.map((a, i) => (
                <li key={a.slug} className="rv" style={{ ["--i" as string]: i + 1 }}>
                  <Link href={`/insights/${a.slug}`} className="iq-row">
                    <span>
                      <span className="iq-meta">
                        <b>{a.category}</b>
                        <span>{a.minutes} min read</span>
                        <time dateTime={a.date}>{formatDate(a.date)}</time>
                      </span>
                      <span className="iq-title">{a.title}</span>
                      <span className="iq-dek">{a.dek}</span>
                    </span>
                    <span aria-hidden="true" className="iq-go">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="rv iq-foot" style={{ ["--i" as string]: 3 }}>
              <p>Short reads on strategy, growth and execution, from the work.</p>
              <ButtonLink href="/insights" variant="tertiary" arrow>
                All essays
              </ButtonLink>
            </div>
          </div>
        )}

        <div className="iq-col">
          <Kicker className="rv" >Before we talk</Kicker>
          <h2 id="faq-h" className="rv iq-h">
            Questions we hear first.
          </h2>
          <div className="rv" style={{ ["--i" as string]: 2 }}>
            <Accordion items={FAQ.map((f) => ({ q: f.q, a: f.a }))} defaultOpen={[0]} className="iq-faq-list" />
          </div>
        </div>
      </Reveal>
    </section>
  );
}
