"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Alert, ArrowRight, Check, Spinner } from "./icons";

/**
 * Button — three ranks only.
 *  primary   charcoal pill (cream on dark). ONE per viewport. Coral is kept for signals, not surfaces.
 *  secondary hairline (line-control, 3.9:1 boundary). Equal-weight alternative.
 *  tertiary  text + arrow. Inline "read more" / low-stakes actions.
 *
 * States: hover · active (press-scale 0.98) · focus-visible (2px ring, offset 3) ·
 *         disabled · loading (spinner, width locked, aria-busy) · success · error.
 * Hit area ≥ 44px on every size.
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "md" | "lg";
export type ButtonStatus = "idle" | "loading" | "success" | "error";

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap font-sans font-medium " +
  "text-body-sm tracking-[-0.005em] rounded-full " +
  "transition-[background-color,border-color,color,transform] duration-base ease-out " +
  "active:scale-[0.98] active:duration-instant motion-reduce:active:scale-100 " +
  "disabled:pointer-events-none aria-disabled:pointer-events-none aria-busy:pointer-events-none aria-busy:cursor-progress " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-focus";

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5",
  lg: "h-14 px-7 text-body",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-btn text-on-btn hover:bg-btn-hover " +
    "disabled:bg-bg-overlay disabled:text-fg-faint aria-disabled:bg-bg-overlay aria-disabled:text-fg-faint",
  secondary:
    "border border-line-strong bg-bg-elevated/60 text-fg backdrop-blur-sm hover:border-fg-subtle hover:bg-bg-elevated " +
    "disabled:border-line disabled:text-fg-faint aria-disabled:border-line aria-disabled:text-fg-faint",
  tertiary:
    "h-11 px-0 rounded-sm text-fg hover:text-accent-text active:text-accent-press " +
    "disabled:text-fg-faint aria-disabled:text-fg-faint",
};

const statusTone: Record<ButtonVariant, Partial<Record<ButtonStatus, string>>> = {
  primary: {},
  secondary: { success: "border-success text-success", error: "border-danger text-danger" },
  tertiary: { success: "text-success", error: "text-danger" },
};

type Shared = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  status?: ButtonStatus;
  /** Label shown in the success / error state (defaults to children). */
  statusLabel?: ReactNode;
  /** Trailing arrow; default on for tertiary. */
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

function Inner({ status = "idle", statusLabel, arrow, children }: Pick<Shared, "status" | "statusLabel" | "arrow" | "children">) {
  if (status === "loading") {
    return (
      <>
        {/* Keep the label in the flow so width never jumps. */}
        <span className="invisible inline-flex items-center gap-2">
          {children}
          {arrow && <ArrowRight />}
        </span>
        <span className="absolute inset-0 inline-flex items-center justify-center">
          <Spinner />
        </span>
      </>
    );
  }
  if (status === "success" || status === "error") {
    return (
      <>
        {status === "success" ? <Check /> : <Alert />}
        <span>{statusLabel ?? children}</span>
      </>
    );
  }
  return (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight className="transition-transform duration-base ease-out group-hover/btn:translate-x-0.5 motion-reduce:transition-none" />
      )}
    </>
  );
}

export type ButtonProps = Shared & Omit<ComponentProps<"button">, "children" | "className">;

export function Button({
  variant = "primary",
  size = "md",
  status = "idle",
  statusLabel,
  arrow,
  className,
  children,
  disabled,
  type = "button",
  onClick,
  ...rest
}: ButtonProps) {
  const showArrow = arrow ?? variant === "tertiary";
  return (
    <button
      type={type}
      disabled={disabled}
      aria-busy={status === "loading" || undefined}
      data-status={status}
      className={cn(base, sizes[size], variants[variant], statusTone[variant][status], className)}
      onClick={(e) => {
        if (status === "loading") {
          e.preventDefault();
          return;
        }
        onClick?.(e);
      }}
      {...rest}
    >
      <Inner status={status} statusLabel={statusLabel} arrow={showArrow}>
        {children}
      </Inner>
      {/* Announce async state changes to screen readers. */}
      <span className="sr-only" aria-live="polite">
        {status === "loading" ? "Working" : status === "success" ? "Done" : status === "error" ? "Something went wrong" : ""}
      </span>
    </button>
  );
}

export type ButtonLinkProps = Shared &
  Omit<ComponentProps<typeof Link>, "children" | "className"> & { external?: boolean };

/** Same visuals as Button, rendered as a link. Use for navigation; Button for actions. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  external,
  ...rest
}: ButtonLinkProps) {
  const showArrow = arrow ?? variant === "tertiary";
  return (
    <Link
      className={cn(base, sizes[size], variants[variant], className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      <Inner arrow={showArrow}>{children}</Inner>
    </Link>
  );
}
