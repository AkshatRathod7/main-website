"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { useInView } from "@/lib/use-in-view";

/* ───────────────────────── Headline with reveal ─────────────────────────
   Pass `lines` — you decide the breaks (art direction beats auto-splitting).
   reveal="load"   CSS keyframes from first paint (hero; no JS dependency, LCP-safe)
   reveal="scroll" IntersectionObserver, once
   reveal="none"   static
   Reduced motion: travel + blur collapse to 0 → a 150ms fade. */
type HeadlineSize = "display-2xl" | "display-xl" | "display-lg" | "display-md" | "heading-lg" | "heading-md";

const headlineSize: Record<HeadlineSize, string> = {
  "display-2xl": "text-display-2xl",
  "display-xl": "text-display-xl",
  "display-lg": "text-display-lg",
  "display-md": "text-display-md",
  "heading-lg": "text-heading-lg",
  "heading-md": "text-heading-md",
};

export function Headline({
  as: Tag = "h2",
  size = "display-lg",
  lines,
  reveal = "scroll",
  className,
  id,
}: {
  /** "p" for display-size statements that are not headings (keeps the outline honest). */
  as?: "h1" | "h2" | "h3" | "p";
  size?: HeadlineSize;
  lines: ReactNode[];
  reveal?: "load" | "scroll" | "none";
  className?: string;
  id?: string;
}) {
  const [ref, inView] = useInView<HTMLHeadingElement>();
  const animated = reveal !== "none";
  return (
    <Tag
      ref={reveal === "scroll" ? ref : undefined}
      id={id}
      data-reveal={reveal}
      data-inview={reveal === "scroll" ? inView : undefined}
      className={cn("font-display text-fg", headlineSize[size], className)}
    >
      {lines.map((line, i) =>
        animated ? (
          <span key={i} className="reveal-line">
            <span style={{ ["--i" as string]: i }}>{line}</span>
            {i < lines.length - 1 && " "}
          </span>
        ) : (
          <span key={i} className="block">
            {line}
            {i < lines.length - 1 && " "}
          </span>
        ),
      )}
    </Tag>
  );
}

