"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Section reveal: opacity + translate + blur-to-sharp, ease-out, once.
 * Stage 10: visible at rest. Before, every .reveal started at opacity 0 and waited for an observer,
 * so no-JS visitors, crawlers and slow devices saw blank sections. Now only elements that start
 * below the fold are primed (data-in="false"), exactly like the Home and Stage 08 reveals.
 */
export function Reveal({
  as: Tag = "div",
  delay = 0,
  className = "",
  children,
}: {
  as?: ElementType;
  delay?: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < innerHeight * 0.92) return;
    el.dataset.in = "false";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.in = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${className}`} style={delay ? { ["--reveal-delay" as string]: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}
