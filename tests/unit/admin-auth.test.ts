import { describe, expect, it, vi } from "vitest";
import { adminStatus, createSessionToken, isSameOrigin, passwordMatches, sessionCookie, verifySessionToken } from "@/lib/admin/auth";
import { checkLoginRate } from "@/lib/admin/login-limit";

const env = { ADMIN_PASSWORD: "a-long-enough-password" };

describe("admin password", () => {
  it("is ready only with a password of at least 12 characters", () => {
    expect(adminStatus({})).toBe("missing");
    expect(adminStatus({ ADMIN_PASSWORD: "   " })).toBe("missing");
    expect(adminStatus({ ADMIN_PASSWORD: "short" })).toBe("weak");
    expect(adminStatus(env)).toBe("ready");
  });
  it("matches exactly, and never when the admin isn't set up", () => {
    expect(passwordMatches("a-long-enough-password", env)).toBe(true);
    for (const wrong of ["", "a-long-enough-passwor", "a-long-enough-password ", "A-LONG-ENOUGH-PASSWORD", "x".repeat(5000)]) expect(passwordMatches(wrong, env)).toBe(false);
    expect(passwordMatches("", {})).toBe(false);
    expect(passwordMatches("short", { ADMIN_PASSWORD: "short" })).toBe(false);
  });
});

describe("session token", () => {
  const now = 1_800_000_000_000;
  it("verifies its own token and nothing else", () => {
    const t = createSessionToken(env, now);
    expect(verifySessionToken(t, env, now + 1000)).toBe(true);
    expect(verifySessionToken(undefined, env, now)).toBe(false);
    expect(verifySessionToken("", env, now)).toBe(false);
    expect(verifySessionToken("garbage", env, now)).toBe(false);
    expect(verifySessionToken(`${t}.extra`, env, now)).toBe(false);
  });
  it("rejects a tampered payload or signature", () => {
    const [payload, mac] = createSessionToken(env, now).split(".") as [string, string];
    const forged = Buffer.from(JSON.stringify({ v: 1, iat: now, exp: now + 9e12, n: "x" })).toString("base64url");
    expect(verifySessionToken(`${forged}.${mac}`, env, now)).toBe(false);
    expect(verifySessionToken(`${payload}.${mac.slice(0, -2)}AA`, env, now)).toBe(false);
  });
  it("expires after a week, and is invalid after the password or secret changes", () => {
    const t = createSessionToken(env, now);
    expect(verifySessionToken(t, env, now + 6 * 86_400_000)).toBe(true);
    expect(verifySessionToken(t, env, now + 8 * 86_400_000)).toBe(false);
    expect(verifySessionToken(t, { ADMIN_PASSWORD: "a-different-password" }, now)).toBe(false);
    expect(verifySessionToken(t, { ...env, ADMIN_SESSION_SECRET: "an-explicit-signing-secret" }, now)).toBe(false);
  });
  it("is never valid when the admin isn't configured", () => {
    expect(verifySessionToken(createSessionToken(env, now), {}, now)).toBe(false);
  });
  it("the cookie is HttpOnly, SameSite=Lax, site-wide, and Secure in production except on plain localhost", () => {
    const prod = sessionCookie("v", "totalproperty.vercel.app", { NODE_ENV: "production" });
    expect(prod).toMatchObject({ httpOnly: true, sameSite: "lax", secure: true, path: "/", maxAge: 604800 });
    expect(sessionCookie("v", "127.0.0.1:3100", { NODE_ENV: "production" }).secure).toBe(false);
    expect(sessionCookie("v", "localhost:3000", { NODE_ENV: "development" }).secure).toBe(false);
  });
});

describe("same-origin check", () => {
  const h = (o: Record<string, string>) => ({ get: (k: string) => o[k.toLowerCase()] ?? null });
  it("accepts only a request that came from this site", () => {
    expect(isSameOrigin(h({ origin: "https://site.test", host: "site.test" }))).toBe(true);
    expect(isSameOrigin(h({ origin: "https://site.test", "x-forwarded-host": "site.test", host: "internal" }))).toBe(true);
    expect(isSameOrigin(h({ origin: "https://evil.test", host: "site.test" }))).toBe(false);
    expect(isSameOrigin(h({ host: "site.test" }))).toBe(false);
    expect(isSameOrigin(h({ origin: "null", host: "site.test" }))).toBe(false);
    expect(isSameOrigin(h({ origin: "https://site.test.evil.test", host: "site.test" }))).toBe(false);
  });
});

describe("login rate limit", () => {
  it("allows a handful of tries per address and then stops, without affecting others", async () => {
    const results: boolean[] = [];
    for (let i = 0; i < 10; i++) results.push((await checkLoginRate("198.51.100.1", {})).ok);
    expect(results.slice(0, 8).every(Boolean)).toBe(true);
    expect(results.slice(8)).toEqual([false, false]);
    expect((await checkLoginRate("198.51.100.2", {})).ok).toBe(true);
  });
  it("with Upstash connected the count is shared, and an outage falls back to local memory", async () => {
    const sharedEnv = { KV_REST_API_URL: "https://demo.upstash.io", KV_REST_API_TOKEN: "t" };
    const over = vi.fn(async () => new Response(JSON.stringify([{ result: 99 }, { result: 1 }]), { status: 200 }));
    expect((await checkLoginRate("198.51.100.3", sharedEnv, over)).ok).toBe(false);
    const down = vi.fn(async () => {
      throw new Error("network");
    });
    expect((await checkLoginRate("198.51.100.4", sharedEnv, down)).ok).toBe(true);
  });
});
