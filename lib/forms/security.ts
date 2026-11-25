import "server-only";
import { createHmac } from "node:crypto";

export { cleanText } from "./text";

/* ───────────────────────────── Rate limiting ───────────────────────────── */

export type RateLimitResult = { ok: boolean; retryAfterMs: number };

export type RateLimiter = {
  check(key: string): RateLimitResult;
  size(): number;
};

type Options = { limit: number; windowMs: number; now?: () => number; maxKeys?: number };

/**
 * Fixed-window in-memory limiter.
 *
 * Honest limitation: on serverless platforms each instance has its own memory, so
 * this is a best-effort brake, not a global guarantee. It is paired with a
 * honeypot, a minimum-fill-time check and (when configured) Cloudflare Turnstile,
 * and the README recommends adding a Vercel Firewall rate-limit rule for
 * `POST` requests as the authoritative control.
 */
export function createRateLimiter({ limit, windowMs, now = Date.now, maxKeys = 5_000 }: Options): RateLimiter {
  const hits = new Map<string, { count: number; resetAt: number }>();

  function evict(t: number): void {
    if (hits.size <= maxKeys) return;
    for (const [key, entry] of hits) if (entry.resetAt <= t) hits.delete(key);
    // Still too large (a flood of distinct live keys): drop oldest first.
    for (const key of hits.keys()) {
      if (hits.size <= maxKeys) break;
      hits.delete(key);
    }
  }

  return {
    check(key) {
      const t = now();
      const entry = hits.get(key);
      if (!entry || entry.resetAt <= t) {
        hits.set(key, { count: 1, resetAt: t + windowMs });
        evict(t);
        return { ok: true, retryAfterMs: 0 };
      }
      entry.count += 1;
      if (entry.count > limit) return { ok: false, retryAfterMs: entry.resetAt - t };
      return { ok: true, retryAfterMs: 0 };
    },
    size: () => hits.size,
  };
}

/* ───────────────────────────── IP hashing ───────────────────────────── */

/** Keyed hash so abuse can be correlated without storing raw IP addresses. */
export function hashIp(ip: string, secret: string): string {
  return createHmac("sha256", secret).update(ip).digest("hex");
}

/* ───────────────────────────── Turnstile ───────────────────────────── */

export type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

/** Verify a Cloudflare Turnstile token. Fails closed on any error. */
export async function verifyTurnstile(
  token: string,
  secret: string,
  ip?: string,
  fetchImpl: FetchLike = fetch,
): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetchImpl(TURNSTILE_URL, { method: "POST", body, signal: AbortSignal.timeout(5_000) });
    if (!res.ok) return false;
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch {
    return false;
  }
}
