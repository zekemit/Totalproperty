import { describe, expect, it } from "vitest";
import { clientIp } from "@/lib/forms/runtime";

const h = (init: Record<string, string>) => new Headers(init);

describe("clientIp", () => {
  it("uses the first x-forwarded-for entry", () => {
    expect(clientIp(h({ "x-forwarded-for": "203.0.113.9, 10.0.0.1" }))).toBe("203.0.113.9");
  });
  it("supports IPv6", () => {
    expect(clientIp(h({ "x-forwarded-for": "2001:db8::1" }))).toBe("2001:db8::1");
  });
  it("falls back to x-real-ip, then 'unknown'", () => {
    expect(clientIp(h({ "x-real-ip": "198.51.100.4" }))).toBe("198.51.100.4");
    expect(clientIp(h({}))).toBe("unknown");
  });
  it("discards non-IP junk so it can't reach rate-limit keys or logs", () => {
    expect(clientIp(h({ "x-forwarded-for": "<script>alert(1)</script>" }))).toBe("unknown");
    // A raw header object (not the Headers class, which would reject this) carrying a newline:
    expect(clientIp({ get: () => "evil\nHost: x" })).toBe("unknown");
  });
});
