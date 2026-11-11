import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ReactNode } from "react";
import { slugify } from "@/lib/insights";

const text = (n: ReactNode): string =>
  typeof n === "string" ? n : Array.isArray(n) ? n.map(text).join("") : "";

/** Escalation ladder — a code-built "product shot" inside the essay. */
function EscalationTimeline({ steps }: { steps: { at: string; who: string; what: string }[] }) {
  return (
    <figure className="wide my-14 rounded-xl bg-surface-1 p-6 text-ivory sm:p-10">
      <figcaption className="eyebrow mb-8 flex justify-between">
        <span>Fig. 1 — An escalation ladder</span>
        <span className="hidden sm:inline">Rules agreed in advance</span>
      </figcaption>
      <div className="relative">
      <span aria-hidden className="absolute left-[7px] top-2 bottom-2 w-px bg-hairline-strong sm:left-0 sm:right-0 sm:top-[7px] sm:bottom-auto sm:h-px sm:w-auto" />
      <ol className="relative m-0 grid list-none gap-0 p-0 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.at} className="relative m-0 pb-8 pl-8 sm:pb-0 sm:pl-0 sm:pr-6 sm:pt-8">
            <span
              aria-hidden
              className={`absolute left-0 top-0.5 h-[15px] w-[15px] rounded-full border sm:top-0 ${
                i === steps.length - 1 ? "border-accent bg-accent" : "border-hairline-strong bg-[#141416]"
              }`}
            />
            <p className="font-mono text-caption tracking-[0.08em] tabular-nums text-accent-text">{s.at}</p>
            <p className="mt-2 text-body-sm font-medium">{s.who}</p>
            <p className="mt-1 text-body-sm leading-[1.45] text-muted">{s.what}</p>
          </li>
        ))}
      </ol>
      </div>
    </figure>
  );
}

function DecisionTable({ rows }: { rows: { decision: string; decides: string; you: string }[] }) {
  return (
    <figure className="wide my-12">
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Table, scrolls sideways on small screens">
        <table className="w-full min-w-[560px] border-collapse text-left text-body-sm leading-[1.4]">
          <thead>
            <tr className="border-b border-[var(--c-ink)]">
              {["Decision", "Who decides", "Comes to you when"].map((h) => (
                <th key={h} scope="col" className="pb-3 pr-6 font-mono text-[11px] font-normal uppercase tracking-[0.12em] text-[var(--c-ink-muted)]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.decision} className="border-b border-[var(--c-line-paper)]">
                <td className="py-4 pr-6">{r.decision}</td>
                <td className="py-4 pr-6 font-medium">{r.decides}</td>
                <td className="py-4 text-[var(--c-ink-muted)]">{r.you}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--c-ink-muted)]">
        Fig. — Illustrative decision rights. Yours will differ.
      </figcaption>
    </figure>
  );
}

function Aside({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="my-14 border-l-2 border-[var(--c-brass-deep)] bg-[var(--c-paper-2)] px-6 py-6 sm:px-8">
      <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--c-brass-deep)]">{title}</p>
      <div className="text-body leading-[1.6] [&>p]:m-0">{children}</div>
    </aside>
  );
}

export const mdxComponents: MDXComponents = {
  h2: ({ children }) => {
    const id = slugify(text(children));
    return (
      <h2 id={id} className="group">
        <a href={`#${id}`} className="!no-underline">
          {children}
        </a>
      </h2>
    );
  },
  a: ({ href = "", children }) =>
    href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
  EscalationTimeline,
  DecisionTable,
  Aside,
};
