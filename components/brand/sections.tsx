import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/button";
import { Headline } from "@/components/ui/headline";
import { BrandIcon, type BrandIconName } from "./icons";
import { CountUp, Reveal, Spotlight } from "./motion";
import { PullEngine, ResultTile, StackWatch, TeamBoard } from "./living";
import { ABOUT, CCC, CLIENT_LOGOS, EXTENDED_TEAM, PRIMARY_CTA, STAGES, TRUST, WHO, WHY, type Stage } from "@/content/site";
import { VISIBLE_RESULTS, showQuote, type Case } from "@/content/cases";

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

/* ───────────────────────── Stage stack (sticky deck) ───────────────────────── */
const STAGE_ICON: Record<string, BrandIconName> = { foundation: "grid", growth: "flower", scale: "connect" };
const STAGE_TONE: Record<string, string> = {
  foundation: "bg-bg-elevated text-fg border border-line",
  growth: "bg-coral-tint text-charcoal border border-[rgb(255_112_92/0.16)]",
  scale: "bg-charcoal text-cream",
};

export function StageCard({ s, detailed = false, i }: { s: Stage; detailed?: boolean; i: number }) {
  const onDark = s.key === "scale";
  const onCoral = s.key === "growth";
  return (
    <article
      id={detailed ? s.key : undefined}
      aria-labelledby={`stage-${s.key}`}
      className={cn("stack-card scroll-mt-32 overflow-hidden rounded-3xl p-6 shadow-e2 md:p-12", STAGE_TONE[s.key])}
      style={{ ["--n" as string]: i }}
      data-stage={s.key}
    >
      <div className="grid gap-8 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-4">
            <BrandIcon name={STAGE_ICON[s.key]} size={48} />
            <span className={cn("label-mono", onDark ? "text-cream-subtle" : onCoral ? "text-[color:var(--c-ink-subtle)]" : "text-fg-subtle")} style={onDark ? { color: "var(--c-cream-subtle)" } : undefined}>
              Stage {s.n}
            </span>
          </div>
          <h3 id={`stage-${s.key}`} className="mt-8 text-display-md">
            {detailed ? s.header : s.name}
          </h3>
          {!detailed && <p className="mt-3 text-heading-sm font-display font-bold">{s.tag}</p>}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <p className={cn("text-body-lg", onDark ? "text-[color:var(--c-cream-muted)]" : onCoral ? "text-charcoal" : "text-fg-muted")}>{detailed ? s.copy : s.summary}</p>
          {detailed && (
            <>
              <p className={cn("label-mono mt-8", onDark ? "text-[color:var(--c-cream-subtle)]" : onCoral ? "text-charcoal" : "text-fg-subtle")}>What you get</p>
              <ul className="mt-4 grid gap-0">
                {s.get.map((g) => (
                  <li key={g} className={cn("flex items-center gap-3 border-t py-3 text-body", onDark ? "border-[color:var(--c-line-dark)]" : onCoral ? "border-[rgb(37_40_45/0.10)]" : "border-line")}>
                    <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-coral" />
                    {g}
                  </li>
                ))}
              </ul>
              <p className={cn("mt-6 text-body-sm", onDark ? "text-[color:var(--c-cream-subtle)]" : onCoral ? "text-charcoal" : "text-fg-subtle")}>
                <span className="font-semibold">Best for:</span> {s.bestFor}
              </p>
              <Link
                href={`/contact?stage=${s.key}`}
                className={cn(
                  "group mt-8 inline-flex min-h-11 items-center gap-2 rounded-sm font-semibold underline decoration-1 underline-offset-[0.22em]",
                  "focus-visible:outline-2 focus-visible:outline-offset-2",
                  onDark ? "focus-visible:outline-coral" : "focus-visible:outline-charcoal",
                )}
                data-event={`Stage CTA ${s.name}`}
              >
                {s.cta}
                <span aria-hidden="true" className="nudge">→</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function StageStack({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="stack">
      <StackWatch />
      {STAGES.map((s, i) => (
        <StageCard key={s.key} s={s} i={i} detailed={detailed} />
      ))}
    </div>
  );
}

/* ───────────────────────── Extended team ───────────────────────── */
export function ExtendedTeam({ long = false }: { long?: boolean }) {
  const icons: BrandIconName[] = ["eye", "spark", "stack"];
  return (
    <section aria-labelledby="team-h" data-tone="paper" className="py-section">
      <div className="container-ds">
        <Head id="team-h" kicker="One team" lines={[EXTENDED_TEAM.title]} intro={long ? EXTENDED_TEAM.long : EXTENDED_TEAM.short} />
        <div className="mt-16">
          <TeamBoard roles={EXTENDED_TEAM.roles} />
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── CCC ───────────────────────── */
export function CccSection({ full = false }: { full?: boolean }) {
  return (
    <section aria-labelledby="ccc-h" className="relative overflow-clip py-section" data-tone="paper">
      <div className="container-ds grid grid-cols-4 items-center gap-x-6 gap-y-14 md:grid-cols-12">
        <div className="col-span-4 md:col-span-6">
          <Kicker>{CCC.eyebrow}</Kicker>
          <Headline id="ccc-h" size="display-md" lines={full ? [CCC.title] : [CCC.homeTitle]} className="mt-5 max-w-[18ch]" />
          <p className="mt-6 max-w-[48ch] text-body-lg text-fg-muted">{full ? CCC.copy : CCC.homeCopy}</p>
          <Reveal as="dl" className="mt-10 grid gap-0">
            {CCC.parts.map((p, i) => (
              <div key={p.k} className="rv grid grid-cols-[auto_1fr] gap-x-5 border-t border-line py-5" style={{ ["--i" as string]: i }}>
                <dt className="font-display text-heading-md font-bold">
                  <span className="text-accent-text">{p.k[0]}</span>
                  {p.k.slice(1)}
                </dt>
                <dd className="col-start-2 mt-1 text-body text-fg-muted">{p.v}</dd>
              </div>
            ))}
          </Reveal>
          <p className="mt-8 font-display text-heading-lg font-bold">
            From <span className="line-through decoration-coral decoration-2">push</span> to <span className="draw" data-on="true">pull.</span>
          </p>
        </div>
        <div className="col-span-4 md:col-span-5 md:col-start-8">
          <PullEngine />
        </div>
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

/* ───────────────────────── Who / Why ───────────────────────── */
export function WhoList() {
  return (
    <section aria-labelledby="who-h" className="py-section">
      <div className="container-ds">
        <Head id="who-h" kicker="Who we work with" lines={[WHO.title]} />
        <Reveal as="ul" className="mt-14 border-b border-line">
          {WHO.rows.map((r, i) => (
            <li key={r.k} className="rv group grid grid-cols-4 gap-x-6 gap-y-2 border-t border-line py-7 md:grid-cols-12 md:items-baseline" style={{ ["--i" as string]: i }}>
              <span className="numeric col-span-1 text-body-sm text-fg-subtle md:col-span-1">0{i + 1}</span>
              <h3 className="col-span-3 text-heading-lg transition-transform duration-moderate ease-out md:col-span-5 md:group-hover:translate-x-2">{r.k}</h3>
              <p className="col-span-4 text-body-lg text-fg-muted md:col-span-5 md:col-start-8">{r.v}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function WhyGrid() {
  return (
    <section aria-labelledby="why-h" className="py-section">
      <div className="container-ds">
        <Head id="why-h" kicker="Why DreamSVin" lines={[WHY.title]} />
        <Reveal as="ol" className="why-list mt-14">
          {WHY.points.map((p, i) => (
            <li key={p.k} className="rv why-row" style={{ ["--i" as string]: i }}>
              <span aria-hidden="true" className="why-n numeric">0{i + 1}</span>
              <h3 className="why-k">{p.k}</h3>
              <p className="why-v">{p.v}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ───────────────────────── Results + quotes ───────────────────────── */

export function Results({ quotes = [] as { text: string; by: string }[] }) {
  if (VISIBLE_RESULTS.length === 0 && quotes.length === 0) return null; // nothing cleared yet: no empty proof section
  return (
    <section aria-labelledby="proof-h" className="py-section">
      <div className="container-ds">
        <Head
          id="proof-h"
          kicker="What the work has done"
          lines={quotes.length ? ["What clients say."] : ["Real businesses.", "Real numbers."]}
          intro="A few results from client work so far, from our client records."
        />
        {VISIBLE_RESULTS.length > 0 && (
        <dl className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {VISIBLE_RESULTS.map((r, i) => (
            <ResultTile key={r.who} r={r} i={i} />
          ))}
        </dl>
        )}
        {quotes.length > 0 && (
          <Reveal as="ul" className="mt-20 grid gap-4 md:grid-cols-3">
            {quotes.map((q, i) => (
              <li key={q.text} className="rv rounded-3xl bg-bg-elevated p-6 md:p-8" style={{ ["--i" as string]: i }}>
                <figure>
                  <span aria-hidden="true" className="block font-display text-display-md font-extrabold leading-none text-coral">“</span>
                  <blockquote className="mt-2 font-display text-heading-md font-bold">{q.text}</blockquote>
                  <figcaption className="mt-6 text-body-sm text-fg-subtle">{q.by}</figcaption>
                </figure>
              </li>
            ))}
          </Reveal>
        )}
      </div>
    </section>
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

/* ───────────────────────── Founder strip (home) ─────────────────────────
   Who you'd actually work with. Uses the About founder content, so there is one source of truth. */
export function FounderStrip() {
  const f = ABOUT.founder;
  return (
    <section aria-labelledby="founder-strip-h" className="py-section" data-tone="paper">
      <Reveal className="container-ds grid grid-cols-4 items-center gap-x-6 gap-y-10 md:grid-cols-12">
        <div className="rv relative col-span-4 mx-auto w-full max-w-[360px] md:col-span-4 md:max-w-none" style={{ ["--i" as string]: 0 }}>
          <div className="overflow-hidden rounded-3xl bg-gold">
            <Image
              src={f.photo.src}
              alt={f.photo.alt}
              width={576}
              height={1024}
              sizes="(min-width: 768px) 30vw, 360px"
              className="aspect-[4/5] w-full object-cover object-[50%_22%]"
            />
          </div>
        </div>
        <div className="col-span-4 md:col-span-7 md:col-start-6">
          <Kicker className="rv">Who you&apos;ll work with</Kicker>
          <blockquote className="rv mt-6" style={{ ["--i" as string]: 1 }}>
            <p id="founder-strip-h" className="font-display text-heading-lg font-bold">
              &ldquo;Most founders don&apos;t have a strategy problem.{" "}
              They have an execution problem.&rdquo;
            </p>
            <footer className="mt-6">
              <cite className="not-italic">
                <span className="block font-display text-heading-sm font-bold text-fg">{f.name}</span>
                <span className="mt-1 block text-body-sm text-fg-muted">Founder, DreamSVin</span>
              </cite>
            </footer>
          </blockquote>
          <ul className="rv mt-8 flex flex-wrap gap-2" style={{ ["--i" as string]: 2 }} aria-label="Roles beyond DreamSVin">
            {f.roles2.slice(0, 3).map((r) => (
              <li key={r} className="rounded-full bg-bg-elevated px-4 py-2 text-body-sm text-fg-muted">
                {r}
              </li>
            ))}
          </ul>
          <div className="rv mt-8 flex flex-wrap items-center gap-x-6 gap-y-2" style={{ ["--i" as string]: 3 }}>
            <details className="founder-more group/fm w-full">
              <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 rounded-sm text-body font-semibold text-fg hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                Read Isha&apos;s story
                <span aria-hidden="true" className="transition-transform duration-base group-open/fm:rotate-90">›</span>
              </summary>
              <div className="mt-4 grid gap-4 text-body-lg text-fg-muted">
                <p className="text-body-sm font-semibold text-accent-text">{f.roles}</p>
                {f.bio.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
                <ul className="grid gap-2">
                  {f.roles2.map((r) => (
                    <li key={r} className="flex gap-3 text-body">
                      <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-coral" />
                      {r}
                    </li>
                  ))}
                </ul>
                <p className="border-l-2 border-coral pl-6 font-display text-heading-md font-bold leading-[1.3] text-fg">{f.closing}</p>
              </div>
            </details>
            <a
              href={f.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              data-event="Founder LinkedIn"
              className="inline-flex min-h-11 items-center gap-2 rounded-sm text-body font-semibold text-fg hover:text-accent-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.75h4v11H3v-11Zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4v-11Z" /></svg>
              Follow Isha on LinkedIn
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
