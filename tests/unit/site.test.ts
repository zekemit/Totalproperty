import { describe, expect, it } from "vitest";
import { siteConfig as raw } from "@config/site";
import type { SiteConfig } from "@config/types";
import { absoluteUrl, deriveSite, navLinks, pillars, serviceAreas, siteConfig, validateSiteConfig } from "@/lib/site";
import { portalUrls } from "@/lib/portals";

const clone = (): SiteConfig => structuredClone(raw);

describe("shipped config (blank pending fields)", () => {
  it("carries the verified contact details from the live site", () => {
    expect(siteConfig.phone).toBe("202-528-0140");
    expect(siteConfig.phoneHref).toBe("tel:+12025280140");
    expect(siteConfig.email).toBe("info@totalproperty.us");
    expect(siteConfig.address).toMatchObject({ poBox: "PO Box 95", locality: "Purcellville", region: "VA", postalCode: "20132" });
    expect(siteConfig.mailingLine).toBe("PO Box 95, Purcellville, VA 20132");
  });

  it("is valid", () => {
    expect(validateSiteConfig(raw)).toEqual([]);
  });

  it("renders nothing for pending items, so nothing looks broken", () => {
    expect(siteConfig.licenses).toEqual([]);
    expect(siteConfig.leadership).toEqual([]);
    expect(siteConfig.testimonials).toEqual([]);
    expect(siteConfig.propertyPhotos).toEqual([]);
    expect(siteConfig.foundedYear).toBeUndefined();
    expect(siteConfig.hours).toBeUndefined();
    expect(siteConfig.officeLine).toBeUndefined();
    expect(siteConfig.portals).toEqual({ owner: undefined, tenant: undefined, payment: undefined });
    expect(siteConfig.legalName).toBe(siteConfig.name);
  });

  it("never claims a walk-in office while only a PO box is known", () => {
    expect(siteConfig.basedInSentence).toBe("We're based in Purcellville, Virginia.");
    expect(siteConfig.basedInSentence).not.toMatch(/office/i);
  });

  it("falls back to the main number for emergencies", () => {
    expect(siteConfig.emergencyPhone).toBe("202-528-0140");
    expect(siteConfig.emergencyPhoneHref).toBe("tel:+12025280140");
  });

  it("serves exactly VA, MD, PA and DC, phrased consistently", () => {
    expect(serviceAreas.map((a) => a.code)).toEqual(["VA", "MD", "PA", "DC"]);
    expect(siteConfig.areasPhrase).toBe("Virginia, Maryland, Pennsylvania and DC");
    expect(siteConfig.areasPhraseAmp).toBe("Virginia, Maryland, Pennsylvania & DC");
  });

  it("has the four positioning pillars with unique hrefs", () => {
    expect(pillars).toHaveLength(4);
    expect(new Set(pillars.map((p) => p.href)).size).toBe(4);
  });

  it("builds absolute URLs without double slashes", () => {
    expect(absoluteUrl("/owners")).toBe("https://totalproperty.us/owners");
    expect(absoluteUrl("owners")).toBe("https://totalproperty.us/owners");
  });

  it("nav links are internal and unique", () => {
    for (const l of navLinks) expect(l.href.startsWith("/")).toBe(true);
    expect(new Set(navLinks.map((l) => l.href)).size).toBe(navLinks.length);
  });
});

describe("a filled-in config", () => {
  const filled = (): SiteConfig => {
    const c = clone();
    c.company.legalName = "Total Property Management, LLC";
    c.company.foundedYear = 2009;
    c.contact.emergencyPhone = "(571) 555-0100";
    c.contact.hours = "Monday to Friday, 8:30 a.m. to 5 p.m.";
    c.address.street = "12 Main St";
    c.serviceAreaDetail = "Loudoun and Fauquier counties";
    c.licenses[0] = { state: "VA", number: "0225-123456", licenseType: "Firm license", verifyUrl: "https://example.gov/lookup" };
    c.leadership = [{ name: "Jane Smith", title: "Principal Broker", photo: { src: "/photos/jane.jpg", width: 800, height: 800, alt: "Jane Smith" } }];
    c.testimonials = [{ quote: "They handled everything.", name: "J. Doe", detail: "Owner, Leesburg" }];
    c.propertyPhotos = [{ src: "/photos/a.jpg", width: 1600, height: 1067, alt: "Retail center" }];
    c.portals = { ownerUrl: "https://owners.example.com", tenantUrl: "https://tenants.example.com", paymentUrl: "https://pay.example.com" };
    return c;
  };

  it("passes validation and surfaces everything that was supplied", () => {
    const c = filled();
    expect(validateSiteConfig(c)).toEqual([]);
    const s = deriveSite(c, "https://x.test");
    expect(s.legalName).toBe("Total Property Management, LLC");
    expect(s.foundedYear).toBe(2009);
    expect(s.licenses).toHaveLength(1);
    expect(s.licenses[0]?.label).toBe("Virginia Firm license 0225-123456");
    expect(s.leadership).toHaveLength(1);
    expect(s.testimonials).toHaveLength(1);
    expect(s.propertyPhotos).toHaveLength(1);
    expect(s.hours).toContain("8:30");
    expect(s.portals.owner).toBe("https://owners.example.com");
  });

  it("uses the dedicated emergency number and derives a tel: link from digits", () => {
    const s = deriveSite(filled(), "https://x.test");
    expect(s.emergencyPhone).toBe("(571) 555-0100");
    expect(s.emergencyPhoneHref).toBe("tel:+15715550100");
  });

  it("only says 'our office' once a street address exists", () => {
    const s = deriveSite(filled(), "https://x.test");
    expect(s.basedInSentence).toBe("Our office is at 12 Main St, Purcellville, VA 20132.");
    expect(s.officeLine).toBe("12 Main St, Purcellville, VA 20132");
  });

  it("drops half-filled entries instead of rendering empty cards", () => {
    const c = filled();
    c.testimonials.push({ quote: "", name: "" });
    c.leadership.push({ name: "", title: "" });
    c.licenses[1] = { state: "MD", number: "   " };
    const s = deriveSite(c, "https://x.test");
    expect(s.testimonials).toHaveLength(1);
    expect(s.leadership).toHaveLength(1);
    expect(s.licenses).toHaveLength(1);
  });

  it("hides a jurisdiction everywhere when featured is false", () => {
    const c = filled();
    c.serviceAreas[1] = { code: "MD", name: "Maryland", featured: false };
    const s = deriveSite(c, "https://x.test");
    expect(s.areasPhrase).toBe("Virginia, Pennsylvania and DC");
    expect(s.serviceAreas.map((a) => a.code)).toEqual(["VA", "PA", "DC"]);
  });

  it("phrases one and two areas correctly", () => {
    const c = clone();
    c.serviceAreas.forEach((a) => (a.featured = a.code === "VA"));
    expect(deriveSite(c, "u").areasPhrase).toBe("Virginia");
    c.serviceAreas.forEach((a) => (a.featured = a.code === "VA" || a.code === "DC"));
    expect(deriveSite(c, "u").areasPhrase).toBe("Virginia and DC");
  });
});

describe("validation fails fast, in plain English", () => {
  const bad = (mutate: (c: SiteConfig) => void) => {
    const c = clone();
    mutate(c);
    return validateSiteConfig(c);
  };
  it("rejects a malformed phone, email or founding year", () => {
    expect(bad((c) => (c.contact.phone = "555"))[0]).toMatch(/contact\.phone/);
    expect(bad((c) => (c.contact.email = "nope"))[0]).toMatch(/contact\.email/);
    expect(bad((c) => (c.company.foundedYear = 3009))[0]).toMatch(/foundedYear/);
  });
  it("rejects non-https portal and verify links", () => {
    expect(bad((c) => (c.portals.ownerUrl = "http://insecure.example"))[0]).toMatch(/portals\.ownerUrl.*https/);
    expect(bad((c) => (c.portals.paymentUrl = "javascript:alert(1)"))[0]).toMatch(/portals\.paymentUrl/);
    expect(bad((c) => (c.licenses[0]!.verifyUrl = "ftp://x"))[0]).toMatch(/licenses \(VA\)/);
  });
  it("requires alt text and real dimensions on photos", () => {
    expect(bad((c) => c.propertyPhotos.push({ src: "/photos/a.jpg", width: 100, height: 100, alt: "" }))[0]).toMatch(/alt text/);
    expect(bad((c) => c.propertyPhotos.push({ src: "photos/a.jpg", width: 100, height: 100, alt: "x" }))[0]).toMatch(/src must start with/);
    expect(bad((c) => c.propertyPhotos.push({ src: "/photos/a.jpg", width: 0, height: 100, alt: "x" }))[0]).toMatch(/width and height/);
  });
  it("requires a title for a named leader and a name for a quote", () => {
    expect(bad((c) => c.leadership.push({ name: "Jane", title: "" }))[0]).toMatch(/title is required/);
    expect(bad((c) => c.testimonials.push({ quote: "Great", name: "" }))[0]).toMatch(/name is required/);
  });
  it("requires at least one featured jurisdiction", () => {
    expect(bad((c) => c.serviceAreas.forEach((a) => (a.featured = false)))[0]).toMatch(/at least one/);
  });
  it("deriveSite throws one readable error that names the file", () => {
    const c = clone();
    c.portals.ownerUrl = "http://nope";
    expect(() => deriveSite(c, "u")).toThrow(/src\/config\/site\.ts[\s\S]*portals\.ownerUrl/);
  });
});

describe("portalUrls", () => {
  it("omits unset values", () => {
    expect(portalUrls({})).toEqual({});
  });
  it("accepts https URLs only", () => {
    expect(portalUrls({ owner: "https://owners.example.com/login", tenant: "http://insecure.example.com", payment: "javascript:alert(1)" })).toEqual({
      owner: "https://owners.example.com/login",
    });
  });
  it("ignores blank and malformed values", () => {
    expect(portalUrls({ owner: "   ", tenant: "not a url" })).toEqual({});
  });
  it("is empty for the shipped (blank) config", () => {
    expect(portalUrls()).toEqual({});
  });
});
