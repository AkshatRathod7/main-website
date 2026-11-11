"use client";

import { useEffect, useRef, useState } from "react";
import { TIERS } from "@/lib/health-check/scoring";
import { usePrefersReducedMotion } from "./hooks";

/**
 * A 270° instrument gauge. 0 sits at lower-left, 100 at lower-right.
 * Ticks every 2 points, majors every 10, tier boundaries at 40 / 60 / 80.
 * Ticks light up behind the needle as it travels.
 *
 * `score` undefined = dormant instrument (used on the intro).
 * `calibrate` = one self-test sweep on mount, like a car's gauge cluster.
 */

const C = 220; // centre in viewBox units
const START = 135; // degrees, SVG coordinates (clockwise, y down)
const SWEEP = 270;
const R_TRACK = 158;
const R_TICK_OUT = 190;

const rad = (d: number) => (d * Math.PI) / 180;
const angle = (v: number) => START + (SWEEP * v) / 100;
const pt = (v: number, r: number) => [C + r * Math.cos(rad(angle(v))), C + r * Math.sin(rad(angle(v)))] as const;

function arc(from: number, to: number, r: number) {
  const [x0, y0] = pt(from, r);
  const [x1, y1] = pt(to, r);
  const large = ((to - from) * SWEEP) / 100 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const BOUNDS = TIERS.map((t) => t.min).filter((m) => m > 0); // 40, 60, 80
const LABELS = [0, ...BOUNDS, 100];

function useCountUp(target: number, run: boolean, duration = 1600) {
  const [value, setValue] = useState(run ? 0 : target);
  const raf = useRef(0);
  useEffect(() => {
    if (!run) {
      setValue(target);
      return;
    }
    const from = 0;
    const t0 = performance.now();
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // close to the CSS expo-out curve
    const tick = (now: number) => {
      const t = Math.min(1, (now - t0) / duration);
      setValue(from + (target - from) * ease(t));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, run, duration]);
  return value;
}

export function ScoreDial({
  score,
  tierName,
  calibrate = false,
  caption,
  className = "",
}: {
  score?: number;
  tierName?: string;
  calibrate?: boolean;
  caption?: string;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  const live = typeof score === "number";
  const [needle, setNeedle] = useState(0);

  // Drive the needle after first paint so the CSS transition runs.
  useEffect(() => {
    if (reduced) {
      setNeedle(live ? score! : 0);
      return;
    }
    const timers: number[] = [];
    if (live) {
      timers.push(window.setTimeout(() => setNeedle(score!), 120));
    } else if (calibrate) {
      timers.push(window.setTimeout(() => setNeedle(100), 450));
      timers.push(window.setTimeout(() => setNeedle(0), 1500));
    }
    return () => timers.forEach(clearTimeout);
  }, [live, score, calibrate, reduced]);

  const shown = useCountUp(live ? score! : 0, live && !reduced);
  const currentTier = live ? [...TIERS].reverse().find((t) => score! >= t.min) : undefined;

  const ticks = [];
  for (let v = 0; v <= 100; v += 2) {
    const major = v % 10 === 0;
    const boundary = BOUNDS.includes(v) || v === 0 || v === 100;
    const [x0, y0] = pt(v, R_TICK_OUT - (boundary ? 18 : major ? 12 : 7));
    const [x1, y1] = pt(v, R_TICK_OUT);
    const on = live && v <= shown + 0.001; // ticks light up behind the count
    ticks.push(
      <line
        key={v}
        x1={x0}
        y1={y0}
        x2={x1}
        y2={y1}
        stroke={on ? "var(--fg)" : boundary ? "var(--fg-subtle)" : "var(--line-strong)"}
        strokeOpacity={on ? (major ? 0.95 : 0.6) : 1}
        strokeWidth={boundary ? 1.5 : major ? 1.25 : 1}
      />,
    );
  }

  return (
    <figure className={`relative mx-auto w-full max-w-[440px] ${className}`}>
      <svg viewBox="0 0 440 440" className="block h-auto w-full" role="img" aria-label={live ? `Overall score ${score} out of 100${tierName ? `, ${tierName}` : ""}` : "Score dial, awaiting your answers"}>
        {/* Face: tone, not gradient */}
        <circle cx={C} cy={C} r={136} fill="var(--bg-raised)" />
        <circle cx={C} cy={C} r={136} fill="none" stroke="var(--line)" />

        {/* Tier bands on an inner ring, current band lifted */}
        {TIERS.map((t, i) => {
          const to = TIERS[i + 1]?.min ?? 100;
          const active = currentTier?.id === t.id;
          return (
            <path
              key={t.id}
              d={arc(t.min + (i === 0 ? 0 : 0.6), to - (i === TIERS.length - 1 ? 0 : 0.6), 146)}
              fill="none"
              stroke={active ? "var(--accent)" : "var(--line-strong)"}
              strokeOpacity={active ? 0.55 : 1}
              strokeWidth={active ? 2 : 1}
            />
          );
        })}

        {/* Track + value */}
        <path d={arc(0, 100, R_TRACK)} fill="none" stroke="var(--line)" strokeWidth={1.5} />
        <path
          d={arc(0, 100, R_TRACK)}
          pathLength={100}
          fill="none"
          stroke="var(--accent)"
          strokeWidth={3}
          strokeDasharray="100 100"
          strokeDashoffset={100 - (live ? needle : 0)}
          className="hc-dial-value"
        />

        {ticks}

        {LABELS.map((v) => {
          const [x, y] = pt(v, 208);
          return (
            <text
              key={v}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="central"
              fill={live && currentTier && v === currentTier.min ? "var(--accent-text)" : "var(--fg-subtle)"}
              style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.06em" }}
            >
              {v}
            </text>
          );
        })}

        {/* Needle: rotates as one group around the centre */}
        <g className="hc-dial-needle" style={{ transform: `rotate(${(SWEEP * needle) / 100}deg)` }}>
          {(() => {
            const [x0, y0] = pt(0, 118);
            const [x1, y1] = pt(0, R_TICK_OUT + 2);
            const [cx, cy] = pt(0, R_TRACK);
            return (
              <>
                <line x1={x0} y1={y0} x2={x1} y2={y1} stroke="var(--fg)" strokeWidth={1.5} strokeLinecap="round" />
                <circle cx={cx} cy={cy} r={5} fill="var(--bg)" stroke="var(--accent)" strokeWidth={2} />
              </>
            );
          })()}
        </g>

        {/* Readout */}
        {live ? (
          <>
            <text
              x={C}
              y={C - 6}
              textAnchor="middle"
              dominantBaseline="central"
              fill="var(--fg)"
              style={{ font: "500 92px var(--font-display)", letterSpacing: "-0.05em", fontVariantNumeric: "tabular-nums" }}
            >
              {Math.round(shown)}
            </text>
            <text x={C} y={C + 52} textAnchor="middle" fill="var(--fg-subtle)" style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.14em" }}>
              OUT OF 100
            </text>
            {tierName && (
              <text x={C} y={C + 118} textAnchor="middle" fill="var(--accent-text)" style={{ font: "500 12px var(--font-mono)", letterSpacing: "0.16em" }}>
                {tierName.toUpperCase()}
              </text>
            )}
          </>
        ) : (
          <>
            <text x={C} y={C - 4} textAnchor="middle" dominantBaseline="central" fill="var(--line-strong)" style={{ font: "500 92px var(--font-display)", letterSpacing: "-0.05em" }}>
              00
            </text>
            <text x={C} y={C + 52} textAnchor="middle" fill="var(--fg-subtle)" style={{ font: "500 11px var(--font-mono)", letterSpacing: "0.14em" }}>
              AWAITING 14 ANSWERS
            </text>
          </>
        )}
      </svg>
      {caption && <figcaption className="hc-label mt-2 text-center text-faint">{caption}</figcaption>}
    </figure>
  );
}
