"use client";

import { lazy, Suspense, useEffect, useState } from "react";
import { PILLARS, pillarById } from "@/lib/health-check/questions";
import { TIERS, WEAK_THRESHOLD, type HealthResult } from "@/lib/health-check/scoring";
import { bookingPrefill, bookingUrl } from "@/lib/health-check/booking";
import { HC_EVENTS, track } from "@/lib/health-check/analytics";
import type { Lead } from "@/lib/health-check/schema";
import { ScoreDial } from "./ScoreDial";
import { Arrow, Button } from "./ui";

const BookingEmbed = lazy(() => import("./BookingEmbed"));

export type DeliveryState = "pending" | "sent" | "skipped" | "failed" | null;

const tierRange = (i: number) => `${TIERS[i].min}–${(TIERS[i + 1]?.min ?? 101) - 1}`;

export function Results({
  result,
  lead,
  delivery,
  onRetry,
  onRetake,
  completedAt,
}: {
  result: HealthResult;
  lead: Partial<Lead>;
  delivery: DeliveryState;
  onRetry: () => void;
  onRetake: () => void;
  completedAt?: string;
}) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [barsIn, setBarsIn] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setBarsIn(true), 400);
    return () => clearTimeout(t);
  }, []);

  const date = new Date(completedAt ?? Date.now()).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const company = lead.company?.trim() || "Your business";
  const allClear = result.focus[0]?.reason === "edge";

  const book = (method: "inline" | "inline_header" | "new_tab") =>
    track(HC_EVENTS.bookingClicked, { method, tier: result.tier.id, score: result.overall });

  return (
    <article className="grid gap-y-28 sm:gap-y-36" aria-labelledby="result-title">
      {/* ── 1. The reading ─────────────────────────────────────────── */}
      <section className="hc-enter grid items-center gap-x-8 gap-y-12 lg:grid-cols-12">
        <div className="mx-auto w-full max-w-[400px] lg:col-span-5 lg:max-w-none">
          <ScoreDial score={result.overall} tierName={result.tier.name} />
        </div>

        <div className="min-w-0 lg:col-span-6 lg:col-start-7">
          <p className="hc-label text-muted">
            Your result <span className="text-faint">·</span> {date}
          </p>
          <h2 id="result-title" className="hc-display hc-sharpen mt-6 text-display-lg">
            {company} is <span className="hc-serif text-accent-text">{result.tier.name.toLowerCase()}.</span>
          </h2>
          <p className="mt-6 max-w-[54ch] text-body-lg leading-relaxed text-ivory/90">{result.tier.summary}</p>
          {result.context && <p className="mt-4 max-w-[54ch] text-body leading-relaxed text-muted">{result.context}</p>}

          {/* Tier scale: where this reading sits */}
          <ol className="mt-10 grid grid-cols-4 gap-2" aria-label="Stage scale">
            {TIERS.map((t, i) => {
              const on = t.id === result.tier.id;
              return (
                <li key={t.id} className={`border-t pt-3 ${on ? "border-accent" : "border-hairline-strong"}`} aria-current={on || undefined}>
                  <span className={`hc-label block ${on ? "text-accent-text" : "text-faint"}`}>{tierRange(i)}</span>
                  <span className={`mt-1 block text-caption leading-tight sm:text-body-sm ${on ? "text-ivory" : "text-muted"}`}>{t.name}</span>
                </li>
              );
            })}
          </ol>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button
              onClick={() => {
                setBookingOpen(true);
                book("inline_header");
                window.setTimeout(() => {
                  document.getElementById("walkthrough")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }}
            >
              Book a free consultation <Arrow />
            </Button>
            <a href="#recs-title" className="text-body-sm text-muted underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-ivory">
              Read the recommendations first
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Sharpest signal ─────────────────────────────────────── */}
      {result.sharpest && (
        <section className="grid gap-x-8 gap-y-6 lg:grid-cols-12" aria-labelledby="sharpest-title">
          <p id="sharpest-title" className="hc-label text-faint lg:col-span-4">
            The answer that stood out
          </p>
          <div className="min-w-0 lg:col-span-8">
            <p className="text-body text-muted">{result.sharpest.prompt}</p>
            <blockquote className="hc-serif mt-4 max-w-[30ch] text-heading-lg leading-[1.15] text-ivory">
              “{result.sharpest.answer.replace(/\.$/, "")}.”
            </blockquote>
            <p className="mt-5 max-w-[56ch] text-body-sm text-muted">
              This is usually where effort leaks first. It is also the quickest place to win it back.
            </p>
          </div>
        </section>
      )}

      {/* ── 3. By pillar ───────────────────────────────────────────── */}
      <section className="grid gap-x-8 gap-y-8 lg:grid-cols-12" aria-labelledby="pillars-title">
        <div className="lg:col-span-4">
          <h3 id="pillars-title" className="hc-label text-faint">
            By pillar
          </h3>
          <p className="mt-4 max-w-[36ch] text-body-sm text-muted">
            Each pillar is scored 0 to 100. Below {WEAK_THRESHOLD}, it is holding the business back.
          </p>
        </div>
        <ul className="min-w-0 lg:col-span-8">
          {result.pillars.map((p, i) => {
            const pillar = PILLARS.find((x) => x.id === p.id)!;
            return (
              <li key={p.id} className="border-t border-hairline py-6 last:border-b">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 text-body-lg text-ivory">
                    <span className="hc-label mr-3 text-faint">{String(pillar.index).padStart(2, "0")}</span>
                    {p.name}
                  </p>
                  <p className="flex shrink-0 items-baseline gap-3">
                    {p.weak && <span className="hc-label text-accent-text">Focus</span>}
                    <span className={`hc-tabular text-heading-md font-medium tracking-[-0.03em] ${p.weak ? "text-accent-text" : "text-ivory"}`}>
                      {p.score}
                    </span>
                  </p>
                </div>
                <div className="relative mt-4 h-[3px] bg-hairline" aria-hidden>
                  <div
                    className={`hc-bar-fill absolute inset-y-0 left-0 w-full ${p.weak ? "bg-accent" : "bg-ivory/80"}`}
                    style={{ transform: `scaleX(${barsIn ? p.score / 100 : 0})`, transitionDelay: `${i * 90}ms` }}
                  />
                  <span className="absolute -top-[5px] h-[13px] w-px bg-faint" style={{ left: `${WEAK_THRESHOLD}%` }} />
                </div>
                {i === 0 && (
                  <p className="relative mt-2 h-4" aria-hidden>
                    <span className="hc-label absolute -translate-x-1/2 text-faint" style={{ left: `${WEAK_THRESHOLD}%` }}>
                      {WEAK_THRESHOLD}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </section>

      {/* ── 4. Where we would start ────────────────────────────────── */}
      <section aria-labelledby="recs-title">
        <div className="grid gap-x-8 lg:grid-cols-12">
          <div className="lg:col-span-8 lg:col-start-5">
            <h3 id="recs-title" className="hc-display text-display-md">
              Where we would <span className="hc-serif">start.</span>
            </h3>
            <p className="mt-4 max-w-[56ch] text-body text-muted">
              {allClear
                ? `No pillar is below ${WEAK_THRESHOLD}. These three moves would lift your lowest one, in the order we would make them.`
                : `Three moves for each pillar below ${WEAK_THRESHOLD}, weakest first, in the order we would make them.`}
            </p>
          </div>
        </div>

        <div className="mt-16 grid gap-y-20">
          {result.focus.map((f) => {
            const pillar = pillarById(f.id);
            return (
              <div key={f.id} className="grid gap-x-8 gap-y-6 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  <p className="hc-label text-accent-text">
                    {f.reason === "weak" ? "Below threshold" : "Next edge"}
                  </p>
                  <p className="mt-3 text-heading-sm leading-tight tracking-[-0.015em] text-ivory">{pillar.name}</p>
                  <p className="hc-label mt-2 text-faint">
                    <span className="text-muted">{f.score}</span> / 100
                  </p>
                </div>
                <ol className="min-w-0 lg:col-span-8">
                  {f.recommendations.map((rec, i) => (
                    <li key={rec.questionId} className="grid grid-cols-[2.5rem_1fr] gap-x-4 border-t border-hairline py-6 last:border-b sm:grid-cols-[3.5rem_1fr]">
                      <span className="hc-label pt-[6px] text-faint">{String(i + 1).padStart(2, "0")}</span>
                      <div className="min-w-0">
                        <p className="text-body-lg font-medium leading-snug tracking-[-0.01em] text-ivory">{rec.title}</p>
                        <p className="mt-2 max-w-[60ch] text-body leading-relaxed text-muted">{rec.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 5. Walkthrough ─────────────────────────────────────────── */}
      <section
        id="walkthrough"
        className="scroll-mt-8 rounded-[12px] border border-hairline bg-surface-1 px-5 py-12 sm:px-10 sm:py-16 lg:px-16"
        aria-labelledby="walkthrough-title"
      >
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h3 id="walkthrough-title" className="hc-display text-display-md">
              Walk through it <br className="hidden sm:block" />
              <span className="hc-serif">with us.</span>
            </h3>
          </div>
          <div className="min-w-0 lg:col-span-5 lg:col-start-8">
            <p className="text-body leading-relaxed text-ivory/90">
              A free 30-minute consultation. We go through your answers and show what we would fix first,
              and in what order. You leave with a clear view of what&apos;s slowing you down, whether or not we work together.
            </p>
            <p className="hc-label mt-6 text-faint">30 minutes · Video call · No preparation needed</p>
            {!bookingOpen && (
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                <Button
                  onClick={() => {
                    setBookingOpen(true);
                    book("inline");
                  }}
                >
                  Choose a time <Arrow />
                </Button>
                <a
                  href={bookingUrl(result, lead)}
                  target="_blank"
                  rel="noopener"
                  onClick={() => book("new_tab")}
                  className="text-body-sm text-muted underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-ivory"
                >
                  Open the calendar in a new tab
                </a>
              </div>
            )}
          </div>
        </div>

        {bookingOpen && (
          <div className="hc-enter mt-12 overflow-hidden rounded-[8px] border border-hairline bg-canvas">
            <Suspense
              fallback={
                <div className="grid h-[640px] place-items-center">
                  <p className="hc-label text-faint">Loading calendar</p>
                </div>
              }
            >
              <BookingEmbed prefill={bookingPrefill(result, lead)} />
            </Suspense>
          </div>
        )}
      </section>

      {/* ── 6. Delivery + retake ───────────────────────────────────── */}
      <footer className="-mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6 text-body-sm sm:-mt-20">
        <p className="text-muted" role="status">
          {delivery === "pending" && <>Sending a copy to {lead.email}…</>}
          {delivery === "sent" && (
            <>
              A copy is on its way to <span className="text-ivory">{lead.email}</span>.
            </>
          )}
          {delivery === "failed" && (
            <>
              We couldn’t send your copy to <span className="text-ivory">{lead.email}</span>.{" "}
              <button onClick={onRetry} className="text-accent-text underline underline-offset-4 hover:text-accent-hover">
                Try again
              </button>
            </>
          )}
        </p>
        <button onClick={onRetake} className="text-muted underline decoration-hairline-strong underline-offset-4 hover:text-ivory">
          Take the check again
        </button>
      </footer>
    </article>
  );
}
