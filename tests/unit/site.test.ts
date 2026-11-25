import { describe, expect, it } from "vitest";
import { absoluteUrl, navLinks, pillars, serviceAreas, siteConfig } from "@/lib/site";
import { portalUrls } from "@/lib/portals";

describe("siteConfig (verified facts only)", () => {
  it("carries the verified contact details from the live site", () => {
    expect(siteConfig.phone).toBe("202-528-0140");
    expect(siteConfig.phoneHref).toBe("tel:+12025280140");
    expect(siteConfig.email).toBe("info@totalproperty.us");
    expect(siteConfig.address).toEqual({ poBox: "PO Box 95", locality: "Purcellville", region: "VA", postalCode: "20132" });
  });

  it("does not assert unverified facts by default", () => {
    expect(siteConfig.licenses).toEqual([]);
    expect(siteConfig.leadership).toEqual([]);
    expect(siteConfig.foundedYear).toBeUndefined();
  });

  it("serves exactly VA, MD, PA and DC", () => {
    expect(serviceAreas.map((a) => a.code)).toEqual(["VA", "MD", "PA", "DC"]);
  });

  it("has the four positioning pillars with unique hrefs", () => {
    expect(pillars).toHaveLength(4);
    expect(new Set(pillars.map((p) => p.href)).size).toBe(4);
  });

  it("builds absolute URLs without double slashes", () => {
    expect(absoluteUrl("/owners")).toBe("https://totalproperty.us/owners");
    expect(absoluteUrl("owners")).toBe("https://totalproperty.us/owners");
    expect(absoluteUrl("/")).toBe("https://totalproperty.us/");
  });

  it("nav links are internal and unique", () => {
    for (const l of navLinks) expect(l.href.startsWith("/")).toBe(true);
    expect(new Set(navLinks.map((l) => l.href)).size).toBe(navLinks.length);
  });
});

describe("portalUrls", () => {
  it("omits unset values", () => {
    expect(portalUrls({})).toEqual({});
  });
  it("accepts https URLs only", () => {
    const out = portalUrls({
      OWNER_PORTAL_URL: "https://owners.example.com/login",
      TENANT_PORTAL_URL: "http://insecure.example.com",
      TENANT_PAYMENT_URL: "javascript:alert(1)",
    });
    expect(out).toEqual({ owner: "https://owners.example.com/login" });
  });
  it("ignores blank and malformed values", () => {
    expect(portalUrls({ OWNER_PORTAL_URL: "   ", TENANT_PORTAL_URL: "not a url" })).toEqual({});
  });
});
