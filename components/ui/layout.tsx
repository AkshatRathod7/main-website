import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

/* ───────────────────────── Section ─────────────────────────
   tone    canvas (default) · raised (surface-1) · paper (ivory editorial — max 2 per page)
   space   sm · md · lg  → fluid section padding tokens (64–128 / 96–176 / 120–240)
   Every section gets an accessible name via `labelledBy` (id of its headline). */
type Tone = "canvas" | "raised" | "paper" | "ink";
type Space = "sm" | "md" | "lg" | "none";

const toneClass: Record<Tone, string> = {
  canvas: "bg-bg text-fg",
  raised: "bg-bg-raised text-fg",
  paper: "bg-bg text-fg", // data-tone swaps the variables
  ink: "bg-bg text-fg",
};
const spaceClass: Record<Space, string> = {
  none: "",
  sm: "py-section-sm",
  md: "py-section",
  lg: "py-section-lg",
};

export function Section({
  as: Tag = "section",
  tone = "canvas",
  space = "md",
  divider = false,
  labelledBy,
  id,
  className,
  containerClassName,
  bleed = false,
  children,
}: {
  as?: ElementType;
  tone?: Tone;
  space?: Space;
  /** Hairline at the top edge — use between two same-tone sections. */
  divider?: boolean;
  labelledBy?: string;
  id?: string;
  className?: string;
  containerClassName?: string;
  /** Skip the container (full-bleed moments). */
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      data-tone={tone === "paper" || tone === "ink" ? tone : undefined}
      className={cn("relative", toneClass[tone], spaceClass[space], divider && "hairline-t", className)}
    >
      {bleed ? children : <div className={cn("container-ds", containerClassName)}>{children}</div>}
    </Tag>
  );
}

/** 12-col grid with fluid gutters. Compose asymmetry with col-span utilities. */
export function Grid({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("grid grid-cols-4 gap-x-4 gap-y-12 md:grid-cols-12 md:gap-x-6", className)}>{children}</div>;
}

/* ───────────────────────── Divider (hairline) ─────────────────────────
   1px, `line` token. Decorative by default; pass `semantic` when it separates content groups.
   Optional mono label sits on the line's left: SYSTEMS ─────────── */
export function Divider({
  label,
  orientation = "horizontal",
  strong = false,
  semantic = false,
  className,
}: {
  label?: string;
  orientation?: "horizontal" | "vertical";
  strong?: boolean;
  semantic?: boolean;
  className?: string;
}) {
  const color = strong ? "bg-line-strong" : "bg-line";
  const a11y = semantic
    ? { role: "separator" as const, "aria-orientation": orientation }
    : { "aria-hidden": true as const };

  if (orientation === "vertical") {
    return <span {...a11y} className={cn("inline-block w-px self-stretch", color, className)} />;
  }
  if (label) {
    return (
      <div {...a11y} className={cn("flex items-center gap-4", className)}>
        <span className="label-mono shrink-0 text-fg-subtle">{label}</span>
        <span className={cn("h-px flex-1", color)} />
      </div>
    );
  }
  return <div {...a11y} className={cn("h-px w-full", color, className)} />;
}

/* ───────────────────────── TODO-PROOF placeholder ─────────────────────────
   Honesty rule made visible. Never ship to production with one on the page —
   `grep -r TODO-PROOF` is part of the launch checklist. */
export function ProofTodo({ need, className }: { need: string; className?: string }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center gap-2 rounded-sm border border-dashed border-line-control px-2 py-1 normal-case tracking-[0.04em] text-accent-text",
        className,
      )}
    >
      [TODO-PROOF: {need}]
    </span>
  );
}
