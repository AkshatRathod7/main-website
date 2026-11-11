import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/editorial/primitives";

export type LegalSection = { id: string; title: string; body: ReactNode };

/**
 * Shared shell for /privacy and /terms. Dark canvas, 66ch measure, sticky
 * contents on desktop, and an unmissable "draft for review" banner until
 * `reviewed` is set true by counsel sign-off.
 */
export function LegalPage({
  title,
  intro,
  updated,
  reviewed = false,
  sections,
}: {
  title: string;
  intro: ReactNode;
  updated: string;
  reviewed?: boolean;
  sections: LegalSection[];
}) {
  return (
    <div className="pt-40 pb-32 md:pt-52 md:pb-48">
      <Container>
        {!reviewed && (
          <div role="note" className="mb-16 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-md border border-dashed border-accent/50 px-5 py-4">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent-text">Draft · for legal review</span>
            <span className="text-body-sm text-muted">
              Placeholder text. Not legal advice and not yet in force. Every bracketed item needs confirming by counsel before launch.
            </span>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-12">
          <header className="lg:col-span-12">
            <Eyebrow>Legal</Eyebrow>
            <h1 className="reveal-load display mt-6 text-display-xl">{title}</h1>
            <p className="mt-6 font-mono text-caption tabular-nums text-subtle">Last updated {updated}</p>
          </header>

          <nav aria-label="Contents" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-28 space-y-2.5 border-l border-hairline pl-5 text-body-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="flex min-h-8 items-center gap-3 rounded-xs text-subtle transition-colors hover:text-ivory">
                    <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="lg:col-span-8 lg:col-start-5">
            <div className="max-w-[66ch] text-body-lg leading-[1.55] text-muted">{intro}</div>
            <div className="legal mt-16 max-w-[66ch] border-t border-hairline">
              {sections.map((s, i) => (
                <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-28 border-b border-hairline py-10">
                  <h2 id={`${s.id}-h`} className="flex gap-4 text-heading-sm font-medium tracking-[-0.02em] text-ivory">
                    <span className="pt-1.5 font-mono text-caption tabular-nums text-subtle">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </h2>
                  <div className="mt-4 space-y-4 pl-9 text-body leading-[1.6] text-muted [&_a]:text-ivory [&_a]:underline [&_a]:underline-offset-4 [&_li]:mt-2 [&_strong]:font-medium [&_strong]:text-ivory [&_ul]:list-disc [&_ul]:pl-5 [&_ul_li::marker]:text-accent">
                    {s.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

/** Bracketed placeholder that counsel must confirm. */
export const R = ({ children }: { children: ReactNode }) => (
  <mark className="rounded-[2px] bg-accent/12 px-1 text-ivory">[{children}]</mark>
);
