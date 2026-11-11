"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Alert, Check, Close } from "./icons";

/**
 * Toast — confirmations after an action, never marketing.
 * tone: neutral · success · error. Error uses role="alert" (assertive); others role="status".
 * Enter: 12px rise + fade, 250ms ease-out. Exit: fade + 4px, 150ms ease-in.
 * Auto-dismiss 5s (errors 8s); paused on hover / focus. Max 3 stacked. Bottom-right; full-width on mobile.
 */
type Tone = "neutral" | "success" | "error";
type ToastInput = { title: string; description?: string; tone?: Tone; duration?: number };
type ToastItem = Required<Omit<ToastInput, "description">> & { id: number; description?: string; leaving: boolean };

const Ctx = createContext<((t: ToastInput) => void) | null>(null);

export function useToast() {
  const fn = useContext(Ctx);
  if (!fn) throw new Error("useToast must be used inside <ToastProvider>");
  return fn;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);

  const dismiss = useCallback((id: number) => {
    setItems((xs) => xs.map((x) => (x.id === id ? { ...x, leaving: true } : x)));
    window.setTimeout(() => setItems((xs) => xs.filter((x) => x.id !== id)), 160);
  }, []);

  const push = useCallback((t: ToastInput) => {
    const tone = t.tone ?? "neutral";
    const item: ToastItem = {
      id: nextId.current++,
      title: t.title,
      description: t.description,
      tone,
      duration: t.duration ?? (tone === "error" ? 8000 : 5000),
      leaving: false,
    };
    setItems((xs) => [...xs.slice(-2), item]);
  }, []);

  const value = useMemo(() => push, [push]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <section aria-label="Notifications" className="pointer-events-none fixed inset-x-0 bottom-0 z-toast sm:inset-x-auto sm:right-0">
        <ol className="flex flex-col items-stretch gap-2 p-4 sm:w-[400px] sm:p-6">
          {items.map((t) => (
            <ToastRow key={t.id} item={t} onDismiss={dismiss} />
          ))}
        </ol>
      </section>
    </Ctx.Provider>
  );
}

function ToastRow({ item, onDismiss }: { item: ToastItem; onDismiss: (id: number) => void }) {
  const [entered, setEntered] = useState(false);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(item.duration);
  const startedAt = useRef(0);

  useEffect(() => {
    const r = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    if (paused || item.leaving) return;
    startedAt.current = Date.now();
    const t = window.setTimeout(() => onDismiss(item.id), remaining.current);
    return () => {
      window.clearTimeout(t);
      remaining.current -= Date.now() - startedAt.current;
    };
  }, [paused, item.leaving, item.id, onDismiss]);

  const visible = entered && !item.leaving;

  return (
    <li
      role={item.tone === "error" ? "alert" : "status"}
      aria-atomic="true"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        "pointer-events-auto relative flex items-start gap-3 rounded-lg border border-line-strong bg-bg-elevated py-4 pl-4 pr-12 shadow-e2",
        "transition-[opacity,transform]",
        visible
          ? "translate-y-0 opacity-100 duration-moderate ease-out"
          : item.leaving
            ? "translate-y-1 opacity-0 duration-fast ease-in"
            : "translate-y-3 opacity-0",
        "motion-reduce:translate-y-0",
      )}
    >
      {item.tone !== "neutral" && (
        <span className={cn("mt-0.5 shrink-0", item.tone === "success" ? "text-success" : "text-danger")}>
          {item.tone === "success" ? <Check size={18} /> : <Alert size={18} />}
        </span>
      )}
      <div className="flex flex-col gap-1">
        <p className="text-body-sm font-medium text-fg">{item.title}</p>
        {item.description && <p className="text-body-sm text-fg-muted">{item.description}</p>}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(item.id)}
        aria-label="Dismiss notification"
        className="absolute right-1 top-1 grid size-11 place-items-center rounded-md text-fg-subtle transition-colors duration-fast hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-focus"
      >
        <Close size={16} />
      </button>
    </li>
  );
}
