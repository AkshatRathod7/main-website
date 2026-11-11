/**
 * One analytics surface for the whole site (Stage 10).
 * Before the merge there were four: Stage 04 Plausible CSS classes, Stage 05/06 data-event attributes
 * with no listener, Stage 07 track(), Stage 09 track(). All named events now go through track(), and
 * any element with data-event="Name" is tracked on click by <Analytics /> in the root layout.
 * Sends to Plausible and/or Vercel Analytics when present. Never sends personal data.
 */
export type EventProps = Record<string, string | number | boolean>;

declare global {
  interface Window {
    plausible?: ((event: string, options?: { props?: EventProps }) => void) & { q?: unknown[] };
    va?: (event: "event", payload: { name: string; data?: EventProps }) => void;
    __events?: { name: string; props?: EventProps; at: number }[];
  }
}

export function track(name: string, props?: EventProps) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(name, props ? { props } : undefined);
    window.va?.("event", { name, data: props });
    if (process.env.NODE_ENV !== "production") (window.__events ??= []).push({ name, props, at: Date.now() });
  } catch {
    /* analytics must never break the page */
  }
}
