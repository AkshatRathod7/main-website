"use client";

import { useEffect, useRef, useState } from "react";

/** Marks where a home-page chapter starts. Renders nothing visible; the rail finds these. */
const slug = (s: string) => "ch-" + s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** `fit`: the chapter that follows fills the screen under the nav and centres its content (styles/living.css). */
export function SpyMark({ label, id, nav, fit }: { label: string; id?: string; nav?: boolean; fit?: boolean }) {
  return <span id={id || slug(label)} data-spy={label} data-nav={nav && id ? id : undefined} data-fit={fit ? "" : undefined} aria-hidden="true" className="spy-mark" />;
}

/** One way to land on a chapter everywhere: the mark's scroll-margin sets the offset; no glide under reduced motion. */
export function jumpTo(el: HTMLElement, push = true) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (push && el.id && location.hash !== `#${el.id}`) history.pushState(null, "", `#${el.id}`);
}

/**
 * The home page is the whole site in one scroll, so it gets a chapter rail:
 * a fixed list on the left (desktop) that lights the chapter you're in, a thin progress line,
 * and the section that just became current gets data-spy-on (a hairline draws across its top).
 * It also fits `fit` chapters to the screen and settles a scroll that stops just short of a chapter.
 */
export function SpyRail() {
  const [marks, setMarks] = useState<{ label: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(-1);
  const [at, setAt] = useState<number[]>([]);
  const railRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-spy]"));
    setMarks(els.map((el) => ({ label: el.dataset.spy || "", el })));
    const w = window as unknown as { __spy?: { chapters: { labels: string[]; at: number[] } | null; active: number } };
    const state = { chapters: null as { labels: string[]; at: number[] } | null, active: -1 };
    w.__spy = state;
    const line = () => window.innerHeight * 0.42;
    const navH = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
    const desktop = window.matchMedia("(min-width:1024px)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    // fit: on a short desktop screen, a `fit` chapter scales down a little so it still fills exactly one screen
    const fitSecs = els.filter((el) => el.dataset.fit !== undefined).map((el) => el.nextElementSibling as HTMLElement | null).filter((s): s is HTMLElement => !!s);
    const fit = () => {
      fitSecs.forEach((sec) => {
        const cur = parseFloat(sec.style.getPropertyValue("--fit-z")) || 1;
        let z = 1;
        if (desktop.matches) {
          const cs = getComputedStyle(sec);
          const room = window.innerHeight - navH() - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
          let h = 0;
          for (const c of Array.from(sec.children)) if (getComputedStyle(c).position !== "absolute") h += c.getBoundingClientRect().height;
          if (h > 0) z = Math.max(0.72, Math.min(1, room / (h / cur)));
        }
        if (Math.abs(z - cur) < 0.01) return;
        if (z === 1) sec.style.removeProperty("--fit-z");
        else sec.style.setProperty("--fit-z", z.toFixed(3));
      });
    };
    // where each chapter starts, as a fraction of the page's scroll (for the ticks on the nav bar)
    const measure = () => {
      fit();
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      state.chapters = {
        labels: els.map((el) => el.dataset.spy || ""),
        at: els.map((el) => Math.min(1, Math.max(0, (el.getBoundingClientRect().top + window.scrollY - line()) / max))),
      };
      setAt(state.chapters.at);
      window.dispatchEvent(new CustomEvent("spy:chapters", { detail: state.chapters }));
    };
    let raf = 0;
    let last = -2;
    const tick = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      railRef.current?.style.setProperty("--p", Math.min(1, window.scrollY / max).toFixed(4));
      let idx = -1;
      els.forEach((el, i) => {
        if (el.getBoundingClientRect().top < line()) idx = i;
      });
      if (idx !== last) {
        last = idx;
        state.active = idx;
        setActive(idx);
        window.dispatchEvent(new CustomEvent("spy:chapter", { detail: idx }));
        // which top-nav item this chapter belongs to: the nearest nav mark at or above it
        let key = "";
        for (let k = idx; k >= 0; k--) if (els[k].dataset.nav) { key = els[k].dataset.nav || ""; break; }
        (w.__spy as { nav?: string }).nav = key;
        window.dispatchEvent(new CustomEvent("spy:nav", { detail: key }));
        document.querySelectorAll("[data-spy-on]").forEach((n) => n.removeAttribute("data-spy-on"));
        const sec = idx >= 0 ? (els[idx].nextElementSibling as HTMLElement | null) : null;
        if (sec) sec.setAttribute("data-spy-on", "");
      }
    };
    // settle: when a mouse or trackpad scroll stops within a third of a screen short of a chapter, in the
    // direction it was travelling, glide the rest of the way. Never pulls back against the scroll, so small
    // wheel steps and long chapters stay free. Desktop only; off under reduced motion and for touch.
    let lastY = window.scrollY;
    let dir = 0;
    let settleT = 0;
    let gliding = false;
    let touching = false;
    let quietUntil = 0;
    const settle = () => {
      if (gliding) { gliding = false; return; }
      if (performance.now() < quietUntil) return;
      if (touching || !dir || !desktop.matches || calm.matches) return;
      const y = window.scrollY;
      const reach = window.innerHeight / 3;
      let best: number | null = null;
      for (const el of els) {
        const sec = el.nextElementSibling;
        if (!sec) continue;
        const top = Math.round(sec.getBoundingClientRect().top + y - navH());
        const d = (top - y) * dir;
        if (d > 1 && d <= reach && (best === null || d < (best - y) * dir)) best = top;
      }
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (best === null || best > max) return;
      gliding = true;
      window.scrollTo({ top: best, behavior: "smooth" });
    };
    const on = () => {
      const y = window.scrollY;
      if (y !== lastY) { if (!gliding) dir = y > lastY ? 1 : -1; lastY = y; }
      window.clearTimeout(settleT);
      settleT = window.setTimeout(settle, 140);
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const touchOn = () => { touching = true; };
    const touchOff = () => { touching = false; };
    // keyboard scrolling and clicks (nav and rail jumps) are left exactly where the visitor put them
    const noSettle = () => { quietUntil = performance.now() + 900; };
    const onResize = () => {
      measure();
      on();
    };
    const go = (e: Event) => {
      const el = els[(e as CustomEvent<number>).detail];
      if (el) jumpTo(el);
    };
    measure();
    tick();
    // arriving on a #chapter: late layout (fonts, pinned sprint, images) can shift the target after the
    // browser's own jump, so re-land on it a few times until the visitor scrolls themselves
    let userMoved = false;
    const moved = () => (userMoved = true);
    const reland = () => {
      if (userMoved || !location.hash) return;
      const t = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (t) t.scrollIntoView({ behavior: "auto", block: "start" });
    };
    const lands = [150, 700, 1600].map((ms) => window.setTimeout(reland, ms));
    window.addEventListener("wheel", moved, { passive: true, once: true });
    window.addEventListener("touchstart", moved, { passive: true, once: true });
    window.addEventListener("keydown", moved, { once: true });
    // pinned sections and late images change the page height: re-measure once things settle
    const t1 = window.setTimeout(measure, 800);
    const t2 = window.setTimeout(measure, 2500);
    const ro = new ResizeObserver(() => measure());
    ro.observe(document.body);
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("spy:go", go);
    window.addEventListener("touchstart", touchOn, { passive: true });
    window.addEventListener("touchend", touchOff, { passive: true });
    window.addEventListener("click", noSettle, true);
    window.addEventListener("keydown", noSettle);
    return () => {
      window.clearTimeout(settleT);
      window.removeEventListener("touchstart", touchOn);
      window.removeEventListener("touchend", touchOff);
      window.removeEventListener("click", noSettle, true);
      window.removeEventListener("keydown", noSettle);
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("spy:go", go);
      lands.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("wheel", moved);
      window.removeEventListener("touchstart", moved);
      window.removeEventListener("keydown", moved);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      if (raf) cancelAnimationFrame(raf);
      w.__spy = undefined;
      window.dispatchEvent(new CustomEvent("spy:chapters", { detail: null }));
      window.dispatchEvent(new CustomEvent("spy:chapter", { detail: -1 }));
      window.dispatchEvent(new CustomEvent("spy:nav", { detail: "" }));
    };
  }, []);

  if (!marks.length) return null;
  // the line only marks the five top-level chapters (the ones in the nav); the rest live in the nav chip
  const majors = marks.map((m, i) => ({ ...m, i })).filter((m) => m.el.dataset.nav);
  let cur = -1;
  majors.forEach((m, k) => {
    if (m.i <= active) cur = k;
  });
  const label = cur >= 0 ? majors[cur].label : marks[0]?.label;
  return (
    <nav ref={railRef} className="spy-line" aria-label="On this page" data-show={active >= 0 ? "" : undefined}>
      <span className="sl-track" aria-hidden="true">
        <span className="sl-fill" />
        <span className="sl-head">
          <span key={label} className="sl-now">
            <span className="sl-n">{String(cur + 1).padStart(2, "0")}</span>
            {label}
          </span>
        </span>
      </span>
      <ol>
        {majors.map((m, k) => (
          <li key={m.label} style={{ top: `${(at[m.i] ?? k / majors.length) * 100}%` }} data-past={k <= cur ? "" : undefined}>
            <a
              href={`#${m.el.id}`}
              aria-current={k === cur ? "location" : undefined}
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent("spy:go", { detail: m.i }));
              }}
            >
              <span className="sl-tick" aria-hidden="true" />
              <span className="sl-label">{m.label}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
