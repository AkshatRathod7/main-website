"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/brand/logo";

/**
 * The floor. The very bottom of every page is a flat line: a plateau. Try to scroll past the end
 * (wheel, a swipe, or the button) and the page answers back, and each push bends the line upward,
 * until the plateau breaks, the dot bursts, and the call to action appears.
 * A fun fact up top measures how far the visitor has scrolled, in metres (96 CSS px per inch).
 * The ending: the breakout dot turns into a star, flies down the page into a last panel, and lands
 * as the spark above the V of the DreamSVin logo, which rises letter by letter under it.
 */
const STAR = "M0 -12 C1.4 -2 2 -1.4 12 0 C2 1.4 1.4 2 0 12 C-1.4 2 -2 1.4 -12 0 C-2 -1.4 -1.4 -2 0 -12Z";
// spark centre inside the logo's viewBox (0 -2 698 91): (583.5, 1)
const SPARK_FX = 583.5 / 698;
const SPARK_FY = 3 / 91;
const STEPS = [
  { t: "You've hit the bottom.", s: "It's flat down here. Most businesses know the feeling.", hint: "Scroll again. Go on." },
  { t: "Still scrolling?", s: "That's founder energy. We like you already.", hint: "Again." },
  { t: "There's no more page.", s: "There is, however, more growth.", hint: "One more push." },
  { t: "Plateau: broken.", s: "That's roughly what 90 days with us feels like. Minus the scrolling.", hint: "" },
] as const;

// the same line, bent further each push: flat → kink → climb → breakout
const LINES = [
  "M0 120 L600 120",
  "M0 120 L380 120 C430 120 470 112 520 98 L600 86",
  "M0 120 L300 120 C380 120 440 96 500 64 L600 30",
  "M0 120 L240 120 C330 120 400 92 460 40 C490 14 540 4 600 -18",
];
const ENDS: [number, number][] = [
  [600, 120],
  [600, 86],
  [600, 30],
  [600, -18],
];

export function FooterFloor() {
  const [n, setN] = useState(0);
  const [metres, setMetres] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const last = useRef(0);
  const last3 = n >= STEPS.length - 1;
  const [phase, setPhase] = useState<"idle" | "flying" | "landed">("idle");
  const dotRef = useRef<SVGGElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLDivElement>(null);

  // the flight: a fixed star, re-aimed every frame at the spark's live position (so scrolling can't miss it)
  useEffect(() => {
    if (!last3) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let star: HTMLDivElement | null = null;
    const target = () => {
      const r = mark.current?.getBoundingClientRect();
      return r ? { x: r.left + r.width * SPARK_FX, y: r.top + r.height * SPARK_FY } : null;
    };
    const t1 = window.setTimeout(() => {
      const from = dotRef.current?.getBoundingClientRect();
      if (!from || !panel.current) return setPhase("landed");
      setPhase("flying");
      const sx = from.left + from.width / 2, sy = from.top + from.height / 2;
      star = document.createElement("div");
      star.className = "ff-star";
      star.setAttribute("aria-hidden", "true");
      star.innerHTML = `<svg viewBox="-14 -14 28 28"><path d="${STAR}"/></svg>`;
      document.body.appendChild(star);
      const y0 = window.scrollY;
      const dy = panel.current.getBoundingClientRect().top - window.innerHeight * 0.18;
      const dur = reduce ? 700 : 1700;
      const t0 = performance.now();
      const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const frame = (now: number) => {
        const t = Math.min(1, (now - t0) / dur);
        const e = ease(t);
        window.scrollTo(0, y0 + dy * Math.min(1, e * 1.15)); // the page follows the star down
        const to = target();
        if (!to || !star) return;
        // the start point rides up with the scroll, the end point is live: blend, then lift into an arc
        const fy = sy - (window.scrollY - y0);
        const x = sx + (to.x - sx) * e;
        const y = fy + (to.y - fy) * e - Math.sin(Math.PI * e) * 140;
        const sc = 1 + Math.sin(Math.PI * Math.min(1, e * 1.1)) * 2.4 - e * 0.55;
        star.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${e * 540}deg) scale(${sc})`;
        if (t < 1) raf = requestAnimationFrame(frame);
        else {
          star.remove();
          star = null;
          setPhase("landed");
        }
      };
      raf = requestAnimationFrame(frame);
    }, reduce ? 500 : 1500);
    return () => {
      window.clearTimeout(t1);
      cancelAnimationFrame(raf);
      star?.remove();
    };
  }, [last3]);

  const push = useCallback(() => {
    const now = Date.now();
    if (now - last.current < 650) return; // one push per gesture, not one per wheel tick
    last.current = now;
    setN((x) => Math.min(STEPS.length - 1, x + 1));
  }, []);

  useEffect(() => {
    const atEnd = () => document.documentElement.scrollHeight - (window.scrollY + window.innerHeight) <= 3;
    const measure = () => {
      const m = document.documentElement.scrollHeight / 3780; // 96px/in × 39.37in/m
      setMetres(m.toFixed(1));
    };
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY > 6 && atEnd()) push();
    };
    let y0 = 0;
    const onStart = (e: TouchEvent) => (y0 = e.touches[0].clientY);
    const onMove = (e: TouchEvent) => {
      if (y0 - e.touches[0].clientY > 46 && atEnd()) {
        y0 = e.touches[0].clientY;
        push();
      }
    };
    const io = new IntersectionObserver(([e]) => e.isIntersecting && measure(), { threshold: 0.1 });
    if (root.current) io.observe(root.current);
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
    };
  }, [push]);

  const step = STEPS[n];
  const [ex, ey] = ENDS[n];

  return (
    <div ref={root} className="ff container-ds" data-step={n}>
      <p className="ff-fact" aria-hidden={metres ? undefined : true}>
        {metres ? <>You scrolled about {metres} metres to get here. Your thumb deserves a raise.</> : " "}
      </p>

      <div className="ff-grid">
        <div className="ff-copy" aria-live="polite">
          <p key={`t${n}`} className="ff-t">{step.t}</p>
          <p key={`s${n}`} className="ff-s">{step.s}</p>
          {last3 ? (
            <p className="ff-follow">Wait. Where&apos;s that dot going?</p>
          ) : (
            <button type="button" className="ff-push" onClick={push}>
              <span className="ff-push-arrow" aria-hidden="true">↓</span>
              {step.hint}
              <span className="sr-only"> (pushes the line up)</span>
            </button>
          )}
        </div>

        <div className="ff-chart" aria-hidden="true">
          <svg viewBox="-10 -40 640 190" preserveAspectRatio="xMidYMid meet">
            <line x1="0" y1="140" x2="600" y2="140" className="ff-axis" />
            {[0, 1, 2, 3].map((k) => (
              <line key={k} x1="0" x2="600" y1={k * 40 - 20} y2={k * 40 - 20} className="ff-gridline" />
            ))}
            <text x="0" y="136" className="ff-lab">your business, right now</text>
            {n > 0 && <path d={LINES[n - 1]} className="ff-ghost" />}
            <path key={n} d={LINES[n]} pathLength={1} className="ff-line" />
            <g key={`dot${n}`} ref={dotRef} transform={`translate(${ex} ${ey})`} data-gone={phase !== "idle" ? "" : undefined}>
              <circle r="7" className="ff-dot" />
              {last3 && <path d={STAR} className="ff-morph" />}
              <circle r="7" className="ff-ring" />
              {last3 &&
                Array.from({ length: 10 }, (_, i) => {
                  const a = (i / 10) * Math.PI * 2;
                  return (
                    <circle
                      key={i}
                      r={i % 2 ? 3 : 4}
                      className={i % 3 ? "ff-bit" : "ff-bit ff-bit-g"}
                      style={{ ["--x" as string]: `${Math.cos(a) * 46}px`, ["--y" as string]: `${Math.sin(a) * 46}px` }}
                    />
                  );
                })}
            </g>
            {n === 0 && <text x="600" y="106" textAnchor="end" className="ff-lab ff-lab-r">plateau</text>}
          </svg>
        </div>
      </div>

      {last3 && (
        <div ref={panel} className="ff-end" data-phase={phase} data-tone="paper">
          <p className="ff-end-k">Every plateau ends somewhere. This one ends here.</p>
          <div ref={mark} className="ff-end-mark">
            {phase === "landed" && (
              <>
                <Logo tone="brand" live height={120} className="ff-end-logo" label="DreamSVin" />
                <svg className="ff-end-star" viewBox="-14 -14 28 28" aria-hidden="true" style={{ left: `${SPARK_FX * 100}%`, top: `${SPARK_FY * 100}%` }}>
                  <path d={STAR} />
                </svg>
              </>
            )}
          </div>
          <p className="ff-end-s">That star was your business a minute ago. Let&apos;s go and make it permanent.</p>
          <div className="ff-cta">
            <Link href="/contact" className="ff-btn" data-event="Floor CTA">
              Book the free call <span aria-hidden="true">→</span>
            </Link>
            <button
              type="button"
              className="ff-up"
              onClick={() => {
                const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
              }}
            >
              Take the elevator up <span aria-hidden="true">↑</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
