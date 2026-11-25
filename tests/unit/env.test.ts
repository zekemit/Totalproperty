import { describe, expect, it } from "vitest";
import { formsPreviewMode, indexingAllowed, resolveSiteUrl } from "@/lib/env";
import { buildRobots, buildSitemap } from "@/lib/seo";

describe("resolveSiteUrl", () => {
  it("prefers an explicit NEXT_PUBLIC_SITE_URL (trailing slash removed)", () => {
    expect(resolveSiteUrl({ NEXT_PUBLIC_SITE_URL: "https://totalproperty.us/", VERCEL_PROJECT_PRODUCTION_URL: "tp.vercel.app" })).toBe("https://totalproperty.us");
  });
  it("uses the Vercel production alias before cutover so the preview points at itself", () => {
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "totalproperty.vercel.app" })).toBe("https://totalproperty.vercel.app");
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "https://tp.vercel.app/" })).toBe("https://tp.vercel.app");
  });
  it("defaults to the real domain for local development", () => {
    expect(resolveSiteUrl({})).toBe("https://totalproperty.us");
  });
});

describe("indexingAllowed (safe by default)", () => {
  it("is false unless ALLOW_INDEXING is exactly 'true'", () => {
    expect(indexingAllowed({})).toBe(false);
    expect(indexingAllowed({ ALLOW_INDEXING: "" })).toBe(false);
    expect(indexingAllowed({ ALLOW_INDEXING: "1" })).toBe(false);
    expect(indexingAllowed({ ALLOW_INDEXING: "yes" })).toBe(false);
    expect(indexingAllowed({ ALLOW_INDEXING: "TRUE" })).toBe(true);
    expect(indexingAllowed({ ALLOW_INDEXING: " true " })).toBe(true);
  });
});

describe("formsPreviewMode", () => {
  it("is off unless explicitly enabled", () => {
    expect(formsPreviewMode({})).toBe(false);
    expect(formsPreviewMode({ FORMS_PREVIEW_MODE: "true" })).toBe(true);
  });
});

describe("robots and sitemap", () => {
  const routes = [{ path: "/", priority: 1 }, { path: "/owners", priority: 0.9 }];
  it("blocks everything and publishes no sitemap while indexing is off", () => {
    expect(buildRobots(false, "https://x.test")).toEqual({ rules: [{ userAgent: "*", disallow: "/" }] });
    expect(buildSitemap(false, "https://x.test", routes)).toEqual([]);
  });
  it("allows crawling and lists routes once indexing is on", () => {
    const r = buildRobots(true, "https://x.test");
    expect(r.rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] }]);
    expect(r.sitemap).toBe("https://x.test/sitemap.xml");
    expect(buildSitemap(true, "https://x.test", routes).map((e) => e.url)).toEqual(["https://x.test/", "https://x.test/owners"]);
  });
});
