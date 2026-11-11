"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/site";

/** Hairline accent progress bar. transform: scaleX only; rAF-throttled. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const article = document.querySelector("article");
    const el = bar.current;
    if (!article || !el) return;
    let raf = 0;
    let sent = false;
    const update = () => {
      raf = 0;
      const r = article.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      el.style.transform = `scaleX(${p})`;
      if (!sent && p > 0.75) {
        sent = true;
        track("Insight Read 75%", { path: location.pathname });
      }
    };
    const onScroll = () => (raf ||= requestAnimationFrame(update));
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[2px]">
      <div ref={bar} className="h-full origin-left scale-x-0 bg-accent will-change-transform" />
    </div>
  );
}
