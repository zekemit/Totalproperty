import "server-only";
import { upstashCredentials } from "@/lib/cms-storage";
import { createRateLimiter } from "@/lib/forms/security";

/**
 * Brake on password guessing: 8 attempts per 15 minutes per IP, plus a global ceiling.
 * With Upstash connected the counter is shared by every serverless instance; without it the
 * limiter falls back to per-instance memory (best effort, same caveat as the public forms).
 */
const LIMIT = 8;
const WINDOW_SECONDS = 15 * 60;
const perIp = createRateLimiter({ limit: LIMIT, windowMs: WINDOW_SECONDS * 1000 });
const global = createRateLimiter({ limit: LIMIT * 8, windowMs: WINDOW_SECONDS * 1000 });

type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

async function sharedCount(key: string, env: Record<string, string | undefined>, fetchImpl: FetchLike): Promise<number | null> {
  const creds = upstashCredentials(env);
  if (!creds) return null;
  try {
    const res = await fetchImpl(`${creds.url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
      body: JSON.stringify([["INCR", key], ["EXPIRE", key, WINDOW_SECONDS, "NX"]]),
      cache: "no-store",
      signal: AbortSignal.timeout(4_000),
    });
    if (!res.ok) return null;
    const out = (await res.json()) as { result?: unknown }[];
    const n = out[0]?.result;
    return typeof n === "number" ? n : null;
  } catch {
    return null;
  }
}

export async function checkLoginRate(
  ip: string,
  env: Record<string, string | undefined> = process.env,
  fetchImpl: FetchLike = fetch,
): Promise<{ ok: boolean }> {
  const g = global.check("all");
  const local = perIp.check(ip);
  const shared = await sharedCount(`tpm:admin-login:${ip}`, env, fetchImpl);
  const ok = g.ok && local.ok && (shared === null || shared <= LIMIT);
  return { ok };
}
