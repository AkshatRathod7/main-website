"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-12 select-none items-center justify-center gap-2 rounded-full px-6 text-body-sm font-medium tracking-[-0.005em] " +
  "transition-[background-color,color,border-color,scale,opacity] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40";

const variants: Record<Variant, string> = {
  primary: "bg-btn text-on-btn hover:bg-btn-hover",
  secondary: "border border-hairline-strong text-ivory hover:border-faint hover:bg-surface-1",
  ghost: "px-3 text-muted hover:text-ivory",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; loading?: boolean; children: ReactNode }
>(function Button({ variant = "primary", loading, className = "", children, disabled, ...rest }, ref) {
  return (
    <button
      ref={ref}
      className={`${base} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && (
        <svg aria-hidden viewBox="0 0 16 16" className="hc-spinner h-4 w-4">
          <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeOpacity=".25" strokeWidth="1.5" />
          <path d="M14.5 8A6.5 6.5 0 0 0 8 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}
      {children}
    </button>
  );
});

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd className="inline-grid min-w-[22px] place-items-center rounded-[3px] border border-hairline-strong px-1 font-mono text-[10.5px] leading-[20px] text-muted">
      {children}
    </kbd>
  );
}

export const Arrow = ({ dir = "right" }: { dir?: "right" | "left" }) => (
  <svg aria-hidden viewBox="0 0 16 16" className={`h-4 w-4 ${dir === "left" ? "rotate-180" : ""}`}>
    <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
