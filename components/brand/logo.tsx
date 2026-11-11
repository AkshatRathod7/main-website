"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";
import { LOGO_BRONZE, LOGO_GOLD, LOGO_LETTERS, LOGO_VIEWBOX } from "./logo-paths";

/**
 * The DreamSVin logo as a vector: nine letter paths (Poppins SemiBold, set on the brand-book wordmark's
 * spacing), so it is crisp at any size and each letter can move on its own.
 *
 * Motion (styles/living.css, .lg):
 *   - intro:   letters rise and draw in, one after another
 *   - SV:      the two capitals carry a bronze → gold glint that never stops travelling, and a spark
 *              twinkles off the V every few seconds
 *   - sweep:   a light crosses the whole word every 7s
 *   - hover:   a wave runs through the letters, SV jumps highest
 * The gradients are SVG <animate>, so the same file works as a static asset (see public/brand/*.svg).
 *
 * tone: "brand" (gold + bronze SV), "ink" (charcoal), "cream" (for dark grounds), "current" (currentColor),
 *       "ember" (dark grounds: gold melting into coral, SV in warm cream with the glint; the footer sign-off).
 */
export function Logo({
  height = 20,
  tone = "brand",
  live = true,
  className,
  label = "DreamSVin",
}: {
  height?: number;
  tone?: "brand" | "ink" | "cream" | "current" | "ember";
  live?: boolean;
  className?: string;
  label?: string;
}) {
  const id = useId().replace(/:/g, "");
  const ember = tone === "ember";
  const glinting = tone === "brand" || ember;
  const main = ember ? `url(#${id}-em)` : tone === "brand" ? LOGO_GOLD : tone === "ink" ? "#25282D" : tone === "cream" ? "#F7F4EE" : "currentColor";
  const sv = ember ? "#F4DDBB" : tone === "brand" ? LOGO_BRONZE : main;
  const width = Math.round((height * 698) / 91);

  return (
    <svg
      viewBox={LOGO_VIEWBOX}
      width={width}
      height={height}
      role="img"
      aria-label={label}
      className={cn("lg", live && "lg-live", className)}
      data-tone={tone}
      overflow="visible"
    >
      <defs>
        {ember && (
          <linearGradient id={`${id}-em`} gradientUnits="userSpaceOnUse" x1="0" y1="-2" x2="0" y2="89">
            <stop offset="0" stopColor="#F2C27E" />
            <stop offset="0.55" stopColor="#EC8A55" />
            <stop offset="1" stopColor="#D9472B" />
          </linearGradient>
        )}
        {/* SV glint: a gold band that travels back and forth through the bronze */}
        <linearGradient id={`${id}-sv`} gradientUnits="userSpaceOnUse" x1="360" y1="0" x2="660" y2="0">
          <stop offset="0" stopColor={sv} />
          <stop offset="0.38" stopColor={sv} />
          <stop offset="0.5" stopColor={ember ? "#FFFFFF" : tone === "brand" ? "#FFE3A6" : sv} />
          <stop offset="0.62" stopColor={sv} />
          <stop offset="1" stopColor={sv} />
          {live && glinting && (
            <animateTransform attributeName="gradientTransform" type="translate" values="-240 0;240 0;-240 0" dur="3.4s" repeatCount="indefinite" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1" keyTimes="0;.5;1" />
          )}
        </linearGradient>
        {/* The light that crosses the whole word */}
        <linearGradient id={`${id}-sw`} gradientUnits="userSpaceOnUse" x1="-220" y1="0" x2="0" y2="0">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity="0" />
          <stop offset="0.5" stopColor="#FFFBEF" stopOpacity={tone === "ink" ? 0.3 : ember || tone === "cream" ? 0.7 : 0.42} />
          <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
          {live && (
            <animateTransform attributeName="gradientTransform" type="translate" values="0 0;0 0;940 0;940 0" keyTimes="0;.62;.86;1" dur="7s" begin="0.9s" repeatCount="indefinite" />
          )}
        </linearGradient>
      </defs>

      {LOGO_LETTERS.map((l, i) => {
        const isSV = i === 5 || i === 6;
        return (
          <g key={i} className={cn("lg-l", isSV && "lg-sv")} style={{ ["--i" as string]: i }}>
            <path d={l.d} fill={isSV ? `url(#${id}-sv)` : main} className="lg-f" pathLength={1} stroke={isSV ? sv : main} />
            {live && <path d={l.d} fill={`url(#${id}-sw)`} className="lg-shine" aria-hidden="true" />}
          </g>
        );
      })}

      {/* Spark off the top of the V */}
      {live && glinting && (
        <path
          className="lg-spark"
          d="M583.5 -6 C584.4 -0.6 585 0 590.5 1 C585 2 584.4 2.6 583.5 8 C582.6 2.6 582 2 576.5 1 C582 0 582.6 -0.6 583.5 -6Z"
          fill="#FFE3A6"
        />
      )}
    </svg>
  );
}
