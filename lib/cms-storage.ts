import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Where the /admin edits live.
 *
 *  - "upstash":  Upstash Redis (Vercel KV / Upstash integration), over its REST API. This is
 *                what production uses. Env: KV_REST_API_URL + KV_REST_API_TOKEN, or
 *                UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN.
 *  - "file":     data/cms-overrides.json on disk. Used in local development, so the admin works
 *                with zero setup. Override the location with CMS_FILE_PATH.
 *  - "readonly": running on Vercel with no Upstash connected. The site renders its standard
 *                content; the admin shows a clear "connect Upstash" notice and refuses to save
 *                (a serverless filesystem would silently lose the edit).
 *
 * The stored value is an envelope { rev, updatedAt, data }. `rev` increases on every save and
 * is checked on write, so two open browser tabs can't silently overwrite each other.
 */

export type StorageMode = "upstash" | "file" | "readonly";
export type Envelope = { rev: number; updatedAt: string; data: unknown };

export class StorageConflictError extends Error {
  constructor() {
    super("The site was saved somewhere else since you opened this page.");
    this.name = "StorageConflictError";
  }
}

export class StorageReadonlyError extends Error {
  constructor() {
    super("No database is connected, so changes can't be saved yet.");
    this.name = "StorageReadonlyError";
  }
}

export type CmsStorage = {
  mode: StorageMode;
  read(opts?: { fresh?: boolean }): Promise<Envelope | null>;
  write(data: unknown, expectedRev: number): Promise<Envelope>;
};

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init?: RequestInit) => Promise<Response>;

const KEY = "tpm:cms:overrides:v1";
/** Safety net: even if an on-demand revalidation were missed, pages refresh within 5 minutes. */
const SAFETY_REVALIDATE_SECONDS = 300;

export function upstashCredentials(env: Env = process.env): { url: string; token: string } | null {
  const url = (env.KV_REST_API_URL || env.UPSTASH_REDIS_REST_URL || "").trim().replace(/\/+$/, "");
  const token = (env.KV_REST_API_TOKEN || env.UPSTASH_REDIS_REST_TOKEN || "").trim();
  return url.startsWith("https://") && token ? { url, token } : null;
}

export function storageMode(env: Env = process.env): StorageMode {
  if (upstashCredentials(env)) return "upstash";
  if (env.VERCEL === "1" || env.VERCEL_ENV) return "readonly";
  return "file";
}

function toEnvelope(raw: unknown): Envelope | null {
  let value = raw;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object") return null;
  const v = value as Partial<Envelope>;
  if (typeof v.rev !== "number" || !Number.isFinite(v.rev) || typeof v.updatedAt !== "string" || !("data" in v)) return null;
  return { rev: v.rev, updatedAt: v.updatedAt, data: v.data };
}

/* ───────────── Upstash ───────────── */

function upstashStorage(creds: { url: string; token: string }, fetchImpl: FetchLike): CmsStorage {
  const headers = { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" };

  async function command(args: unknown[]): Promise<unknown> {
    const res = await fetchImpl(creds.url, {
      method: "POST",
      headers,
      body: JSON.stringify(args),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
    const json = (await res.json()) as { result?: unknown; error?: string };
    if (json.error) throw new Error("Upstash rejected the command");
    return json.result;
  }

  const store: CmsStorage = {
    mode: "upstash",
    async read(opts) {
      const init: RequestInit & { next?: { tags: string[]; revalidate: number } } = opts?.fresh
        ? { headers, cache: "no-store", signal: AbortSignal.timeout(8_000) }
        : { headers, next: { tags: ["cms"], revalidate: SAFETY_REVALIDATE_SECONDS }, signal: AbortSignal.timeout(8_000) };
      const res = await fetchImpl(`${creds.url}/get/${encodeURIComponent(KEY)}`, init);
      if (!res.ok) throw new Error(`Upstash responded ${res.status}`);
      const json = (await res.json()) as { result?: unknown };
      return json.result == null ? null : toEnvelope(json.result);
    },
    async write(data, expectedRev) {
      const current = await store.read({ fresh: true });
      if ((current?.rev ?? 0) !== expectedRev) throw new StorageConflictError();
      const next: Envelope = { rev: expectedRev + 1, updatedAt: new Date().toISOString(), data };
      if (current) await command(["SET", `${KEY}:previous`, JSON.stringify(current)]);
      await command(["SET", KEY, JSON.stringify(next)]);
      return next;
    },
  };
  return store;
}

/* ───────────── Local file ───────────── */

export function cmsFilePath(env: Env = process.env): string {
  return env.CMS_FILE_PATH?.trim() || path.join(process.cwd(), "data", "cms-overrides.json");
}

function fileStorage(file: string, writable: boolean): CmsStorage {
  async function readFile(): Promise<Envelope | null> {
    try {
      return toEnvelope(await fs.readFile(file, "utf8"));
    } catch {
      return null;
    }
  }
  return {
    mode: writable ? "file" : "readonly",
    read: readFile,
    async write(data, expectedRev) {
      if (!writable) throw new StorageReadonlyError();
      const current = await readFile();
      if ((current?.rev ?? 0) !== expectedRev) throw new StorageConflictError();
      const next: Envelope = { rev: expectedRev + 1, updatedAt: new Date().toISOString(), data };
      await fs.mkdir(path.dirname(file), { recursive: true });
      const tmp = `${file}.${process.pid}.tmp`;
      await fs.writeFile(tmp, JSON.stringify(next, null, 2), "utf8");
      await fs.rename(tmp, file);
      return next;
    },
  };
}

/** Pick the storage for this environment. `fetchImpl` is injectable for tests. */
export function resolveStorage(env: Env = process.env, fetchImpl: FetchLike = fetch): CmsStorage {
  const creds = upstashCredentials(env);
  if (creds) return upstashStorage(creds, fetchImpl);
  return fileStorage(cmsFilePath(env), storageMode(env) === "file");
}
