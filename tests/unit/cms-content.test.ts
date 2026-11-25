import { describe, expect, it } from "vitest";
import { siteConfig as base } from "@config/site";
import type { SiteConfig } from "@config/types";
import { compactDoc, effectiveDoc, mergeContent, mergeSiteConfig } from "@/lib/cms/content";
import { DEFAULT_SERVICES } from "@/lib/cms/defaults";
import { blankHours, formatHours, formatTime, hoursSpecs } from "@/lib/cms/hours";
import { normalizeDoc } from "@/lib/cms/normalize";
import { cmsDocSchema, type CmsDoc, type HoursRow } from "@/lib/cms/schema";
import { breadcrumbJsonLd, localBusinessJsonLd } from "@/lib/seo-schema";

const URL = "https://totalproperty.test";
const weekdays = (open: string, close: string): HoursRow[] => blankHours().map((r, i) => (i < 5 ? { ...r, open, close } : r));

describe("standard content", () => {
  it("with nothing saved, the site is exactly the standard content", () => {
    const c = mergeContent({}, base, URL);
    expect(c.site.phone).toBe("202-528-0140");
    expect(c.announcement).toBeNull();
    expect(c.home.heroLines).toEqual(["Total Property", "Management"]);
    expect(c.home.statement).toBe("We are pitbulls about our client’s assets");
    expect(c.services.map((s) => s.id)).toEqual(["landlord", "tenant", "construction", "residential", "lender"]);
    expect(c.propertyTypes.map((p) => p.title)).toEqual(["Retail", "Industrial", "Marinas", "Hospitality", "Office", "Residential"]);
    expect(c.listings).toEqual([]);
    expect(c.careers.jobs).toEqual([]);
    expect(c.hoursSpecs).toEqual([]);
    expect(c.seo.pages.home.title).toContain("Purcellville, VA");
  });
  it("the reference copy is kept, with the 'Excuse' typo not carried over", () => {
    const retail = mergeContent({}, base, URL).propertyTypes.find((p) => p.id === "retail");
    expect(retail?.text).not.toMatch(/excuse/i);
    expect(retail?.text).toMatch(/multi-tenant and single-tenant/);
    const landlord = mergeContent({}, base, URL).services[0];
    expect(landlord?.items).toContain("Lot Sweeping");
    expect(landlord?.items).toHaveLength(18);
  });
  it("Maintenance and Leasing exist but are hidden until switched on", () => {
    const all = effectiveDoc({}, base, URL).services;
    expect(all.filter((s) => !s.visible).map((s) => s.id)).toEqual(["maintenance", "leasing"]);
  });
});

describe("edits layer on top of the standard content", () => {
  it("company details replace the standard ones; blanks keep them", () => {
    const doc: CmsDoc = {
      company: { phone: "703-555-0199", emergencyPhone: "", email: "", hours: [], hoursNote: "", serviceAreaDetail: "Loudoun and Fauquier counties", licenses: [], testimonials: [{ id: "t1", quote: "Great.", name: "J. Doe", detail: "" }], portals: { ownerUrl: "https://owners.example.com", tenantUrl: "", paymentUrl: "" } },
    };
    const { site } = mergeContent(doc, base, URL);
    expect(site.phone).toBe("703-555-0199");
    expect(site.phoneHref).toBe("tel:+17035550199");
    expect(site.email).toBe("info@totalproperty.us");
    expect(site.serviceAreaDetail).toBe("Loudoun and Fauquier counties");
    expect(site.portals.owner).toBe("https://owners.example.com");
    expect(site.portals.tenant).toBeUndefined();
    expect(site.testimonials).toEqual([{ quote: "Great.", name: "J. Doe" }]);
  });
  it("licenses without a number stay hidden; filled ones are shown", () => {
    const company = { phone: "", emergencyPhone: "", email: "", hours: [], hoursNote: "", serviceAreaDetail: "", testimonials: [], portals: { ownerUrl: "", tenantUrl: "", paymentUrl: "" },
      licenses: [{ state: "VA" as const, number: "0225-12345", holderName: "", licenseType: "Firm license", verifyUrl: "" }, { state: "MD" as const, number: "", holderName: "", licenseType: "", verifyUrl: "" }] };
    expect(mergeContent({ company }, base, URL).site.licenses.map((l) => l.label)).toEqual(["Virginia Firm license 0225-12345"]);
  });
  it("hidden services, property types, listings and openings are not rendered", () => {
    const services = DEFAULT_SERVICES.map((s) => (s.id === "lender" ? { ...s, visible: false } : s));
    const c = mergeContent({
      services,
      listings: [
        { id: "a", visible: true, title: "A", image: "", imageAlt: "", rent: "", specs: "", location: "", status: "available", href: "" },
        { id: "b", visible: false, title: "B", image: "", imageAlt: "", rent: "", specs: "", location: "", status: "leased", href: "" },
      ],
      careers: { intro: "", jobs: [{ id: "j", visible: false, title: "Hidden role", summary: "", href: "" }], benefits: [] },
    }, base, URL);
    expect(c.services.map((s) => s.id)).not.toContain("lender");
    expect(c.listings.map((l) => l.id)).toEqual(["a"]);
    expect(c.careers.jobs).toEqual([]);
  });
  it("an announcement is only live when on and given a headline; its id changes when the wording does", () => {
    const a = { enabled: true, mode: "popup" as const, headline: "Open house", body: "", ctaLabel: "", ctaHref: "" };
    const live = mergeContent({ announcement: a }, base, URL).announcement;
    expect(live?.mode).toBe("popup");
    expect(mergeContent({ announcement: { ...a, headline: "Different" } }, base, URL).announcement?.id).not.toBe(live?.id);
    expect(mergeContent({ announcement: { ...a, enabled: false } }, base, URL).announcement).toBeNull();
    expect(mergeContent({ announcement: { ...a, headline: "" } }, base, URL).announcement).toBeNull();
  });
  it("search titles and descriptions come from the SEO tab, blanks fall back", () => {
    const c = mergeContent({ seo: { pages: { owners: { title: "Landlords | TPM", description: "" } }, keywords: ["a keyword"] } }, base, URL);
    expect(c.seo.pages.owners.title).toBe("Landlords | TPM");
    expect(c.seo.pages.owners.description).toMatch(/free rental analysis/i);
    expect(c.seo.keywords).toEqual(["a keyword"]);
  });
  it("an invalid merged config can never take the site down: it falls back to the standard details", () => {
    const hostile = { company: { phone: "123", emergencyPhone: "", email: "", hours: [], hoursNote: "", serviceAreaDetail: "", licenses: [], testimonials: [], portals: { ownerUrl: "", tenantUrl: "", paymentUrl: "" } } } as CmsDoc;
    expect(mergeContent(hostile, base, URL).site.phone).toBe("202-528-0140");
  });
  it("mergeSiteConfig leaves the base alone when there is no company edit", () => {
    expect(mergeSiteConfig(base, undefined)).toBe(base);
    const merged: SiteConfig = mergeSiteConfig(base, { phone: "", emergencyPhone: "", email: "", hours: weekdays("08:30", "17:00"), hoursNote: "Emergencies 24/7", serviceAreaDetail: "", licenses: [], testimonials: [], portals: { ownerUrl: "", tenantUrl: "", paymentUrl: "" } });
    expect(merged.contact.hours).toBe("Monday to Friday, 8:30 a.m. to 5 p.m.. Emergencies 24/7");
  });
});

describe("saving keeps the stored document minimal", () => {
  it("an untouched form stores nothing at all", () => {
    expect(compactDoc(effectiveDoc({}, base, URL), base, URL)).toEqual({});
  });
  it("only real changes are stored, and cleared text goes back to the standard wording", () => {
    const full = effectiveDoc({}, base, URL);
    full.home.statement = "Fighting for your assets";
    full.company.phone = "703-555-0199";
    full.seo.pages.owners.title = "Custom owners title";
    const stored = compactDoc(full, base, URL);
    expect(Object.keys(stored).sort()).toEqual(["company", "home", "seo"]);
    expect(stored.home?.statement).toBe("Fighting for your assets");
    expect(stored.home?.heroLede).toBe("");
    expect(stored.company?.email).toBe("");
    expect(stored.seo?.pages.owners?.title).toBe("Custom owners title");
    expect(stored.seo?.pages.home).toBeUndefined();
    expect(cmsDocSchema.safeParse(stored).success).toBe(true);
    // Round trip: what was saved is what comes back.
    const back = effectiveDoc(stored, base, URL);
    expect(back.home.statement).toBe("Fighting for your assets");
    expect(back.home.heroLede).toBe(full.home.heroLede);
    expect(back.company.phone).toBe("703-555-0199");
  });
  it("normalizeDoc drops blank lines and blank headline lines", () => {
    const full = effectiveDoc({}, base, URL);
    full.home.heroLines = ["Line one", "  ", ""];
    full.services[0]!.items = ["A", "", "  B  ", " "];
    full.seo.keywords = ["k", ""];
    const n = normalizeDoc(full);
    expect(n.home.heroLines).toEqual(["Line one"]);
    expect(n.services[0]!.items).toEqual(["A", "B"]);
    expect(n.seo.keywords).toEqual(["k"]);
  });
});

describe("office hours", () => {
  it("formats times the way people say them", () => {
    expect(formatTime("08:30")).toBe("8:30 a.m.");
    expect(formatTime("17:00")).toBe("5 p.m.");
    expect(formatTime("12:00")).toBe("noon");
    expect(formatTime("00:15")).toBe("12:15 a.m.");
  });
  it("collapses consecutive identical days and separates different ones", () => {
    const rows = weekdays("08:30", "17:00");
    rows[5] = { day: "Sat", open: "09:00", close: "12:00" };
    expect(formatHours(rows)).toBe("Monday to Friday, 8:30 a.m. to 5 p.m.; Saturday, 9 a.m. to noon");
    expect(formatHours(blankHours())).toBe("");
    const two = blankHours();
    two[0] = { day: "Mon", open: "09:00", close: "17:00" };
    two[1] = { day: "Tue", open: "09:00", close: "17:00" };
    expect(formatHours(two)).toBe("Monday and Tuesday, 9 a.m. to 5 p.m.");
  });
  it("produces schema.org opening-hours entries", () => {
    expect(hoursSpecs(weekdays("08:30", "17:00"))).toEqual([{ "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:30", closes: "17:00" }]);
  });
});

describe("structured data", () => {
  it("describes the business as a LocalBusiness / RealEstateAgent with area, contact and offers", () => {
    const j = localBusinessJsonLd(mergeContent({}, base, URL)) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(j["@type"]).toEqual(["LocalBusiness", "RealEstateAgent"]);
    expect(j.url).toBe(URL);
    expect(j.telephone).toBe("+12025280140");
    expect(j.address).toMatchObject({ postOfficeBoxNumber: "PO Box 95", addressLocality: "Purcellville", addressRegion: "VA", postalCode: "20132" });
    expect(j.address.streetAddress).toBeUndefined();
    expect((j.areaServed as { name: string }[]).map((a) => a.name)).toEqual(["Purcellville, VA", "Loudoun County, VA", "Northern Virginia", "Virginia", "Maryland", "Pennsylvania", "Washington, DC"]);
    expect(j.hasOfferCatalog.itemListElement).toHaveLength(5);
    expect(j.openingHoursSpecification).toBeUndefined();
    expect(j.aggregateRating).toBeUndefined();
    expect(j.review).toBeUndefined();
    expect(j.geo).toBeUndefined();
  });
  it("includes hours when set, drops hidden services from the catalogue, and escapes nothing unsafe into URLs", () => {
    const c = mergeContent({ services: DEFAULT_SERVICES.map((s) => ({ ...s, visible: s.id === "landlord" })), company: { phone: "", emergencyPhone: "", email: "", hours: weekdays("08:30", "17:00"), hoursNote: "", serviceAreaDetail: "Fauquier County", licenses: [], testimonials: [], portals: { ownerUrl: "", tenantUrl: "", paymentUrl: "" } } }, base, URL);
    const j = localBusinessJsonLd(c) as Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    expect(j.hasOfferCatalog.itemListElement).toHaveLength(1);
    expect(j.openingHoursSpecification).toHaveLength(1);
    expect((j.areaServed as { name: string }[]).map((a) => a.name)).toContain("Fauquier County");
    expect(j.logo).toBe(`${URL}/photos/tpm-mark.webp`);
  });
  it("builds a breadcrumb trail", () => {
    const b = breadcrumbJsonLd(mergeContent({}, base, URL), [{ name: "Owners", path: "/owners" }]) as { itemListElement: { position: number; item: string }[] };
    expect(b.itemListElement.map((i) => [i.position, i.item])).toEqual([[1, `${URL}/`], [2, `${URL}/owners`]]);
  });
});

describe("the standard content passes the editor's own validation", () => {
  it("so the very first save from an untouched form can never be refused", () => {
    const r = cmsDocSchema.required().safeParse(normalizeDoc(effectiveDoc({}, base, URL)));
    expect(r.success ? [] : r.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)).toEqual([]);
  });
});
