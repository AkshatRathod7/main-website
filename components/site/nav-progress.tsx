"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The nav bar is the progress bar.
 * - Every page: a soft coral wash fills the bar from the left as you scroll, with a solid coral → gold edge on its bottom.
 * - Home page: SpyRail (components/brand/spy.tsx) broadcasts its chapters on `spy:chapters` / `spy:chapter`.
 *   The bar then shows a tick per chapter at its point in the scroll (passed ones lit), and NavChapter shows
 *   the chapter you're in, as a tap-to-jump chip inside the bar.
 */
export type SpyChapters = { labels: string[]; at: number[] } | null;

export function NavProgress() {
  const fill = useRef<HTMLSpanElement>(null);
  const [chapters, setChapters] = useState<SpyChapters>(null);
  const [active, setActive] = useState(-1);
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const v = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      fill.current?.parentElement?.style.setProperty("--p", String(v));
      setP(v);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onChapters = (e: Event) => setChapters((e as CustomEvent<SpyChapters>).detail);
    const onChapter = (e: Event) => setActive((e as CustomEvent<number>).detail);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("spy:chapters", onChapters);
    window.addEventListener("spy:chapter", onChapter);
    const w = window as unknown as { __spy?: { chapters: SpyChapters; active: number } };
    if (w.__spy) {
      setChapters(w.__spy.chapters);
      setActive(w.__spy.active);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("spy:chapters", onChapters);
      window.removeEventListener("spy:chapter", onChapter);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span aria-hidden="true" className="np" data-full={p > 0.995 ? "" : undefined}>
      <span ref={fill} className="np-wash" />
      <span className="np-edge" />
      {chapters?.at.map((x, i) => (
        <span
          key={i}
          className="np-tick"
          style={{ left: `${x * 100}%` }}
          data-past={i < active ? "" : undefined}
          data-on={i === active ? "" : undefined}
        />
      ))}
    </span>
  );
}

/** The chapter you're in, inside the nav bar (home page, under 1024px, where the nav links are hidden). Tap to jump to another chapter. */
export function NavChapter() {
  const [chapters, setChapters] = useState<SpyChapters>(null);
  const [active, setActive] = useState(-1);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onChapters = (e: Event) => setChapters((e as CustomEvent<SpyChapters>).detail);
    const onChapter = (e: Event) => setActive((e as CustomEvent<number>).detail);
    window.addEventListener("spy:chapters", onChapters);
    window.addEventListener("spy:chapter", onChapter);
    const w = window as unknown as { __spy?: { chapters: SpyChapters; active: number } };
    if (w.__spy) {
      setChapters(w.__spy.chapters);
      setActive(w.__spy.active);
    }
    return () => {
      window.removeEventListener("spy:chapters", onChapters);
      window.removeEventListener("spy:chapter", onChapter);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      btn.current?.focus();
    };
    const out = (e: PointerEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", esc);
    window.addEventListener("pointerdown", out);
    return () => {
      window.removeEventListener("keydown", esc);
      window.removeEventListener("pointerdown", out);
    };
  }, [open]);

  if (!chapters || active < 0) return null;
  const n = String(active + 1).padStart(2, "0");
  return (
    <div
      ref={box}
      className="nc"
      data-open={open ? "" : undefined}
      onBlur={(e) => {
        // tabbing out of the list closes it
        if (open && !box.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button ref={btn} type="button" aria-expanded={open} aria-controls="nc-list" aria-label={`Chapter ${n}: ${chapters.labels[active]}. Jump to another`} onClick={() => setOpen((o) => !o)}>
        <span className="nc-n">{n}</span>
        <span key={active} className="nc-l">{chapters.labels[active]}</span>
        <span className="nc-c" aria-hidden="true" />
      </button>
      {open && (
        <ul id="nc-list" aria-label="On this page">
          {chapters.labels.map((l, i) => (
            <li key={l}>
              <button
                type="button"
                aria-current={i === active ? "location" : undefined}
                onClick={() => {
                  setOpen(false);
                  btn.current?.focus({ preventScroll: true });
                  window.dispatchEvent(new CustomEvent("spy:go", { detail: i }));
                }}
              >
                <span className="nc-n">{String(i + 1).padStart(2, "0")}</span>
                {l}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * "grow", in the nav: the page's progress fills the word one letter per quarter, from the baseline up,
 * and the full stop lands at the end. Every page has it; the category is growth.
 */
export function NavGrow() {
  const ref = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const v = max > 0 ? Math.min(1, window.scrollY / max) : 1;
      ref.current?.style.setProperty("--g", v.toFixed(4));
      setDone(v > 0.995);
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <span ref={ref} className="ng" aria-hidden="true" data-done={done ? "" : undefined}>
      {"grow".split("").map((ch, i) => (
        <span key={i} className="ng-l" data-ch={ch} style={{ ["--i" as string]: i }}>
          {ch}
        </span>
      ))}
      <span className="ng-dot" />
    </span>
  );
}
