"use client";

/**
 * The pin behind the stage deck (components/home/stage-stack.tsx).
 *
 * Pinned mode is switched on in CSS by the same media query as DESK below, so there is no layout change at
 * hydration: the section is `screen + len` tall and `.stk-pin` is sticky under the nav. This component only
 *   1. fits the chapter to the screen (zoom, never below 0.7),
 *   2. measures how far each card has to travel and sets the section's length to exactly that (no dead scroll),
 *   3. moves the cards with the scroll, 1:1, so a card rises at the speed the page was moving and then stops.
 * Card 2 waits with its strip peeking at the bottom of the screen; card 3 comes up behind it as card 2 lands.
 * A covered card scales back a touch from its top edge, so its strip stays where it was.
 * One passive, rAF-throttled scroll listener; transforms only. Outside DESK it clears everything it wrote.
 */
import { useEffect, useRef, type ReactNode } from "react";

const DESK = "(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference) and (scripting: enabled)";
const smooth = (x: number) => {
  const t = Math.min(1, Math.max(0, x));
  return t * t * (3 - 2 * t);
};

export function StagePin({ labelledBy, children }: { labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const sec = ref.current;
    const pin = sec?.querySelector<HTMLElement>(".stk-pin");
    const inner = sec?.querySelector<HTMLElement>(".stk-inner");
    const cards = Array.from(sec?.querySelectorAll<HTMLElement>(".stk-card") ?? []);
    if (!sec || !pin || !inner || cards.length < 2) return;

    const mq = window.matchMedia(DESK);
    // per card: how far it travels (d), where in the scroll it starts (at), how far below it hides before its turn
    const g = { on: false, nav: 72, k: 1, len: 0, d: [] as number[], at: [] as number[], hide: 0 };
    let raf = 0;
    let mraf = 0;

    const clear = () => {
      g.on = false;
      sec.style.removeProperty("--stk-len");
      inner.style.removeProperty("--stk-z");
      cards.forEach((c) => {
        c.style.removeProperty("transform");
        c.style.removeProperty("--u");
      });
    };

    const update = () => {
      raf = 0;
      if (!g.on) return;
      const s = Math.min(g.len, Math.max(0, g.nav - sec.getBoundingClientRect().top));
      const y: number[] = [0];
      const t: number[] = [0];
      for (let j = 1; j < cards.length; j++) {
        const max = g.d[j] + (j > 1 ? g.hide : 0);
        y[j] = Math.min(max, Math.max(0, g.d[j] - (s - g.at[j])));
        t[j] = smooth((1 - y[j] / g.d[j] - 0.5) / 0.5); // 0 → 1 over the second half of the landing
      }
      cards.forEach((c, i) => {
        let under = 0;
        let dim = 0;
        for (let j = i + 1; j < cards.length; j++) {
          under += t[j];
          dim += t[j] * (j === i + 1 ? 1 : 0.4);
        }
        const move = y[i] ? `translate3d(0,${(y[i] / g.k).toFixed(1)}px,0)` : "";
        const scale = under ? ` scale(${(1 - 0.035 * under).toFixed(4)})` : "";
        c.style.transform = move + scale || "none";
        c.style.setProperty("--u", dim.toFixed(3));
      });
    };

    const measure = () => {
      mraf = 0;
      if (!mq.matches) {
        clear();
        return;
      }
      // 1. fit: natural height at zoom 1, against the room inside the pin
      inner.style.setProperty("--stk-z", "1");
      cards.forEach((c) => (c.style.transform = "none"));
      const cs = getComputedStyle(pin);
      const room = pin.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const z = Math.max(0.7, Math.min(1, room / Math.max(1, inner.offsetHeight)));
      if (z < 0.995) inner.style.setProperty("--stk-z", z.toFixed(3));
      else inner.style.removeProperty("--stk-z");
      // 2. geometry, in screen pixels; k converts a screen distance into the card's own (zoomed) pixels
      const bottom = pin.getBoundingClientRect().bottom;
      const tops = cards.map((c) => c.getBoundingClientRect().top);
      cards[1].style.transform = "translate3d(0,100px,0)";
      g.k = (cards[1].getBoundingClientRect().top - tops[1]) / 100 || 1;
      const peek = Math.min(96, Math.max(40, tops[1] - tops[0] + 8));
      g.hide = peek + 16;
      let at = 0;
      for (let j = 1; j < cards.length; j++) {
        g.d[j] = Math.max(48, bottom - peek - tops[j]);
        g.at[j] = at;
        at += g.d[j];
      }
      g.len = Math.round(at);
      g.nav = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-height")) || 72;
      sec.style.setProperty("--stk-len", `${g.len}px`);
      g.on = true;
      update();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      if (!mraf) mraf = requestAnimationFrame(measure);
    };
    measure();
    const ro = new ResizeObserver(onResize);
    ro.observe(pin);
    ro.observe(inner);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    mq.addEventListener("change", onResize);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(mraf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      mq.removeEventListener("change", onResize);
      clear();
    };
  }, []);

  return (
    <section ref={ref} aria-labelledby={labelledBy} className="stk">
      {children}
    </section>
  );
}
