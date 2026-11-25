import { z } from "zod";
import { isHttpsUrl, isSafeHref, isSafeImageSrc } from "./safe-url";

/**
 * Everything Rafi can change from /admin, validated on every save.
 *
 * Rules the whole file follows:
 *  - Text is trimmed and length-capped. A blank text field means "use the standard wording".
 *  - Lists (services, listings, testimonials, ...) replace the standard list when present.
 *  - Links accept https://, http://, mailto:, tel: and site paths; images accept https:// and
 *    site paths. Nothing else gets through (see safe-url.ts).
 */

export const PAGE_KEYS = [
  "home",
  "services",
  "owners",
  "tenants",
  "commercial",
  "lenders",
  "about",
  "contact",
  "vendors",
  "careers",
  "spaces",
  "newsletter",
  "portal",
] as const;
export type PageKey = (typeof PAGE_KEYS)[number];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
export type Day = (typeof DAYS)[number];

export const LISTING_STATUSES = ["available", "coming_soon", "application_pending", "leased"] as const;
export type ListingStatus = (typeof LISTING_STATUSES)[number];

const text = (max: number) => z.string().trim().max(max, `Keep this under ${max} characters.`);
const required = (max: number, msg = "This can't be blank.") => z.string().trim().min(1, msg).max(max, `Keep this under ${max} characters.`);

const LINK_MSG = "Use a full link that starts with https://, a page on this site like /contact, or mailto: / tel:.";
const IMAGE_MSG = "Use a picture link that starts with https:// or pick one from the library.";
const HTTPS_MSG = "This link must start with https://.";

export const href = text(500).refine((v) => v === "" || isSafeHref(v), LINK_MSG);
export const image = text(500).refine((v) => v === "" || isSafeImageSrc(v), IMAGE_MSG);
const httpsOnly = text(500).refine((v) => v === "" || isHttpsUrl(v), HTTPS_MSG);

const id = z.string().trim().min(1).max(40).regex(/^[A-Za-z0-9_-]+$/, "Invalid id.");

const phone = text(30).refine((v) => {
  if (v === "") return true;
  const d = v.replace(/\D/g, "");
  return /^[\d\s()+.-]+$/.test(v) && (d.length === 10 || (d.length === 11 && d.startsWith("1")));
}, "Enter a 10-digit US phone number, like 202-528-0140.");

const email = text(254).refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), "Enter a valid email address.");

const time = text(5).refine((v) => v === "" || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), "Use a 24-hour time like 08:30.");

/* ───────────── Announcement ───────────── */

export const announcementSchema = z
  .object({
    enabled: z.boolean(),
    mode: z.enum(["bar", "popup"]),
    headline: text(120),
    body: text(400),
    ctaLabel: text(40),
    ctaHref: href,
  })
  .superRefine((a, ctx) => {
    if (a.enabled && a.headline === "") ctx.addIssue({ code: "custom", path: ["headline"], message: "Add a headline, or switch the announcement off." });
    if (a.ctaLabel !== "" && a.ctaHref === "") ctx.addIssue({ code: "custom", path: ["ctaHref"], message: "Add the page or link the button should open." });
    if (a.ctaHref !== "" && a.ctaLabel === "") ctx.addIssue({ code: "custom", path: ["ctaLabel"], message: "Add the words for the button." });
  });

/* ───────────── Homepage ───────────── */

const cta = z
  .object({ label: text(40), href })
  .superRefine((c, ctx) => {
    if (c.label !== "" && c.href === "") ctx.addIssue({ code: "custom", path: ["href"], message: "Add the page or link this button should open." });
    if (c.href !== "" && c.label === "") ctx.addIssue({ code: "custom", path: ["label"], message: "Add the words for this button." });
  });

export const homeSchema = z.object({
  heroLines: z.array(text(40)).max(3),
  heroLede: text(500),
  primaryCta: cta,
  secondaryCta: cta,
  statement: text(120),
  valueProps: z.array(z.object({ title: required(40, "Give this point a short title."), text: text(220) })).max(4),
});

/* ───────────── Services and property types ───────────── */

export const serviceSchema = z.object({
  id,
  visible: z.boolean(),
  title: required(80, "Every service needs a name."),
  audience: text(60),
  summary: text(400),
  items: z.array(required(100, "Remove empty bullets.")).max(30),
  image,
  imageAlt: text(160),
  href,
  cta: text(40),
});

export const propertyTypeSchema = z.object({
  id,
  visible: z.boolean(),
  title: required(60, "Every property type needs a name."),
  text: text(300),
  image,
  imageAlt: text(160),
  href,
});

/* ───────────── Listings ───────────── */

export const listingSchema = z.object({
  id,
  visible: z.boolean(),
  title: required(100, "Give the listing a title."),
  image,
  imageAlt: text(160),
  rent: text(60),
  specs: text(140),
  location: text(100),
  status: z.enum(LISTING_STATUSES),
  href,
});

/* ───────────── Company ───────────── */

export const licenseSchema = z.object({
  state: z.enum(["VA", "MD", "PA", "DC"]),
  number: text(40),
  holderName: text(100),
  licenseType: text(60),
  verifyUrl: httpsOnly,
});

export const testimonialSchema = z.object({
  id,
  quote: required(600, "A review needs the quote."),
  name: required(80, "Say who is quoted."),
  detail: text(100),
});

const hoursRow = z
  .object({ day: z.enum(DAYS), open: time, close: time })
  .superRefine((h, ctx) => {
    if (h.open !== "" && h.close === "") ctx.addIssue({ code: "custom", path: ["close"], message: "Add a closing time, or clear the opening time." });
    if (h.close !== "" && h.open === "") ctx.addIssue({ code: "custom", path: ["open"], message: "Add an opening time, or clear the closing time." });
    if (h.open !== "" && h.close !== "" && h.close <= h.open) ctx.addIssue({ code: "custom", path: ["close"], message: "Closing time must be after opening time." });
  });

export const companySchema = z.object({
  phone,
  emergencyPhone: phone,
  email,
  hours: z.array(hoursRow).max(7),
  hoursNote: text(160),
  serviceAreaDetail: text(160),
  licenses: z.array(licenseSchema).max(8),
  testimonials: z.array(testimonialSchema).max(12),
  portals: z.object({ ownerUrl: httpsOnly, tenantUrl: httpsOnly, paymentUrl: httpsOnly }),
});

/* ───────────── Careers ───────────── */

export const jobSchema = z.object({
  id,
  visible: z.boolean(),
  title: required(100, "Give the opening a title."),
  summary: text(240),
  href,
});

export const careersSchema = z.object({
  intro: text(400),
  jobs: z.array(jobSchema).max(20),
  benefits: z.array(required(80, "Remove empty benefits.")).max(8),
});

/* ───────────── SEO ───────────── */

export const pageMetaSchema = z.object({ title: text(90), description: text(220) });

export const seoSchema = z.object({
  pages: z.partialRecord(z.enum(PAGE_KEYS), pageMetaSchema),
  keywords: z.array(required(60, "Remove empty keywords.")).max(30),
});

/* ───────────── The whole document ───────────── */

export const cmsDocSchema = z.object({
  announcement: announcementSchema.optional(),
  home: homeSchema.optional(),
  services: z.array(serviceSchema).max(20).optional(),
  propertyTypes: z.array(propertyTypeSchema).max(20).optional(),
  listings: z.array(listingSchema).max(40).optional(),
  company: companySchema.optional(),
  careers: careersSchema.optional(),
  seo: seoSchema.optional(),
});

export type CmsDoc = z.infer<typeof cmsDocSchema>;
export type Announcement = z.infer<typeof announcementSchema>;
export type HomeDoc = z.infer<typeof homeSchema>;
export type ServiceDoc = z.infer<typeof serviceSchema>;
export type PropertyTypeDoc = z.infer<typeof propertyTypeSchema>;
export type ListingDoc = z.infer<typeof listingSchema>;
export type CompanyDoc = z.infer<typeof companySchema>;
export type LicenseDoc = z.infer<typeof licenseSchema>;
export type TestimonialDoc = z.infer<typeof testimonialSchema>;
export type CareersDoc = z.infer<typeof careersSchema>;
export type JobDoc = z.infer<typeof jobSchema>;
export type SeoDoc = z.infer<typeof seoSchema>;
export type HoursRow = z.infer<typeof hoursRow>;

/** A document with every section present (and a title/description for every page): what the admin form edits. */
export type FullCmsDoc = Omit<Required<CmsDoc>, "seo"> & {
  seo: { pages: Record<PageKey, { title: string; description: string }>; keywords: string[] };
};
