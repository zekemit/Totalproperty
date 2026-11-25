import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

/**
 * Single-password admin login for one non-technical editor.
 *
 *  - ADMIN_PASSWORD (min. 12 characters) is the only required setting.
 *  - The password is compared in constant time (both sides hashed to equal-length digests first,
 *    so neither the content nor the length of the guess leaks through timing).
 *  - A successful login sets a signed, HttpOnly, SameSite=Lax session cookie (Secure in production).
 *    The token is `payload.hmac`; the HMAC key is ADMIN_SESSION_SECRET if set, else derived from the
 *    password, so changing the password signs everyone out.
 */

export const SESSION_COOKIE = "tpm_admin";
export const SESSION_SECONDS = 7 * 24 * 60 * 60;
export const MIN_PASSWORD_LENGTH = 12;

type Env = Record<string, string | undefined>;
export type AdminStatus = "ready" | "missing" | "weak";

export function adminStatus(env: Env = process.env): AdminStatus {
  const pw = env.ADMIN_PASSWORD ?? "";
  if (pw.trim() === "") return "missing";
  return pw.length >= MIN_PASSWORD_LENGTH ? "ready" : "weak";
}

const digest = (value: string) => createHash("sha256").update(value, "utf8").digest();

export function passwordMatches(input: string, env: Env = process.env): boolean {
  if (adminStatus(env) !== "ready") return false;
  return timingSafeEqual(digest(input), digest(env.ADMIN_PASSWORD as string));
}

function signingKey(env: Env): string {
  const explicit = env.ADMIN_SESSION_SECRET?.trim();
  if (explicit && explicit.length >= 16) return explicit;
  return createHmac("sha256", env.ADMIN_PASSWORD ?? "").update("tpm-admin-session-key-v1").digest("hex");
}

const b64 = (buf: Buffer | string) => Buffer.from(buf).toString("base64url");

export function createSessionToken(env: Env = process.env, now = Date.now()): string {
  const payload = b64(JSON.stringify({ v: 1, iat: now, exp: now + SESSION_SECONDS * 1000, n: randomBytes(8).toString("hex") }));
  const mac = createHmac("sha256", signingKey(env)).update(payload).digest();
  return `${payload}.${b64(mac)}`;
}

export function verifySessionToken(token: string | undefined, env: Env = process.env, now = Date.now()): boolean {
  if (!token || adminStatus(env) !== "ready") return false;
  const [payload, mac, extra] = token.split(".");
  if (!payload || !mac || extra !== undefined) return false;
  const expected = createHmac("sha256", signingKey(env)).update(payload).digest();
  let given: Buffer;
  try {
    given = Buffer.from(mac, "base64url");
  } catch {
    return false;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { v?: number; exp?: number };
    return data.v === 1 && typeof data.exp === "number" && data.exp > now;
  } catch {
    return false;
  }
}

/** True when the current request carries a valid admin session. Opts the caller into dynamic rendering. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}

/** Same-origin check for state-changing requests (CSRF defence in depth on top of SameSite=Lax). */
export function isSameOrigin(headers: Pick<Headers, "get">): boolean {
  const origin = headers.get("origin");
  const host = headers.get("x-forwarded-host") ?? headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const LOCAL = /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/;

export function sessionCookie(value: string, host: string | null, env: Env = process.env) {
  return {
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax" as const,
    // Secure everywhere except plain-http localhost, where browsers would otherwise drop it in dev/tests.
    secure: env.NODE_ENV === "production" && !(host && LOCAL.test(host)),
    path: "/",
    maxAge: SESSION_SECONDS,
  };
}
