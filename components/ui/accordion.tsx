"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Accordion (FAQ). Hairline-separated rows, no boxes.
 * States: closed · hover (question → fg-emphasis, icon → accent) · focus-visible · open · disabled.
 * Open/close: grid-rows 0fr→1fr, 250ms ease-out — the ONE sanctioned height animation in the system.
 * Closed panels are `inert` so they leave the tab order and the accessibility tree.
 * Emits FAQPage JSON-LD when `schema` is set.
 */
export type FaqItem = { q: string; a: ReactNode; aText?: string; disabled?: boolean };

export function Accordion({
  items,
  single = true,
  defaultOpen = [],
  schema = false,
  className,
}: {
  items: FaqItem[];
  /** Only one open at a time (default). */
  single?: boolean;
  defaultOpen?: number[];
  /** Render FAQPage structured data (requires aText for non-string answers). */
  schema?: boolean;
  className?: string;
}) {
  const base = useId();
  const [open, setOpen] = useState<number[]>(defaultOpen);

  const toggle = (i: number) =>
    setOpen((cur) => (cur.includes(i) ? cur.filter((x) => x !== i) : single ? [i] : [...cur, i]));

  return (
    <div className={cn("border-b border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open.includes(i);
        const btnId = `${base}-b${i}`;
        const panelId = `${base}-p${i}`;
        return (
          <div key={i} className="border-t border-line">
            <h3 className="m-0">
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                onClick={() => toggle(i)}
                className={cn(
                  "group/acc flex w-full items-start justify-between gap-6 py-6 text-left",
                  "font-display text-heading-sm text-fg transition-colors duration-fast ease-out",
                  "hover:text-fg-emphasis disabled:cursor-not-allowed disabled:text-fg-faint",
                  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus",
                )}
              >
                <span className="max-w-measure">{item.q}</span>
                {/* Plus → minus: the vertical stroke rotates flat. Transform only. */}
                <span aria-hidden="true" className="relative mt-[0.35em] size-4 shrink-0 text-fg-subtle transition-colors duration-fast group-hover/acc:text-accent-text">
                  <span className="absolute left-0 top-1/2 h-px w-4 -translate-y-1/2 bg-current" />
                  <span
                    className={cn(
                      "absolute left-1/2 top-0 h-4 w-px -translate-x-1/2 bg-current transition-transform duration-moderate ease-out",
                      isOpen && "rotate-90",
                    )}
                  />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              inert={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-moderate ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="overflow-hidden">
                <div className="max-w-measure pb-8 pr-10 text-body text-fg-muted">{item.a}</div>
              </div>
            </div>
          </div>
        );
      })}
      {schema && (
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: items.map((it) => ({
                "@type": "Question",
                name: it.q,
                acceptedAnswer: { "@type": "Answer", text: it.aText ?? (typeof it.a === "string" ? it.a : "") },
              })),
            }).replace(/</g, "\\u003c"),
          }}
        />
      )}
    </div>
  );
}
