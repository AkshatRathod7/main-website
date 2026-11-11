/**
 * Named analytics events for the Health Check.
 *
 * Sends to Plausible when its script is present, and to Vercel Analytics when
 * `window.va` is present. No personal data is ever sent: no name, email,
 * company or phone. Only tiers, scores and coarse profile buckets.
 */
import { track as trackSite, type EventProps as Props } from "@/lib/analytics";

export const HC_EVENTS = {
  start: "Health Check: Start",
  pillarComplete: "Health Check: Pillar Complete",
  leadCaptured: "Health Check: Lead Captured",
  bookingClicked: "Health Check: Booking Clicked",
} as const;

export type HcEvent = (typeof HC_EVENTS)[keyof typeof HC_EVENTS];

export function track(name: HcEvent, props?: Props) {
  trackSite(name, props);
}
