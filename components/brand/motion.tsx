"use client";

/**
 * Small motion primitives. Rules carried from Stage 10:
 *   - transform and opacity only; one passive, rAF-throttled listener per effect
 *   - content is complete with no JS and with reduced motion (nothing starts hidden unless JS primes it)
 *   - only elements that start below the fold get primed, so the first frame is always whole
 */
import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from "react";
import { cn } from "@/lib/cn";

// Reduced motion is honoured in CSS (shorter travel, no smooth scroll); the motion itself stays. See globals.css.
const reduced = () => false;

/* ───────────────────────── Reveal ─────────────────────────
   Children with `.rv` (or the element itself with `self`) rise in when the group scrolls into view.
   Stagger comes from `--i` on each child. */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  threshold = 0.18,
  style,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  threshold?: number;
  style?: CSSProperties;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.dataset.rv = "wait";
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          el.dataset.rv = "go";
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return (
    <Tag ref={ref} className={cn("rv-group", className)} style={style} {...rest}>
      {children}
    </Tag>
  );
}

/* ───────────────────────── CountUp ─────────────────────────
   Counts to `to` once, when visible. The final value is server-rendered, so no-JS and crawlers get it. */
export function CountUp({ to, prefix = "", suffix = "", duration = 1400, className }: { to: number; prefix?: string; suffix?: string; duration?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced() || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    el.textContent = `${prefix}0${suffix}`;
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 4);
          el.textContent = `${prefix}${Math.round(eased * to)}${suffix}`;
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, prefix, suffix, duration]);
  return (
    <span ref={ref} className={cn("numeric", className)}>
      {prefix}
      {to}
      {suffix}
    </span>
  );
}

/* ───────────────────────── Spotlight ─────────────────────────
   Writes the pointer position into --mx / --my on hover-capable devices; CSS draws a soft glow there. */
export function Spotlight({ as: Tag = "div", className, children, ...rest }: { as?: ElementType; className?: string; children: ReactNode; [k: string]: unknown }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          el.style.setProperty("--mx", `${x}px`);
          el.style.setProperty("--my", `${y}px`);
        });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);
  return (
    <Tag ref={ref} className={cn("spotlight", className)} {...rest}>
      {children}
    </Tag>
  );
}

/* ───────────────────────── ScrollProgressVar ─────────────────────────
   Sets --p (0 → 1) on the element as it travels through the viewport. CSS does the rest. */
export function ScrollVar({
  as: Tag = "div",
  className,
  children,
  start = 1,
  end = 0,
  ...rest
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  /** viewport fraction where p = 0 (element top) */
  start?: number;
  /** viewport fraction where p = 1 (element bottom) */
  end?: number;
  [k: string]: unknown;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const from = vh * start;
      const to = vh * end - r.height;
      const p = Math.min(1, Math.max(0, (from - r.top) / (from - to)));
      el.style.setProperty("--p", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [start, end]);
  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}

/* ───────────────────────── useMedia ───────────────────────── */
export function useMedia(query: string) {
  const [match, setMatch] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(query);
    const set = () => setMatch(m.matches);
    set();
    m.addEventListener("change", set);
    return () => m.removeEventListener("change", set);
  }, [query]);
  return match;
}
