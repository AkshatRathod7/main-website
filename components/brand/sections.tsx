import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { Headline } from "@/components/ui/headline";
import { BrandIcon, type BrandIconName } from "./icons";
import { CLIENT_LOGOS, PRIMARY_CTA, TRUST } from "@/content/site";
import { showQuote, type Case } from "@/content/cases";

/* ───────────────────────── Section head ───────────────────────── */
export function Kicker({ children, index, className }: { children: ReactNode; index?: string; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 text-body font-semibold tracking-[-0.01em] text-accent-text", className)}>
      <span>{children}</span>
    </p>
  );
}

export function Head({
  id,
  kicker,
  index,
  lines,
  intro,
  size = "display-md",
  className,
  aside,
}: {
  id: string;
  kicker?: string;
  index?: string;
  lines: ReactNode[];
  intro?: ReactNode;
  size?: "display-lg" | "display-md" | "heading-lg";
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={cn("grid grid-cols-4 gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end", className)}>
      <div className="col-span-4 lg:col-span-7">
        {kicker && <Kicker index={index}>{kicker}</Kicker>}
        <Headline id={id} size={size} lines={lines} className={cn(kicker && "mt-5", "max-w-[24ch]")} />
      </div>
      {(intro || aside) && (
        <div className="col-span-4 lg:col-span-4 lg:col-start-9">
          {intro && <p className="max-w-[44ch] text-body-lg text-fg-muted">{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Page hero (inner pages) ───────────────────────── */
export function PageHero({
  kicker,
  lines,
  sub,
  cta = PRIMARY_CTA,
  ctaNote,
  icon,
  children,
}: {
  kicker: string;
  lines: ReactNode[];
  sub: string;
  cta?: { href: string; label: string } | null;
  ctaNote?: string;
  icon?: BrandIconName;
  children?: ReactNode;
}) {
  return (
    <section aria-labelledby="page-h" className="hero relative pb-section-sm pt-[calc(var(--nav-height)+clamp(3rem,8vw,7rem))]">
      <div className="container-ds">
        <div className="grid grid-cols-4 gap-x-6 gap-y-10 md:grid-cols-12">
          <div className={cn("col-span-4", icon ? "md:col-span-9" : "md:col-span-12")}>
            <Kicker>{kicker}</Kicker>
            <Headline as="h1" id="page-h" size="display-lg" reveal="load" lines={lines} className="mt-6 max-w-[24ch]" />
          </div>
          {icon && (
            <div className="col-span-4 hidden items-start justify-end md:col-span-3 md:flex">
              <BrandIcon name={icon} size={96} className="opacity-90" />
            </div>
          )}
          <div className="col-span-4 md:col-span-6 md:col-start-1">
            <p className="text-body-lg text-fg-muted">{sub}</p>
          </div>
          {cta && (
            <div className="col-span-4 flex flex-col items-start gap-3 md:col-span-5 md:col-start-8 md:items-end md:justify-end">
              <ButtonLink href={cta.href} size="lg" arrow data-event="Page hero CTA">
                {cta.label}
              </ButtonLink>
              {ctaNote && <p className="text-caption text-fg-subtle">{ctaNote}</p>}
            </div>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

/* ───────────────────────── Trust strip ───────────────────────── */
export function TrustStrip({ link = true }: { link?: boolean }) {
  // Each logo sits in the same optical box: wide wordmarks get less height, square marks more,
  // so they read as one even row.
  const item = (n: string) => {
    const logo = CLIENT_LOGOS[n];
    if (!logo) {
      return <span className="logo-word">{n}</span>;
    }
    const ratio = logo.w / logo.h;
    const h = Math.round(Math.min(56, Math.max(26, 44 / Math.pow(ratio, 0.35))));
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logo.src} alt={n} width={Math.round(h * ratio)} height={h} loading="lazy" decoding="async" className="logo-img" />
    );
  };
  const row = (hidden: boolean) => (
    <ul className="marquee-track items-center" aria-hidden={hidden || undefined}>
      {TRUST.names.map((n) => (
        <li key={n} className="flex h-16 shrink-0 items-center">
          {item(n)}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Clients" className="py-12 md:py-16">
      <div className="container-ds mb-8 flex flex-wrap items-baseline justify-between gap-3">
        <p className="text-body text-fg-muted">{TRUST.label}</p>
        {link && (
          <Link href="/#work" className="text-body font-semibold text-fg hover:text-accent-text" data-event="Trust strip work link">
            See the work <span aria-hidden="true">›</span>
          </Link>
        )}
      </div>
      <div className="marquee marquee-logos marquee-ltr">
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}

/* ───────────────────────── Case card ───────────────────────── */
/** The client's own logo when we have it (one-colour, inverted on dark cards); otherwise their name set large. */
function CaseMark({ c }: { c: Case }) {
  const logo = CLIENT_LOGOS[c.client];
  if (!logo) {
    return (
      <p aria-hidden="true" className="case-art-mark text-[clamp(2.25rem,3.6vw,3.75rem)]">
        {c.client}
      </p>
    );
  }
  const ratio = logo.w / logo.h;
  const h = Math.round(Math.min(132, Math.max(64, 150 / Math.pow(ratio, 0.5))));
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo.src} alt="" width={Math.round(h * ratio)} height={h} loading="lazy" decoding="async" className="case-art-logo" style={{ height: h, maxWidth: "78%" }} />
  );
}

export function CaseCard({ c, i = 0, size = "md" }: { c: Case; i?: number; size?: "md" | "lg" | "fill" | "wide" | "tall" }) {
  return (
    <Link
      href={`/work/${c.slug}`}
      className={cn("case-card group rv block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus", size === "fill" && "flex h-full flex-col")}
      data-tone-card={c.tone}
      style={{ ["--i" as string]: i }}
      data-event={`Case card ${c.client}`}
    >
      <div className={cn("case-art relative flex flex-col justify-between overflow-hidden rounded-3xl p-6 md:p-8", size === "lg" ? "aspect-[4/3]" : size === "fill" ? "aspect-[4/3] md:aspect-auto md:flex-1" : size === "wide" ? "aspect-[16/10]" : size === "tall" ? "aspect-[4/5]" : "aspect-[5/4]")}>
        <div className="flex items-start justify-between gap-4">
          <span className="label-mono case-art-sub">{c.focus}</span>
          <span aria-hidden="true" className="nudge text-heading-md">↗</span>
        </div>
        <CaseMark c={c} />
        <div className="flex items-end justify-between gap-6">
          {c.result ? (
            <p className="case-art-result">
              <span className="block font-display text-[clamp(2rem,1.4rem+2vw,3.25rem)] font-semibold leading-none tracking-[-0.03em]">{c.result.v}</span>
              <span className="case-art-sub mt-2 block max-w-[26ch] text-body-sm">{c.result.k}</span>
            </p>
          ) : (
            <span />
          )}
          <span className="case-art-sub shrink-0 text-body-sm">
            {c.track} · {c.sector}
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="text-heading-md">{c.client}</h3>
          <p className="mt-1 max-w-[44ch] text-body text-fg-muted">{c.line}</p>
        </div>
        <span className="label-mono shrink-0 pt-2 text-fg-subtle">Read the story</span>
      </div>
    </Link>
  );
}

export function quotesFrom(cases: { quote?: { text: string; by: string; approved: boolean } }[], max = 3) {
  return cases
    .map((c) => c.quote)
    .filter(showQuote)
    .slice(0, max)
    .map((q) => ({ text: q.text, by: q.by }));
}

/* ───────────────────────── Final CTA ───────────────────────── */
export function FinalCta({
  title,
  copy,
  secondary,
  id = "final-h",
}: {
  title: string;
  copy?: string;
  secondary?: { href: string; label: string };
  id?: string;
}) {
  return (
    <section aria-labelledby={id} data-final-cta className="relative overflow-clip py-section-sm">
      <div className="container-ds">
        <div data-tone="paper" className="final-card relative overflow-hidden rounded-[32px] px-6 py-16 md:px-16 md:py-24">
          <div className="relative grid gap-10 md:grid-cols-12 md:items-end">
            <div className="md:col-span-8">
              <Headline id={id} size="display-lg" lines={[title]} className="max-w-[18ch]" />
              {copy && <p className="mt-6 max-w-[48ch] text-body-lg text-fg-muted">{copy}</p>}
            </div>
            <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
              <ButtonLink href={PRIMARY_CTA.href} size="lg" arrow data-event="Final CTA">
                {PRIMARY_CTA.label}
              </ButtonLink>
              {secondary && (
                <Link href={secondary.href} className="group inline-flex min-h-11 items-center gap-2 rounded-sm text-body text-fg-muted underline decoration-line-strong underline-offset-[0.22em] hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                  {secondary.label.replace(/ →$/, "")}
                  <span aria-hidden="true" className="nudge">→</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

