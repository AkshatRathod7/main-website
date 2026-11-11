"use client";

/**
 * The services index (client island for components/home/services.tsx).
 * The list is five links; the pane beside it (desktop only) shows the row you are on. Until you touch it,
 * the index plays itself once it is on screen, one row every few seconds, with a rule filling under the
 * current row; hover, focus or a tap takes over for good. Under reduced motion it does not play itself.
 * On a touch screen with the pane showing, the first tap on a row opens it in the pane and the second follows
 * the link; the pane carries its own link as well.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BrandIcon, type BrandIconName } from "@/components/brand/icons";
import { Reveal } from "@/components/brand/motion";

export type ServiceItem = {
  slug: string;
  name: string;
  headline: string;
  opening: string;
  icon: BrandIconName;
  get: readonly string[];
  stage: string;
  stageTag: string;
};

const STEP = 4600;
const PANE = "(min-width: 1024px)";
const pad = (n: number) => String(n).padStart(2, "0");

export function ServicesIndex({ items }: { items: ServiceItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(false); // playing itself: on screen, pane showing, motion allowed, not yet touched
  const taken = useRef(false);
  const touch = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const pane = window.matchMedia(PANE);
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    let seen = false;
    const set = () => setAuto(seen && pane.matches && !calm.matches && !taken.current);
    const io = new IntersectionObserver(
      ([e]) => {
        seen = Boolean(e?.isIntersecting);
        set();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    pane.addEventListener("change", set);
    calm.addEventListener("change", set);
    return () => {
      io.disconnect();
      pane.removeEventListener("change", set);
      calm.removeEventListener("change", set);
    };
  }, []);

  useEffect(() => {
    if (!auto) return;
    const t = window.setTimeout(() => setActive((a) => (a + 1) % items.length), STEP);
    return () => window.clearTimeout(t);
  }, [auto, active, items.length]);

  const take = (i: number) => {
    taken.current = true;
    setAuto(false);
    setActive(i);
  };

  return (
    <div ref={ref} className="svx-grid" data-auto={auto || undefined} style={{ ["--svx-step" as string]: `${STEP}ms` }}>
      <Reveal as="ol" className="svx-list">
        {items.map((s, i) => (
          <li key={s.slug} className="rv svx-row" data-active={i === active || undefined} style={{ ["--i" as string]: i }}>
            <Link
              href={`/what-we-do/${s.slug}`}
              className="svx-link"
              data-event={`Service ${s.name}`}
              onPointerEnter={(e) => {
                if (e.pointerType === "mouse") take(i);
              }}
              onPointerDown={(e) => {
                touch.current = e.pointerType !== "mouse";
              }}
              onFocus={() => take(i)}
              onClick={(e) => {
                // touch, pane showing, row not open yet: open it first; the next tap (or the pane's link) goes
                if (touch.current && i !== active && window.matchMedia(PANE).matches) {
                  e.preventDefault();
                  take(i);
                }
              }}
            >
              <span className="svx-n numeric" aria-hidden="true">
                {pad(i + 1)}
              </span>
              <div className="svx-main">
                <div className="svx-text">
                  <h3 className="svx-name">{s.name}</h3>
                  <p className="svx-out">{s.headline}</p>
                </div>
                <span className="svx-stage">
                  <span className="sr-only">Stage: </span>
                  {s.stage}
                </span>
              </div>
              <span className="svx-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          </li>
        ))}
      </Reveal>

      <div className="svx-pane">
        {items.map((s, i) => (
          <div key={s.slug} className="svx-detail" data-active={i === active || undefined} aria-hidden={i !== active || undefined}>
            <div className="svx-top" style={{ ["--j" as string]: 0 }}>
              <BrandIcon name={s.icon} size={40} />
              <span className="svx-of numeric" aria-hidden="true">
                {pad(i + 1)} / {pad(items.length)}
              </span>
            </div>
            <p className="svx-where" style={{ ["--j" as string]: 1 }}>
              <b>{s.stage}</b>
              {s.stageTag && <> · {s.stageTag}</>}
            </p>
            <p className="svx-open" style={{ ["--j" as string]: 2 }}>
              {s.opening}
            </p>
            <p className="svx-get-h" style={{ ["--j" as string]: 3 }}>
              What you get
            </p>
            <ul className="svx-get" style={{ ["--j" as string]: 4 }}>
              {s.get.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
            <Link href={`/what-we-do/${s.slug}`} className="svx-go group" tabIndex={i === active ? undefined : -1} data-event={`Service pane ${s.name}`} style={{ ["--j" as string]: 5 }}>
              <span>
                See this service<span className="sr-only">: {s.name}</span>
              </span>
              <span aria-hidden="true" className="nudge">→</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
