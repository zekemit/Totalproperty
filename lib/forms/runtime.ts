import "server-only";
import { isIP } from "node:net";
import { getAdminClient } from "@/lib/supabase/admin";
import { createMailerFromEnv } from "./mailer";
import type { PipelineDeps } from "./pipeline";
import { createRateLimiter } from "./security";
import { createSupabaseStore } from "./store";

/** Best-effort per-instance limiter shared by every form: 5 submissions / 10 min / IP. */
const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60_000 });

/** Compose the real dependencies from environment variables (server-only). */
export function getPipelineDeps(env: Record<string, string | undefined> = process.env): PipelineDeps {
  const admin = getAdminClient();
  const email = createMailerFromEnv(env);
  return {
    store: admin ? createSupabaseStore(admin) : null,
    mailer: email?.mailer ?? null,
    notifyTo: email?.to ?? [],
    limiter,
    turnstileSecret: env.TURNSTILE_SECRET_KEY?.trim() || undefined,
    ipHashSecret: env.IP_HASH_SECRET?.trim() || undefined,
    now: Date.now,
    isProduction: env.NODE_ENV === "production",
  };
}

/**
 * Client IP from proxy headers. On Vercel `x-forwarded-for` is set by the platform.
 * Anything that isn't a syntactically valid IP is discarded so a spoofed header can't
 * smuggle arbitrary text into rate-limit keys or logs.
 */
export function clientIp(headers: Pick<Headers, "get">): string {
  const candidates = [headers.get("x-forwarded-for")?.split(",")[0]?.trim(), headers.get("x-real-ip")?.trim()];
  for (const c of candidates) if (c && isIP(c) !== 0) return c;
  return "unknown";
}
