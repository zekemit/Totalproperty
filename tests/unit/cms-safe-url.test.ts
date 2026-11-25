import { describe, expect, it } from "vitest";
import { isExternal, isHttpsUrl, isSafeHref, isSafeImageSrc, safeHref, safeImage } from "@/lib/cms/safe-url";

describe("links an editor may enter", () => {
  it.each([
    "https://example.com/page?x=1#top",
    "http://example.com",
    "/contact",
    "/owners#analysis",
    "mailto:info@totalproperty.us",
    "mailto:info@totalproperty.us?subject=Hello",
    "tel:+12025280140",
    "tel:202-528-0140",
  ])("accepts %s", (v) => expect(isSafeHref(v)).toBe(true));

  it.each([
    "",
    "   ",
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//evil.example/phish",
    "/\\evil.example",
    "ftp://example.com/file",
    "https://user:pass@example.com",
    "https://",
    "https://exa mple.com",
    "https://example.com/\u0000",
    "mailto:not-an-email",
    "tel:abc",
    `/${"a".repeat(600)}`,
  ])("rejects %j", (v) => expect(isSafeHref(v)).toBe(false));
});

describe("pictures an editor may enter", () => {
  it("accepts https pictures and site files only", () => {
    expect(isSafeImageSrc("https://cdn.example.com/a.jpg")).toBe(true);
    expect(isSafeImageSrc("/photos/type-retail.webp")).toBe(true);
    for (const bad of ["http://example.com/a.jpg", "data:image/svg+xml,<svg onload=alert(1)>", "javascript:1", "//evil.example/a.jpg", "mailto:a@b.co", "tel:+12025280140", ""]) {
      expect(isSafeImageSrc(bad)).toBe(false);
    }
  });
});

describe("render-time guards and helpers", () => {
  it("return undefined for anything unsafe, so a bad stored value can never become a link", () => {
    expect(safeHref("javascript:alert(1)")).toBeUndefined();
    expect(safeHref(undefined)).toBeUndefined();
    expect(safeHref(" /contact ")).toBe("/contact");
    expect(safeImage("data:image/png;base64,AAAA")).toBeUndefined();
    expect(safeImage("/photos/x.webp")).toBe("/photos/x.webp");
  });
  it("tells outside links from site links, and https-only for portals", () => {
    expect(isExternal("https://example.com")).toBe(true);
    expect(isExternal("/contact")).toBe(false);
    expect(isExternal("mailto:a@b.co")).toBe(false);
    expect(isHttpsUrl("https://portal.example.com/login")).toBe(true);
    expect(isHttpsUrl("http://portal.example.com")).toBe(false);
  });
});
