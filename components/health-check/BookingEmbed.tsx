"use client";

/**
 * Cal.com inline embed, pre-filled with the lead's name, email and a notes
 * summary of their scores. Loaded lazily (only after "Choose a time") so the
 * results page stays fast.
 *
 * npm i @calcom/embed-react
 */
import { useEffect } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { CAL_LINK, CAL_ORIGIN } from "@/lib/health-check/booking";

export default function BookingEmbed({ prefill }: { prefill: Record<string, string> }) {
  useEffect(() => {
    (async () => {
      const cal = await getCalApi({ namespace: "health-check" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: { dark: { "cal-brand": "#C8A96A" }, light: { "cal-brand": "#0A0A0B" } },
        hideEventTypeDetails: false,
        layout: "month_view",
      });
    })();
  }, []);

  return (
    <Cal
      namespace="health-check"
      calLink={CAL_LINK}
      calOrigin={CAL_ORIGIN}
      config={{ ...prefill, theme: "dark", layout: "month_view" }}
      style={{ width: "100%", height: "100%", minHeight: 640, overflow: "auto" }}
    />
  );
}
