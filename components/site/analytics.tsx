"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Loads Plausible when NEXT_PUBLIC_PLAUSIBLE_DOMAIN is set (privacy notice: cookieless) and tracks any
 * element carrying data-event="Event Name" on click. Delegated: one listener for the whole site.
 */
export function Analytics() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-event]");
      if (el?.dataset.event) track(el.dataset.event);
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  return (
    <>
      <Script defer data-domain={domain} src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      <Script id="plausible-queue" strategy="afterInteractive">
        {"window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }"}
      </Script>
    </>
  );
}
