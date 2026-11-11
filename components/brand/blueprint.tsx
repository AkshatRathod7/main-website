"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { PROBLEM, STAGES } from "@/content/site";

/**
 * Hero: the business, drawn the way an architect draws a building.
 *
 * DreamSVin calls itself "Your Business Architects", so the hero is a drawing sheet: the foundation
 * (positioning, offer, brand), three floors of growth (Content, Community, Collaborations) and the
 * scale storey with a crane still on site. It draws itself along a 90-day ruler while a day counter runs
 * from 001 to 090, so the four sprint phases are the construction schedule.
 *
 * Click to build: every click on the sheet (or the button under it) builds the next sprint phase: Diagnose
 * shows the survey lines only, Plan lays the foundation, Execute raises the three growth floors, Optimise
 * adds the scale storey. A storey or its label lights the stage where that work starts; a ruler phase jumps
 * straight to it.
 *
 * The other live thing: "Where is your business today?" Pick a situation (the four Problem cards) and the
 * drawing lights the storey where the work starts. Buttons are real buttons; the answer is announced.
 *
 * Motion: CSS draws the lines (stroke-dashoffset on pathLength=1), JS only runs the counter. Every
 * animation ends in its finished state, so no-JS and reduced motion see the completed drawing.
 */

const DAYS = 90;
const BUILD_MS = 4300;

// Ruler geometry (viewBox units). Day 1 sits at X0, day 90 at X1.
const X0 = 60;
const X1 = 740;
const dayX = (d: number) => X0 + ((d - 1) / (DAYS - 1)) * (X1 - X0);
const PHASES = [
  { name: "Diagnose", from: 1, to: 15 },
  { name: "Plan", from: 16, to: 30 },
  { name: "Execute", from: 31, to: 60 },
  { name: "Optimise", from: 61, to: 90 },
];

const BX = 300; // building left
const BW = 280; // building width
const GROUND = 392;
const FLOOR = 50;

export function HeroBlueprint() {
  const [pick, setPick] = useState(0);
  const [day, setDay] = useState(DAYS);
  const [running, setRunning] = useState(false);
  // Click to build: null until the visitor clicks, then the phase the drawing is built up to (0 to 3).
  const [step, setStep] = useState<number | null>(null);
  // the visitor has answered "Where is your business today?": the drawing answers back (see the bp-hl layer)
  const [picked, setPicked] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const id = useId();

  // Day counter, synced with the CSS build. Starts when the sheet is on screen.
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    let raf = 0;
    let t0 = 0;
    const tick = (t: number) => {
      if (!t0) t0 = t;
      const p = Math.min(1, (t - t0) / BUILD_MS);
      setDay(Math.max(1, Math.round(1 + p * (DAYS - 1))));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setRunning(false);
    };
    // Hold the finished-looking sheet hidden until it is on screen, then build it once.
    el.dataset.build = "wait";
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        setDay(1);
        setRunning(true);
        el.dataset.build = "go";
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  const card = PROBLEM.cards[pick];
  const stage = STAGES.find((s) => s.key === card.stage)!;
  const phase = PHASES.find((p) => day >= p.from && day <= p.to)!;
  const nextStep = step === null ? 0 : (step + 1) % PHASES.length;
  const goTo = (i: number) => {
    if (running) return;
    setStep(i);
    setDay(PHASES[i].to);
  };
  // a storey or its label: light the stage where that work starts
  const pickStage = (key: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const i = PROBLEM.cards.findIndex((c) => c.stage === key);
    if (i >= 0) setPick(i);
  };

  return (
    <div ref={sheetRef} className="bp" data-start={card.stage} data-build="still" data-step={step ?? undefined}>
      {/* Picker */}
      <div className="bp-pick">
        <p id={`${id}-q`} className="bp-q">
          Where is your business today?
        </p>
        <div role="group" aria-labelledby={`${id}-q`} className="bp-opts">
          {PROBLEM.cards.map((c, i) => (
            <button
              key={c.k}
              type="button"
              aria-pressed={pick === i}
              onClick={() => {
                setPick(i);
                setPicked(true);
              }}
              className="bp-opt"
              data-event={`Hero pick ${c.k}`}
            >
              {c.k}
            </button>
          ))}
        </div>
        <div className="bp-answer" aria-live="polite">
          <p className="bp-answer-v">{card.v}</p>
          <p className="bp-answer-s">
            We start with <b>{stage.name}</b>. {stage.tag}
          </p>
        </div>
        <Link href="/#what-we-do" className="bp-link" data-event="Hero stage link">
          What {stage.name.toLowerCase()} work covers
          <span aria-hidden="true">›</span>
        </Link>
      </div>

      {/* Drawing */}
      <figure className="bp-sheet" aria-label="A drawing of a business built in three stages over a 90-day plan" onClick={() => goTo(nextStep)}>
        <svg viewBox="0 0 800 470" className="bp-svg" role="img" aria-hidden="true">
          <defs>
            <pattern id={`${id}-hatch`} width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="8" className="bp-hatch" />
            </pattern>
          </defs>

          {/* Faint grid */}
          <g className="bp-grid">
            {Array.from({ length: 16 }, (_, i) => (
              <line key={`v${i}`} x1={50 * i + 25} y1="20" x2={50 * i + 25} y2="420" />
            ))}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`h${i}`} x1="20" y1={50 * i + 42} x2="780" y2={50 * i + 42} />
            ))}
          </g>

          {/* Ground */}
          <line x1="270" y1={GROUND} x2="790" y2={GROUND} className="bp-ln bp-ground" pathLength={1} style={{ ["--d" as string]: "0ms" }} />

          {/* Foundation: slab + piles, hatched */}
          <g className="bp-st st-foundation" style={{ ["--d" as string]: "250ms" }} onClick={pickStage("foundation")}>
            <rect x={BX - 14} y={GROUND} width={BW + 28} height="22" className="bp-fill" />
            <rect x={BX - 14} y={GROUND} width={BW + 28} height="22" fill={`url(#${id}-hatch)`} className="bp-hatchfill" />
            <rect x={BX - 14} y={GROUND} width={BW + 28} height="22" className="bp-ln" pathLength={1} />
            {[0, 1, 2, 3, 4].map((i) => (
              <line key={i} x1={BX + 10 + i * 65} y1={GROUND + 22} x2={BX + 10 + i * 65} y2={GROUND + 46} className="bp-ln" pathLength={1} />
            ))}
          </g>

          {/* Growth: three floors */}
          {["Content", "Community", "Collaborations"].map((f, i) => {
            const y = GROUND - FLOOR * (i + 1);
            return (
              <g key={f} className="bp-st st-growth" style={{ ["--d" as string]: `${1500 + i * 420}ms` }} onClick={pickStage("growth")}>
                <rect x={BX} y={y} width={BW} height={FLOOR} className="bp-fill" />
                <rect x={BX} y={y} width={BW} height={FLOOR} className="bp-ln" pathLength={1} />
                {[0, 1, 2, 3, 4, 5].map((w) => (
                  <rect key={w} x={BX + 16 + w * 44} y={y + 14} width="26" height="22" rx="1" className="bp-ln bp-win" pathLength={1} />
                ))}
                <text x={BX + BW + 22} y={y + 30} className="bp-tag">
                  {f}
                </text>
              </g>
            );
          })}

          {/* Scale: the top storey, parapet and a flag */}
          <g className="bp-st st-scale" style={{ ["--d" as string]: "2900ms" }} onClick={pickStage("scale")}>
            <rect x={BX + 30} y={GROUND - FLOOR * 4 - 4} width={BW - 60} height={FLOOR + 4} className="bp-fill" />
            <rect x={BX + 30} y={GROUND - FLOOR * 4 - 4} width={BW - 60} height={FLOOR + 4} className="bp-ln" pathLength={1} />
            <path d={`M${BX + 22} ${GROUND - FLOOR * 4 - 4} h${BW - 44}`} className="bp-ln" pathLength={1} />
            {[0, 1, 2, 3].map((w) => (
              <rect key={w} x={BX + 52 + w * 46} y={GROUND - FLOOR * 4 + 10} width="26" height="22" rx="1" className="bp-ln bp-win" pathLength={1} />
            ))}
            <path d={`M${BX + BW / 2} ${GROUND - FLOOR * 4 - 4} v-46`} className="bp-ln" pathLength={1} />
            <path d={`M${BX + BW / 2} ${GROUND - FLOOR * 4 - 50} l26 8 l-26 8 z`} className="bp-flag" />
          </g>

          {/* Crane, still on site: the work keeps going after day 90 */}
          <g className="bp-crane" style={{ ["--d" as string]: "600ms" }}>
            <path d="M756 392 V64" className="bp-ln" pathLength={1} />
            <path d="M746 392 V64 M766 392 V64" className="bp-ln bp-thin" pathLength={1} />
            <path d="M470 64 H790" className="bp-ln" pathLength={1} />
            <path d="M756 64 L716 32 L790 64" className="bp-ln bp-thin" pathLength={1} />
            <g className="bp-hook">
              <path d="M520 64 V140" className="bp-ln bp-thin" pathLength={1} />
              <rect x="502" y="140" width="36" height="22" className="bp-load" />
            </g>
          </g>

          {/* Stage labels with leaders */}
          {/* The drawing's answer to the picker. Each situation marks a different part, drawn fresh on every
              click: starting out = the foundation and its piles; stuck = the growth floors' windows light up
              and go dim, then the foundation is marked (the cause is lower down); stretched = the scale storey plus the next storey, dashed; an institution = the
              whole outline, ground to flag. */}
          {picked && (
            <g key={pick} className="bp-hl" aria-hidden="true">
              {pick === 0 && (
                <>
                  <rect x={BX - 14} y={GROUND} width={BW + 28} height="22" className="bp-hl-ln" pathLength={1} />
                  {[310, 375, 440, 505, 570].map((x, k) => (
                    <line key={x} x1={x} y1={GROUND + 22} x2={x} y2={GROUND + 46} className="bp-hl-ln" pathLength={1} style={{ ["--k" as string]: k + 3 }} />
                  ))}
                </>
              )}
              {pick === 1 && (
                <>
                  {[0, 1, 2].flatMap((f) =>
                    [0, 1, 2, 3, 4, 5].map((k) => (
                      <rect key={`${f}-${k}`} x={BX + 16 + k * 44} y={GROUND - FLOOR * (f + 1) + 14} width="26" height="22" rx="1" className="bp-hl-win" style={{ ["--k" as string]: f * 6 + k }} />
                    )),
                  )}
                  <rect x={BX - 14} y={GROUND} width={BW + 28} height="22" className="bp-hl-ln" pathLength={1} style={{ ["--k" as string]: 20 }} />
                </>
              )}
              {pick === 2 && (
                <>
                  <rect x={BX + 30} y={GROUND - FLOOR * 3 - 54} width={BW - 60} height="54" className="bp-hl-ln" pathLength={1} />
                  <rect x={BX + 30} y={GROUND - FLOOR * 3 - 108} width={BW - 60} height="54" className="bp-hl-ghost" />
                </>
              )}
              {pick === 3 && (
                <>
                  <path
                    d={`M${BX - 14} ${GROUND + 22} V${GROUND} H${BX} V${GROUND - FLOOR * 3} H${BX + 30} V${GROUND - FLOOR * 3 - 54} H${BX + BW - 30} V${GROUND - FLOOR * 3} H${BX + BW} V${GROUND} H${BX + BW + 14} V${GROUND + 22} Z`}
                    className="bp-hl-ln"
                    pathLength={1}
                  />
                  <path d="M440 142 l26 8 l-26 8 z" className="bp-hl-flag" />
                </>
              )}
            </g>
          )}

          <g className="bp-labels">
            <g className="bp-lab lab-scale" style={{ ["--d" as string]: "3200ms" }} onClick={pickStage("scale")}>
              <text x="60" y={GROUND - FLOOR * 4 + 22} className="bp-name">Scale</text>
              <text x="60" y={GROUND - FLOOR * 4 + 42} className="bp-sub">Systems, team, new markets</text>
              <path d={`M240 ${GROUND - FLOOR * 4 + 16} H${BX + 22}`} className="bp-lead" />
            </g>
            <g className="bp-lab lab-growth" style={{ ["--d" as string]: "2300ms" }} onClick={pickStage("growth")}>
              <text x="60" y={GROUND - FLOOR * 2 + 4} className="bp-name">Growth</text>
              <text x="60" y={GROUND - FLOOR * 2 + 24} className="bp-sub">Content, community, collaborations</text>
              <path d={`M240 ${GROUND - FLOOR * 2 - 2} H${BX - 8}`} className="bp-lead" />
            </g>
            <g className="bp-lab lab-foundation" style={{ ["--d" as string]: "900ms" }} onClick={pickStage("foundation")}>
              <text x="60" y={GROUND + 6} className="bp-name">Foundation</text>
              <text x="60" y={GROUND + 26} className="bp-sub">Positioning, offer, brand</text>
              <path d={`M240 ${GROUND} H${BX - 22}`} className="bp-lead" />
            </g>
          </g>

          {/* The 90-day ruler */}
          <g className="bp-ruler">
            <line x1={X0} y1="452" x2={X1} y2="452" className="bp-ruler-line" />
            {PHASES.map((p, i) => (
              <g key={p.name} className="bp-phase-hit" onClick={(e) => { e.stopPropagation(); goTo(i); }}>
                <rect x={dayX(p.from)} y="436" width={dayX(p.to) - dayX(p.from)} height="34" fill="transparent" />
                <line x1={dayX(p.from)} y1="444" x2={dayX(p.from)} y2="460" className="bp-ruler-tick" />
                <text x={dayX(p.from) + 6} y="468" className={i === PHASES.indexOf(phase) ? "bp-phase bp-phase-on" : "bp-phase"}>
                  {p.name}
                </text>
              </g>
            ))}
            <line x1={X1} y1="444" x2={X1} y2="460" className="bp-ruler-tick" />
            <g className="bp-marker" style={{ transform: `translateX(${dayX(day) - X0}px)` }}>
              <path d={`M${X0 - 6} 438 h12 l-6 9 z`} className="bp-marker-head" />
            </g>
          </g>
        </svg>

        {/* Title block, like the corner of a drawing sheet */}
        <figcaption className="bp-title">
          <span className="bp-title-row">
            <span>Project</span>
            <b>Your business</b>
          </span>
          <span className="bp-title-row">
            <span>Architects</span>
            <b>DreamSVin</b>
          </span>
          <span className="bp-title-row bp-day" aria-hidden={running || undefined}>
            <span>Day</span>
            <b>
              {String(day).padStart(3, "0")} <i>/ 090</i>
            </b>
          </span>
          <span className="bp-title-row">
            <span>Phase</span>
            <b aria-live="polite">{phase.name}</b>
          </span>
        </figcaption>
        {/* The same click as the drawing, as a real button: each press builds the next phase. */}
        <button type="button" className="bp-next" onClick={(e) => { e.stopPropagation(); goTo(nextStep); }} disabled={running} data-event="Hero build step">
          <span className="bp-next-dot" aria-hidden="true" />
          {step === null ? "Click the drawing to build it, phase by phase" : `Next: ${PHASES[nextStep].name}`}
        </button>
      </figure>
    </div>
  );
}
