"use client";

/**
 * The moving parts of the home page (1 Nov redesign). Styles: styles/living.css.
 *
 *   HeroProof    a story-style card in the hero that cycles through five clients (HERO_PROOF)
 *
 * Every component renders its finished state on the server; motion starts once it is on screen.
 * Numbers come from content/cases.ts (VISIBLE_RESULTS).
 */
import { useEffect, useRef, useState } from "react";
import { HERO_PROOF, VISIBLE_RESULTS } from "@/content/cases";
import { CLIENT_LOGOS, CLIENT_PHOTOS } from "@/content/site";

type Result = (typeof VISIBLE_RESULTS)[number];

/** Shape of each result, in a 300×120 box: a climb from zero, a two-week jump, one reel spiking, a century then a lift. */
const CURVES = [
  "M0 116 C70 115 125 109 170 92 S250 30 300 8",
  "M0 112 C90 111 130 107 158 88 S205 14 300 8",
  "M0 110 C90 110 150 109 188 103 S216 6 236 6 S272 46 300 52",
  "M0 84 C90 82 160 78 214 72 S272 34 300 12",
];

function countTo(el: HTMLElement | null, r: Pick<Result, "prefix" | "v" | "suffix"> | { prefix: string; v: number; suffix: string }, ms = 1800) {
  if (!el) return;
  const start = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - start) / ms);
    const e = 1 - Math.pow(1 - p, 3);
    el.textContent = `${r.prefix}${Math.round(e * r.v)}${r.suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

const initials = (s: string) =>
  s
    .replace(/^CA\s+/, "")
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

/* ───────────────────────── Hero proof (story card) ───────────────────────── */
export function HeroProof() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const numRef = useRef<HTMLSpanElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const r = HERO_PROOF[i];
  const STEP = 3600;

  useEffect(() => {
    if (r?.n !== undefined) countTo(numRef.current, { prefix: "", v: r.n, suffix: "" }, 1300);
    svgRef.current?.querySelectorAll<SVGAnimationElement>("animate").forEach((a) => {
      try {
        a.beginElement();
      } catch {}
    });
  }, [i, r]);

  useEffect(() => {
    if (paused) return;
    const t = window.setTimeout(() => setI((n) => (n + 1) % HERO_PROOF.length), STEP);
    return () => window.clearTimeout(t);
  }, [i, paused]);

  if (!r) return null;
  const logo = CLIENT_LOGOS[r.who];
  const photo = logo ? undefined : CLIENT_PHOTOS[r.who];
  return (
    <div
      className="hp"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      data-paused={paused || undefined}
    >
      <div className="hp-bars" aria-hidden="true">
        {HERO_PROOF.map((_, k) => (
          <span key={k} data-s={k < i ? "done" : k === i ? "now" : "next"} style={{ ["--step" as string]: `${STEP}ms` }}>
            <i key={k === i ? `on-${i}` : "off"} />
          </span>
        ))}
      </div>
      <div className="hp-who">
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="hp-ava hp-ava-photo" src={photo} alt="" width={44} height={44} />
        ) : logo ? (
          <span className="hp-ava hp-ava-logo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo.src} alt="" width={logo.w} height={logo.h} />
          </span>
        ) : (
          <span className="hp-ava" aria-hidden="true">
            {initials(r.who)}
          </span>
        )}
        <span>
          <b>{r.who}</b>
          <span className="hp-tag">{r.tag}</span>
        </span>
      </div>
      <p className="hp-num" aria-live="polite">
        <span ref={numRef} key={i} className={r.n !== undefined ? "numeric" : "numeric hp-word"}>
          {r.big}
        </span>
        <span className="hp-k">{r.k}</span>
      </p>
      {r.n !== undefined ? (
        <svg ref={svgRef} viewBox="0 0 300 120" className="hp-chart" aria-hidden="true" key={i}>
          <path d={`${CURVES[i % CURVES.length]} L300 120 L0 120 Z`} className="hp-area" />
          <path d={CURVES[i % CURVES.length]} className="hp-line" pathLength={1} strokeDasharray="1" strokeDashoffset="0">
            <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.3s" begin="indefinite" fill="freeze" calcMode="spline" keySplines=".3 0 .2 1" keyTimes="0;1" />
          </path>
        </svg>
      ) : (
        // no figure for this client: show who they are instead of a curve
        <div key={i} className="hp-pic" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {photo ? <img className="hp-pic-photo" src={photo} alt="" width={240} height={240} /> : logo ? <img className="hp-pic-logo" src={logo.src} alt="" width={logo.w} height={logo.h} /> : null}
        </div>
      )}
      <button type="button" className="hp-next" onClick={() => setI((n) => (n + 1) % HERO_PROOF.length)} data-event="Hero proof next">
        <span className="sr-only">Next client</span>
      </button>
    </div>
  );
}

