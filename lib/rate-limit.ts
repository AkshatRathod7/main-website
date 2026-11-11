/**
 * Sliding-window rate limiter.
 *
 * - With UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN set, counts live in
 *   Redis and are shared across serverless instances (use this in production).
 * - Without them it falls back to per-instance memory: fine for dev and a
 *   reasonable first line on a single long-lived server.
 */
type Result = { ok: boolean; remaining: number; resetMs: number };

const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const LIMIT = 4; // submissions per window per key

const memory = new Map<string, number[]>();

async function upstash(key: string): Promise<Result | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const now = Date.now();
  const k = `rl:contact:${key}`;
  const res = await fetch(`${url}/multi-exec`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify([
      ["ZREMRANGEBYSCORE", k, "0", String(now - WINDOW_MS)],
      ["ZADD", k, String(now), `${now}-${Math.random().toString(36).slice(2, 8)}`],
      ["ZCARD", k],
      ["PEXPIRE", k, String(WINDOW_MS)],
    ]),
    cache: "no-store",
  });
  if (!res.ok) return null; // fail open to memory rather than block real people
  const data = (await res.json()) as { result: unknown }[];
  const count = Number(data[2]?.result ?? 0);
  return { ok: count <= LIMIT, remaining: Math.max(0, LIMIT - count), resetMs: WINDOW_MS };
}

function inMemory(key: string): Result {
  const now = Date.now();
  const hits = (memory.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  hits.push(now);
  memory.set(key, hits);
  if (memory.size > 5000) memory.delete(memory.keys().next().value as string); // bound memory
  return { ok: hits.length <= LIMIT, remaining: Math.max(0, LIMIT - hits.length), resetMs: WINDOW_MS - (now - hits[0]) };
}

export async function rateLimit(key: string): Promise<Result> {
  return (await upstash(key).catch(() => null)) ?? inMemory(key);
}
