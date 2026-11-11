"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState } from "react";
import { track } from "@/lib/site";

/**
 * Inline Cal.com booking, themed to Dark Precision.
 * Lazy: the embed script only loads once the frame nears the viewport,
 * so it never competes with LCP.
 */
export function CalBooking({ calLink }: { calLink: string }) {
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = document.getElementById("book");
    if (!el) return setNear(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setNear(true), io.disconnect()), {
      rootMargin: "400px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near || !calLink) return;
    (async () => {
      const cal = await getCalApi({ namespace: "diagnostic" });
      cal("ui", {
        theme: "dark",
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#C8A96A", "cal-bg": "#0E0E0F", "cal-bg-emphasis": "#1C1C1F", "cal-border": "#232326", "cal-text": "#F2EFE8" },
          light: { "cal-brand": "#8A6D33" },
        },
      });
      cal("on", { action: "linkReady", callback: () => setReady(true) });
      cal("on", { action: "bookingSuccessful", callback: () => track("Cal Booking Completed") });
      track("Cal Booking Opened");
    })();
  }, [near, calLink]);

  return (
    <div className="relative min-h-[640px] overflow-hidden rounded-xl border border-hairline bg-surface-1">
      {!ready && (
        <div aria-hidden className="absolute inset-0 grid grid-cols-7 content-center gap-2 p-10 opacity-60">
          {Array.from({ length: 35 }).map((_, i) => (
            <span key={i} className="cal-skel aspect-square rounded-sm bg-surface-2" style={{ animationDelay: `${(i % 7) * 60}ms` }} />
          ))}
        </div>
      )}
      {near && calLink && (
        <Cal
          namespace="diagnostic"
          calLink={calLink}
          style={{ width: "100%", height: "100%", minHeight: 640, overflow: "scroll" }}
          config={{ layout: "month_view", theme: "dark" }}
        />
      )}
    </div>
  );
}
