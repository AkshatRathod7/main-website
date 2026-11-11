/**
 * Stage 09 primitives, re-pointed at the locked Stage 03 components at Stage 10
 * (Stage 09 was built without the repo and shipped its own Button, Container and Eyebrow).
 * The names stay so the Stage 09 pages read the same; the visuals are now the system's.
 */
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button as UiButton, ButtonLink as UiButtonLink, type ButtonVariant } from "@/components/ui/button";
import { ProofTodo } from "@/components/ui/layout";
import { Eyebrow as UiEyebrow } from "@/components/ui/typography";

/** Same measure and gutter as every other page (container-ds: 1360 + fluid gutter). */
export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={cn("container-ds", className)}>{children}</div>;
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <UiEyebrow className={className}>{children}</UiEyebrow>;
}

/** Visible honesty marker. `npm run check:todos` lists every one before launch. */
export function Todo({ children }: { children: ReactNode }) {
  return <ProofTodo need={typeof children === "string" ? children : String(children)} />;
}

export function ButtonLink({
  variant = "primary",
  arrow,
  ...props
}: Omit<ComponentProps<typeof UiButtonLink>, "variant"> & { variant?: ButtonVariant }) {
  return <UiButtonLink variant={variant} arrow={arrow} {...props} />;
}

export function Button({
  variant = "primary",
  ...props
}: Omit<ComponentProps<typeof UiButton>, "variant"> & { variant?: ButtonVariant }) {
  return <UiButton variant={variant} {...props} />;
}

export function Hairline({ className = "" }: { className?: string }) {
  return <hr className={cn("h-px border-0 bg-line", className)} />;
}
