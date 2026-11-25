import { describe, expect, it, vi } from "vitest";
import { cleanText, createRateLimiter, hashIp, verifyTurnstile } from "@/lib/forms/security";

describe("cleanText", () => {
  it("keeps markup as inert plain text but drops NUL/control characters", () => {
    expect(cleanText("<b>a</b>\u0000\u0007")).toBe("<b>a</b>");
  });
  it("strips zero-width and bidi-override characters", () => {
    expect(cleanText("pay​pal‮gpj.exe")).toBe("paypalgpj.exe");
  });
  it("collapses runs of spaces and excess blank lines but keeps paragraphs", () => {
    expect(cleanText("  a   b \n\n\n\n c  ")).toBe("a b\n\nc");
  });
  it("normalizes CRLF", () => {
    expect(cleanText("a\r\nb")).toBe("a\nb");
  });
  it("returns an empty string for whitespace-only input", () => {
    expect(cleanText(" \t\n ")).toBe("");
  });
});

describe("createRateLimiter", () => {
  it("allows `limit` requests then blocks, and reports retry time", () => {
    let t = 1_000;
    const rl = createRateLimiter({ limit: 3, windowMs: 1_000, now: () => t });
    expect(rl.check("ip").ok).toBe(true);
    expect(rl.check("ip").ok).toBe(true);
    expect(rl.check("ip").ok).toBe(true);
    const blocked = rl.check("ip");
    expect(blocked.ok).toBe(false);
    expect(blocked.retryAfterMs).toBeGreaterThan(0);
    expect(blocked.retryAfterMs).toBeLessThanOrEqual(1_000);
    t += 1_001;
    expect(rl.check("ip").ok).toBe(true);
  });
  it("tracks keys independently", () => {
    const rl = createRateLimiter({ limit: 1, windowMs: 1_000, now: () => 0 });
    expect(rl.check("a").ok).toBe(true);
    expect(rl.check("b").ok).toBe(true);
    expect(rl.check("a").ok).toBe(false);
  });
  it("does not grow without bound (evicts expired keys)", () => {
    let t = 0;
    const rl = createRateLimiter({ limit: 1, windowMs: 10, now: () => t, maxKeys: 50 });
    for (let i = 0; i < 500; i++) {
      t += 11;
      rl.check(`k${i}`);
    }
    expect(rl.size()).toBeLessThanOrEqual(50);
  });
});

describe("hashIp", () => {
  it("is deterministic, hex, and not the raw IP", () => {
    const h = hashIp("203.0.113.9", "secret-secret-secret-1234");
    expect(h).toMatch(/^[0-9a-f]{64}$/);
    expect(h).toBe(hashIp("203.0.113.9", "secret-secret-secret-1234"));
    expect(h).not.toContain("203.0.113.9");
  });
  it("differs by secret and by ip", () => {
    expect(hashIp("1.1.1.1", "secret-secret-secret-1234")).not.toBe(hashIp("1.1.1.1", "another-secret-value-9999"));
    expect(hashIp("1.1.1.1", "secret-secret-secret-1234")).not.toBe(hashIp("1.1.1.2", "secret-secret-secret-1234"));
  });
});

describe("verifyTurnstile", () => {
  const ok = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), { status }));
  it("is true only when Cloudflare reports success", async () => {
    expect(await verifyTurnstile("tok", "sec", "1.1.1.1", ok({ success: true }))).toBe(true);
    expect(await verifyTurnstile("tok", "sec", "1.1.1.1", ok({ success: false }))).toBe(false);
  });
  it("posts the secret, token and ip as form data to the siteverify endpoint", async () => {
    const f = ok({ success: true });
    await verifyTurnstile("tok", "sec", "9.9.9.9", f);
    const [url, init] = f.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const body = new URLSearchParams(String(init.body));
    expect(body.get("secret")).toBe("sec");
    expect(body.get("response")).toBe("tok");
    expect(body.get("remoteip")).toBe("9.9.9.9");
  });
  it("fails closed on empty token, HTTP error, bad JSON or network failure", async () => {
    expect(await verifyTurnstile("", "sec", undefined, ok({ success: true }))).toBe(false);
    expect(await verifyTurnstile("tok", "sec", undefined, ok({ success: true }, 500))).toBe(false);
    expect(await verifyTurnstile("tok", "sec", undefined, vi.fn(async () => new Response("nope")))).toBe(false);
    expect(await verifyTurnstile("tok", "sec", undefined, vi.fn(async () => { throw new Error("net"); }))).toBe(false);
  });
});
