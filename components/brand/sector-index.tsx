"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SECTORS, SECTOR_OF } from "@/content/sectors";
import { CASES } from "@/content/cases";
import { SectorArt } from "./sector-art";

const STEP = 5200; // ms per industry while it auto-plays

/**
 * Our work, by industry. A list of eight industries on the left; the stage on the right draws that
 * industry's motif, its strongest stated result, the clients, and links to the full stories.
 * Auto-advances while on screen (the active row's bar is the timer); hover, focus or a click takes over.
 */
export function SectorIndex() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false); // visitor has chosen: stop auto-play for good
  const [paused, setPaused] = useState(false); // hover/focus: pause the timer
  const [onScreen, setOnScreen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (held || paused || !onScreen) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % SECTORS.length), STEP);
    return () => window.clearTimeout(t);
  }, [active, held, paused, onScreen]);

  const s = SECTORS[active];
  const stories = CASES.filter((c) => SECTOR_OF[c.sector] === s.key);

  return (
    <div
      ref={root}
      className="si"
      data-run={!held && !paused && onScreen ? "" : undefined}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      style={{ ["--step" as string]: `${STEP}ms` }}
    >
      <ol className="si-list" aria-label="Industries">
        {SECTORS.map((x, i) => (
          <li key={x.key}>
            <button
              type="button"
              className="si-row"
              aria-pressed={i === active}
              aria-controls="si-stage"
              onClick={() => {
                setActive(i);
                setHeld(true);
              }}
            >
              <span className="si-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="si-name">{x.name}</span>
              <span className="si-count">{x.clients.length}</span>
              <span className="si-bar" aria-hidden="true">
                {i === active && <span key={`${active}-${held}`} />}
              </span>
            </button>
          </li>
        ))}
      </ol>

      <div id="si-stage" className="si-stage" aria-live="polite" data-sector={s.key}>
        <div key={s.key} className="si-stage-in">
          <div className="si-art">
            <SectorArt sector={s.key} />
          </div>
          <div className="si-copy">
            <p className="si-kicker">{s.name}</p>
            <p className="si-line">{s.line}</p>
            <p className="si-proof">
              <span className="si-v">{s.proof.v}</span>
              <span className="si-k">
                {s.proof.k}
                <span className="si-who"> · {s.proof.who}</span>
              </span>
            </p>
            <ul className="si-clients" aria-label={`${s.name} clients`}>
              {s.clients.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {stories.length > 0 && (
              <p className="si-links">
                {stories.map((c) => (
                  <Link key={c.slug} href={`/work/${c.slug}`} className="si-link" data-event={`Sector story ${c.client}`}>
                    {c.client}: read the story <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Every case study as one strip. Each card wears a tint and its industry's motif; hovering or focusing a
 * card opens it wider, redraws the motif in that card's colour and shows the result (or what we did).
 * Wide screens: an accordion row. Narrow: a swipeable rail with every card open.
 */
export function CaseRow() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <ul className="si-cases" aria-label="All case studies" onPointerLeave={() => setOpen(null)}>
      {CASES.map((c, i) => (
        <li key={c.slug} className="si-case-li" data-open={open === i ? "" : undefined}>
          <Link
            href={`/work/${c.slug}`}
            className="si-case"
            data-tint={(i + 1) % 5}
            onPointerEnter={() => setOpen(i)}
            onFocus={() => setOpen(i)}
            data-event={`Case strip ${c.client}`}
          >
            <SectorArt key={open === i ? "on" : "off"} sector={SECTOR_OF[c.sector] ?? "consumer"} className="si-case-art" />
            <span className="si-case-top">
              <span className="si-case-sector">{c.sector}</span>
              <span aria-hidden="true" className="si-case-go">↗</span>
            </span>
            <span className="si-case-body">
              {c.result && (
                <span className="si-case-v">
                  {c.result.v}
                  <span className="si-case-k"> {c.result.k}</span>
                </span>
              )}
              <span className="si-case-name">{c.client}</span>
              <span className="si-case-line">{c.focus}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
