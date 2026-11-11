import { pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow } from "@/components/editorial/primitives";
import { Reveal } from "@/components/editorial/reveal";
import { formatDate, getAllInsights } from "@/lib/insights";

export const metadata: Metadata = pageMetadata({
    ownImage: true,
  title: "Insights",
  description:
    "Short reads for founders and leadership teams on building, growing and scaling a business, from the DreamSVin team.",
  path: "/insights",
});

export default async function InsightsIndex() {
  const all = await getAllInsights();
  const lead = all.find((a) => a.featured) ?? all[0];
  const rest = all.filter((a) => a.slug !== lead?.slug);

  return (
    <>
      <section className="pt-40 pb-20 md:pt-52 md:pb-28">
        <Container className="grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Eyebrow>Insights</Eyebrow>
            <h1 className="reveal-load display mt-6 text-display-xl">
              Notes on building <span className="serif-accent">what lasts.</span>
            </h1>
          </div>
          <p className="text-body-lg leading-[1.45] text-muted md:col-span-4">
            Short reads on strategy, growth and execution: what we see while helping businesses build, grow and scale.
          </p>
        </Container>
      </section>

      {lead && (
        <section aria-label="Latest essay" className="pb-20 md:pb-28">
          <Container>
            <Link
              href={`/insights/${lead.slug}`}
              className="group grid gap-10 rounded-xl bg-paper p-8 text-ink transition-transform duration-500 ease-out hover:-translate-y-0.5 sm:p-12 md:grid-cols-12 md:p-16"
            >
              <div className="md:col-span-7">
                <p className="font-mono text-caption uppercase tracking-[0.14em] text-ink-muted">
                  {lead.category} · {lead.minutes} min read
                </p>
                <h2 className="mt-6 text-display-md font-medium leading-[1.02] tracking-[-0.035em]">
                  {lead.title}
                </h2>
              </div>
              <div className="flex flex-col justify-between gap-10 md:col-span-4 md:col-start-9">
                <p className="font-serif text-heading-md italic leading-[1.35] text-ink">{lead.dek}</p>
                <span className="inline-flex items-center gap-3 text-body-sm font-medium">
                  Read the essay
                  <svg viewBox="0 0 16 16" aria-hidden className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1">
                    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </Link>
          </Container>
        </section>
      )}

      <section aria-labelledby="all-h" className="pb-32 md:pb-48">
        <Container>
          <div className="mb-6 flex items-baseline justify-between">
            <h2 id="all-h" className="eyebrow">All essays</h2>
            <span className="eyebrow tabular-nums">{String(all.length).padStart(2, "0")}</span>
          </div>
          <ul className="border-t border-hairline">
            {(lead ? [lead, ...rest] : rest).map((a, i) => (
              <Reveal as="li" key={a.slug} delay={i * 60}>
                <Link
                  href={`/insights/${a.slug}`}
                  className="group grid gap-3 border-b border-hairline py-8 transition-colors duration-200 hover:border-hairline-strong md:grid-cols-12 md:items-baseline md:gap-8"
                >
                  <time dateTime={a.date} className="font-mono text-caption tabular-nums text-subtle md:col-span-2">
                    {formatDate(a.date)}
                  </time>
                  <span className="text-heading-md font-medium leading-[1.15] tracking-[-0.02em] transition-colors duration-200 group-hover:text-accent md:col-span-6">
                    {a.title}
                  </span>
                  <span className="text-body-sm text-muted md:col-span-3">{a.dek}</span>
                  <span className="eyebrow md:col-span-1 md:text-right">{a.minutes} min</span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
