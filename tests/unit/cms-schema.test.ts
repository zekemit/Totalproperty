import { describe, expect, it } from "vitest";
import { announcementSchema, cmsDocSchema, companySchema, listingSchema, seoSchema, serviceSchema } from "@/lib/cms/schema";

const ann = { enabled: true, mode: "bar" as const, headline: "Hello", body: "", ctaLabel: "", ctaHref: "" };

describe("announcement", () => {
  it("needs a headline once switched on, and a button needs both words and a link", () => {
    expect(announcementSchema.safeParse(ann).success).toBe(true);
    expect(announcementSchema.safeParse({ ...ann, headline: "" }).success).toBe(false);
    expect(announcementSchema.safeParse({ ...ann, enabled: false, headline: "" }).success).toBe(true);
    expect(announcementSchema.safeParse({ ...ann, ctaLabel: "Go" }).success).toBe(false);
    expect(announcementSchema.safeParse({ ...ann, ctaHref: "/spaces" }).success).toBe(false);
    expect(announcementSchema.safeParse({ ...ann, ctaLabel: "Go", ctaHref: "/spaces" }).success).toBe(true);
  });
  it("rejects unsafe destinations with a plain-English message", () => {
    const r = announcementSchema.safeParse({ ...ann, ctaLabel: "Go", ctaHref: "javascript:alert(1)" });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toMatch(/starts with https/);
  });
});

describe("company", () => {
  const company = {
    phone: "", emergencyPhone: "", email: "", hours: [], hoursNote: "", serviceAreaDetail: "", licenses: [], testimonials: [],
    portals: { ownerUrl: "", tenantUrl: "", paymentUrl: "" },
  };
  it("accepts blanks (use the standard value) and valid US phones and emails", () => {
    expect(companySchema.safeParse(company).success).toBe(true);
    expect(companySchema.safeParse({ ...company, phone: "703-555-0199", emergencyPhone: "(703) 555-0100", email: "a@b.co" }).success).toBe(true);
  });
  it("rejects a short phone, a bad email, http portals and impossible hours", () => {
    expect(companySchema.safeParse({ ...company, phone: "12345" }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, email: "nope" }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, portals: { ...company.portals, tenantUrl: "http://portal.example.com" } }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, hours: [{ day: "Mon", open: "17:00", close: "08:00" }] }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, hours: [{ day: "Mon", open: "08:00", close: "" }] }).success).toBe(false);
    expect(companySchema.safeParse({ ...company, hours: [{ day: "Mon", open: "08:30", close: "17:00" }] }).success).toBe(true);
  });
});

describe("lists", () => {
  it("a service needs a name; a listing needs a title, a known status and a safe picture", () => {
    const service = { id: "s1", visible: true, title: "X", audience: "", summary: "", items: [], image: "", imageAlt: "", href: "", cta: "" };
    expect(serviceSchema.safeParse(service).success).toBe(true);
    expect(serviceSchema.safeParse({ ...service, title: "  " }).success).toBe(false);
    const listing = { id: "l1", visible: true, title: "Suite", image: "", imageAlt: "", rent: "", specs: "", location: "", status: "available", href: "" };
    expect(listingSchema.safeParse(listing).success).toBe(true);
    expect(listingSchema.safeParse({ ...listing, status: "sold" }).success).toBe(false);
    expect(listingSchema.safeParse({ ...listing, image: "http://example.com/a.jpg" }).success).toBe(false);
    expect(listingSchema.safeParse({ ...listing, id: "bad id!" }).success).toBe(false);
  });
  it("seo pages are limited to the known routes", () => {
    expect(seoSchema.safeParse({ pages: { owners: { title: "T", description: "D" } }, keywords: [] }).success).toBe(true);
    expect(seoSchema.safeParse({ pages: { admin: { title: "T", description: "D" } }, keywords: [] }).success).toBe(false);
  });
  it("an empty document is valid (everything falls back to the standard content)", () => {
    expect(cmsDocSchema.safeParse({}).success).toBe(true);
  });
});
