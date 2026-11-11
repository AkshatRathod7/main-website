"use client";

import { useEffect, useRef, useState } from "react";

type Options = {
  /** Fire once and disconnect (default true). */
  once?: boolean;
  rootMargin?: string;
  threshold?: number;
};

/**
 * Minimal IntersectionObserver hook for scroll-triggered reveals.
 * Pair with `data-inview={inView}` and the `.reveal-line` / `.enter` classes in globals.css.
 * Reduced motion is handled in CSS (travel + blur tokens collapse to 0), so this hook doesn't branch.
 */
export function useInView<T extends Element>({
  once = true,
  rootMargin = "0px 0px -12% 0px",
  threshold = 0.15,
}: Options = {}) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Reduced motion: no entrance to wait for, so show it now (keeps find-in-page, anchors and print whole).
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          if (once) io.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin, threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once, rootMargin, threshold]);

  return [ref, inView] as const;
}
