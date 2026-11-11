"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/cn";

/** Email as selectable text + a copy button. mailto is a convenience; copy always works. */
export function CopyEmail({ email, className }: { email: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "select">("idle");
  const text = useRef<HTMLAnchorElement>(null);
  const timer = useRef<number | undefined>(undefined);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setState("copied");
    } catch {
      const r = document.createRange();
      if (text.current) r.selectNodeContents(text.current);
      const s = getSelection();
      s?.removeAllRanges();
      s?.addRange(r);
      setState("select");
    }
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setState("idle"), 1800);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <a
        ref={text}
        href={`mailto:${email}`}
        data-event="Footer Email"
        className="inline-flex min-h-11 items-center break-all rounded-xs text-body-sm text-fg underline decoration-line-strong underline-offset-[0.22em] transition-[text-decoration-color] duration-base ease-out hover:decoration-accent"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-11 min-w-16 items-center justify-center rounded-md border border-line-control px-3 font-mono text-caption text-fg-muted transition-[color,border-color] duration-fast ease-out hover:border-fg-subtle hover:text-fg active:scale-[0.98] motion-reduce:active:scale-100"
      >
        <span aria-hidden="true">{state === "copied" ? "Copied" : state === "select" ? "Selected" : "Copy"}</span>
        <span className="sr-only">Copy email address</span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {state === "copied" ? "Email address copied" : state === "select" ? "Email address selected. Press Command or Control C to copy." : ""}
      </span>
    </div>
  );
}
