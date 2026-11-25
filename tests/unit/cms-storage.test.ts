import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { StorageConflictError, StorageReadonlyError, resolveStorage, storageMode, upstashCredentials } from "@/lib/cms-storage";

let dir: string;
beforeEach(() => {
  dir = mkdtempSync(path.join(tmpdir(), "tpm-cms-"));
});
afterEach(() => rmSync(dir, { recursive: true, force: true }));

describe("which storage is used", () => {
  it("prefers Upstash (either variable naming), else a local file, else read-only on Vercel", () => {
    expect(storageMode({})).toBe("file");
    expect(storageMode({ KV_REST_API_URL: "https://x.upstash.io", KV_REST_API_TOKEN: "t" })).toBe("upstash");
    expect(storageMode({ UPSTASH_REDIS_REST_URL: "https://x.upstash.io", UPSTASH_REDIS_REST_TOKEN: "t" })).toBe("upstash");
    expect(storageMode({ VERCEL: "1" })).toBe("readonly");
    expect(storageMode({ VERCEL_ENV: "production" })).toBe("readonly");
    expect(storageMode({ VERCEL: "1", KV_REST_API_URL: "https://x.upstash.io", KV_REST_API_TOKEN: "t" })).toBe("upstash");
  });
  it("ignores half-configured or insecure credentials", () => {
    expect(upstashCredentials({ KV_REST_API_URL: "https://x.upstash.io" })).toBeNull();
    expect(upstashCredentials({ KV_REST_API_TOKEN: "t" })).toBeNull();
    expect(upstashCredentials({ KV_REST_API_URL: "http://x.upstash.io", KV_REST_API_TOKEN: "t" })).toBeNull();
    expect(upstashCredentials({ KV_REST_API_URL: "https://x.upstash.io///", KV_REST_API_TOKEN: " t " })).toEqual({ url: "https://x.upstash.io", token: "t" });
  });
});

describe("local file store", () => {
  const env = () => ({ CMS_FILE_PATH: path.join(dir, "nested", "cms.json") });
  it("reads nothing before the first save, then round-trips and bumps the revision", async () => {
    const store = resolveStorage(env());
    expect(store.mode).toBe("file");
    expect(await store.read()).toBeNull();
    const first = await store.write({ home: { statement: "x" } }, 0);
    expect(first.rev).toBe(1);
    expect((await store.read())?.data).toEqual({ home: { statement: "x" } });
    expect((await store.write({ a: 1 }, 1)).rev).toBe(2);
  });
  it("refuses a save made from a stale copy", async () => {
    const store = resolveStorage(env());
    await store.write({ a: 1 }, 0);
    await expect(store.write({ a: 2 }, 0)).rejects.toBeInstanceOf(StorageConflictError);
    expect((await store.read())?.data).toEqual({ a: 1 });
  });
  it("treats a corrupt file as empty instead of crashing the site", async () => {
    const file = path.join(dir, "bad.json");
    writeFileSync(file, "{not json");
    expect(await resolveStorage({ CMS_FILE_PATH: file }).read()).toBeNull();
    writeFileSync(file, JSON.stringify({ nope: true }));
    expect(await resolveStorage({ CMS_FILE_PATH: file }).read()).toBeNull();
  });
  it("on Vercel without Upstash it still reads but refuses to write", async () => {
    const file = path.join(dir, "ro.json");
    const store = resolveStorage({ VERCEL: "1", CMS_FILE_PATH: file });
    expect(store.mode).toBe("readonly");
    expect(await store.read()).toBeNull();
    await expect(store.write({}, 0)).rejects.toBeInstanceOf(StorageReadonlyError);
  });
});

describe("Upstash store", () => {
  const env = { KV_REST_API_URL: "https://demo.upstash.io", KV_REST_API_TOKEN: "secret-token" };

  function fakeUpstash() {
    let value: string | null = null;
    const calls: { url: string; init?: RequestInit }[] = [];
    const fetchImpl = vi.fn(async (url: string, init?: RequestInit) => {
      calls.push({ url, init });
      if (init?.method === "POST") {
        const [cmd, key, val] = JSON.parse(init.body as string) as [string, string, string];
        if (cmd === "SET" && !key.endsWith(":previous")) value = val;
        return new Response(JSON.stringify({ result: "OK" }), { status: 200 });
      }
      return new Response(JSON.stringify({ result: value }), { status: 200 });
    });
    return { fetchImpl, calls };
  }

  it("authenticates every request with the bearer token", async () => {
    const { fetchImpl, calls } = fakeUpstash();
    const store = resolveStorage(env, fetchImpl);
    expect(store.mode).toBe("upstash");
    await store.read();
    await store.write({ a: 1 }, 0);
    for (const c of calls) expect((c.init?.headers as Record<string, string>).Authorization).toBe("Bearer secret-token");
    expect(calls.every((c) => c.url.startsWith("https://demo.upstash.io"))).toBe(true);
  });
  it("round-trips an envelope, tags reads for revalidation, and checks the revision on write", async () => {
    const { fetchImpl, calls } = fakeUpstash();
    const store = resolveStorage(env, fetchImpl);
    expect(await store.read()).toBeNull();
    const saved = await store.write({ home: { statement: "hi" } }, 0);
    expect(saved.rev).toBe(1);
    expect((await store.read())?.data).toEqual({ home: { statement: "hi" } });
    await expect(store.write({ x: 1 }, 0)).rejects.toBeInstanceOf(StorageConflictError);
    const publicRead = calls.find((c) => c.init?.method !== "POST");
    expect((publicRead?.init as { next?: { tags: string[] } }).next?.tags).toEqual(["cms"]);
  });
  it("keeps a copy of the previous version on every save", async () => {
    const { fetchImpl, calls } = fakeUpstash();
    const store = resolveStorage(env, fetchImpl);
    await store.write({ v: 1 }, 0);
    await store.write({ v: 2 }, 1);
    const previous = calls.filter((c) => c.init?.method === "POST").map((c) => JSON.parse(c.init?.body as string) as string[]).filter((b) => b[1]?.endsWith(":previous"));
    expect(previous).toHaveLength(1);
    expect(JSON.parse(previous[0]![2]!).data).toEqual({ v: 1 });
  });
  it("surfaces an outage as an error the caller can handle (the site falls back to standard content)", async () => {
    const store = resolveStorage(env, vi.fn(async () => new Response("down", { status: 503 })));
    await expect(store.read()).rejects.toThrow(/503/);
  });
});
