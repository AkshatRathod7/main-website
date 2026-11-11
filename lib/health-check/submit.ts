import type { Answers, HealthResult } from "./scoring";
import type { Lead } from "./schema";

export type Delivery = "sent" | "skipped" | "failed";
export type SubmitResponse =
  | { ok: true; result: HealthResult; webhook: Delivery; email: Delivery }
  | { ok: false; error: string; retryable: boolean };

export type SubmitInput = {
  answers: Answers;
  lead: Lead;
  meta?: Record<string, unknown>;
  website?: string;
};

export async function submitHealthCheck(input: SubmitInput): Promise<SubmitResponse> {
  try {
    const res = await fetch("/api/health-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    const data = (await res.json().catch(() => null)) as SubmitResponse | null;
    if (res.ok && data?.ok) return data;
    const message = (data && !data.ok && data.error) || "We couldn’t reach our server.";
    // 4xx (except rate limit) means the input needs fixing; everything else is worth retrying.
    const retryable = res.status >= 500 || res.status === 429 || !data;
    return { ok: false, error: message, retryable };
  } catch {
    return { ok: false, error: "You appear to be offline.", retryable: true };
  }
}
