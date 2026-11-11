"use client";

/**
 * The results scoreboard (client island for components/home/results.tsx).
 * Each tile is rendered whole on the server. A tile that starts below the fold is primed, and when it comes
 * into view it rises, its number counts up, its curve is wiped in and the marker lands. Hover, keyboard focus
 * or the "What we did" button swaps the curve for what we did for that client.
 * Motion is transform and opacity only; under reduced motion the tile simply fades in with its final number.
 */
import { useEffect, useId, useRef, useState } from "react";

export type ResultItem = {
  who: string;
  category?: string;
  /** the starting figure, when the result is a "from → to" */
  from?: string;
  v: number;
  suffix: string;
  k: string;
  did: string[];
  photo?: string;
  logo?: { src: string; w: number; h: number };
  shape: number;
};

/** The shape of each result in a 300×120 box, and where its marker sits: a climb from zero, a two-week jump,
 *  one reel spiking, a lift from an existing base, a long steady line that turns up. Illustrative, not data. */
const SHAPES: { d: string; end: number; dot: [number, number] }[] = [
  { d: "M0 114 C70 113 125 107 170 90 S250 30 294 10", end: 294, dot: [294, 10] },
  { d: "M0 112 C90 111 130 107 158 86 S205 16 294 10", end: 294, dot: [294, 10] },
  { d: "M0 110 C90 110 150 109 188 103 S216 8 236 8 S270 44 294 50", end: 294, dot: [236, 8] },
  { d: "M0 88 C90 86 160 82 214 74 S270 36 294 14", end: 294, dot: [294, 14] },
  { d: "M0 98 C80 97 170 96 222 91 S272 54 294 22", end: 294, dot: [294, 22] },
];

const initials = (s: string) =>
  s
    .replace(/^CA\s+/, "")
    .split(/[\s,]+/)
    .filter((w) => /^[A-Z]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join("");

function Tile({ r, i, open, onToggle }: { r: ResultItem; i: number; open: boolean; onToggle: () => void }) {
  const id = useId().replace(/:/g, "");
  const ref = useRef<HTMLLIElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState<"wait" | "go" | undefined>(undefined);
  const shape = SHAPES[r.shape % SHAPES.length];

  // prime only when the tile starts below the fold, so the first frame is always whole
  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setOn("wait");
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        setOn("go");
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // count up once the tile is on its way in (not under reduced motion: the number is simply there)
  useEffect(() => {
    const el = numRef.current;
    if (on !== "go" || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const delay = window.matchMedia("(min-width: 1024px)").matches ? i * 110 + 120 : 120;
    const ms = 1500;
    let raf = 0;
    el.textContent = `0${r.suffix}`;
    const t0 = performance.now() + delay;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - t0) / ms));
      el.textContent = `${Math.round((1 - Math.pow(1 - p, 4)) * r.v)}${r.suffix}`;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = `${r.v}${r.suffix}`;
    };
  }, [on, i, r.v, r.suffix]);

  const logoH = r.logo ? Math.round(Math.min(44, Math.max(30, 46 / Math.pow(r.logo.w / r.logo.h, 0.3)))) : 0;
  return (
    <li ref={ref} className="res-tile" data-on={on} data-open={open || undefined} style={{ ["--i" as string]: i }}>
      <div className="res-id">
        <span className="res-mark" aria-hidden="true">
          {r.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.photo} alt="" width={44} height={44} loading="lazy" decoding="async" className="res-photo" />
          ) : r.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={r.logo.src} alt="" width={Math.round((logoH * r.logo.w) / r.logo.h)} height={logoH} loading="lazy" decoding="async" className="res-logo" style={{ height: logoH }} />
          ) : (
            <span className="res-initials">{initials(r.who)}</span>
          )}
        </span>
        <h3 className="res-who">{r.who}</h3>
        {r.category && <p className="res-cat">{r.category}</p>}
      </div>
      <p className="res-num">
        {r.from && (
          <span className="res-from">
            {r.from} <span aria-hidden="true">→</span>
            <span className="sr-only"> to </span>
          </span>
        )}
        <span ref={numRef} className="numeric">{`${r.v}${r.suffix}`}</span>
      </p>
      <p className="res-k">{r.k}</p>
      <div className="res-chart" aria-hidden="true">
        <div className="res-clip">
          <div className="res-wipe">
            <div className="res-wipe-in">
              <svg viewBox="0 0 300 120" preserveAspectRatio="none" focusable="false">
                <defs>
                  <linearGradient id={`${id}-a`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" style={{ stopColor: "var(--fg)" }} stopOpacity=".1" />
                    <stop offset="1" style={{ stopColor: "var(--fg)" }} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${shape.d} L${shape.end} 120 L0 120 Z`} fill={`url(#${id}-a)`} />
                <path d={shape.d} className="res-line" />
              </svg>
            </div>
          </div>
        </div>
        <span className="res-dot" style={{ left: `${(shape.dot[0] / 300) * 100}%`, top: `${(shape.dot[1] / 120) * 100}%` }} />
      </div>
      {r.did.length > 0 && (
        <>
          <button type="button" className="res-more" aria-expanded={open} aria-controls={`${id}-did`} onClick={onToggle}>
            What we did
            <span className="sr-only"> for {r.who}</span>
            <span className="res-plus" aria-hidden="true" />
          </button>
          <ul id={`${id}-did`} className="res-did">
            {r.did.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
    </li>
  );
}

export function ResultsBoard({ items }: { items: ResultItem[] }) {
  const [open, setOpen] = useState(-1);
  return (
    <ol className="res-board" style={{ ["--n" as string]: items.length }}>
      {items.map((r, i) => (
        <Tile key={r.who} r={r} i={i} open={open === i} onToggle={() => setOpen((o) => (o === i ? -1 : i))} />
      ))}
    </ol>
  );
}
