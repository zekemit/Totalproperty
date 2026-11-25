import { afterEach, describe, expect, it } from "vitest";

const original = process.env.ALLOW_INDEXING;
afterEach(() => {
  if (original === undefined) delete process.env.ALLOW_INDEXING;
  else process.env.ALLOW_INDEXING = original;
});

describe("sitemap and robots follow ALLOW_INDEXING", () => {
  it("expose nothing while indexing is off", async () => {
    delete process.env.ALLOW_INDEXING;
    const { default: sitemap } = await import("@/app/sitemap");
    const { default: robots } = await import("@/app/robots");
    expect(await sitemap()).toEqual([]);
    expect(await robots()).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
  });

  it("list every public page, new ones included, and never /admin, the moment it is switched on", async () => {
    process.env.ALLOW_INDEXING = "true";
    const { default: sitemap } = await import("@/app/sitemap");
    const { default: robots } = await import("@/app/robots");
    const urls = (await sitemap()).map((e) => new URL(e.url).pathname);
    for (const p of ["/", "/services", "/owners", "/tenants", "/commercial", "/lenders", "/about", "/contact", "/vendors", "/careers", "/spaces", "/newsletter", "/portal", "/privacy", "/accessibility", "/fair-housing"]) {
      expect(urls).toContain(p);
    }
    expect(urls.some((u) => u.startsWith("/admin") || u.startsWith("/api"))).toBe(false);
    expect(new Set(urls).size).toBe(urls.length);
    const r = await robots();
    expect(r.rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] }]);
    expect(r.sitemap).toMatch(/\/sitemap\.xml$/);
  });
});
