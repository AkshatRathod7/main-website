import Link from "next/link";
import type { ComponentProps, ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "./icons";

/* ───────────────────────── Accent (serif italic) ─────────────────────────
   ONE or two words per section. Never a whole line. Never in body copy. */
export function Accent({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("accent-serif", className)}>{children}</span>;
}

/* ───────────────────────── Eyebrow ─────────────────────────
   Mono label above a headline. Optional index ("01") renders in accent-text,
   joined by a 24px hairline: 01 ── APPROACH */
export function Eyebrow({
  index,
  children,
  className,
  as: Tag = "p",
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  return (
    <Tag className={cn("flex items-center gap-3 text-body font-semibold tracking-[-0.01em] text-accent-text", className)}>
      {index && (
        <>
          <span className="text-accent-text">{index}</span>
          <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
        </>
      )}
      <span>{children}</span>
    </Tag>
  );
}

/* ───────────────────────── Lede / body ───────────────────────── */
export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("max-w-measure text-body-lg text-fg-muted", className)}>{children}</p>;
}

/* ───────────────────────── TextLink ─────────────────────────
   Inline link inside prose. Underline sits at 0.22em, line-strong → accent on hover.
   States: hover · active · focus-visible · visited (unchanged, deliberate) · external (↗ + new tab). */
type TextLinkProps = Omit<ComponentProps<typeof Link>, "className"> & {
  external?: boolean;
  className?: string;
  tone?: "default" | "muted";
};

export function TextLink({ external, className, tone = "default", children, ...rest }: TextLinkProps) {
  return (
    <Link
      {...rest}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "inline-flex items-baseline gap-0.5 rounded-xs underline decoration-line-strong decoration-1 underline-offset-[0.22em]",
        "transition-[color,text-decoration-color] duration-base ease-out",
        "hover:decoration-accent active:text-accent-press",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus",
        tone === "default" ? "text-fg hover:text-fg-emphasis" : "text-fg-muted hover:text-fg",
        className,
      )}
    >
      {children}
      {external && (
        <>
          <ArrowUpRight size={14} className="translate-y-[1px] self-center" />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      )}
    </Link>
  );
}
