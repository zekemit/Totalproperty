/**
 * Derives everything the pages need from the business information in
 * src/config/site.ts (the file to edit) plus a few fixed positioning blocks.
 *
 * Nothing unverified is invented here: licenses, leadership, testimonials, photos,
 * portal links and a street address are all empty until supplied, and every
 * derived list below drops blank entries so a half-filled config never renders
 * a broken or empty section.
 */
import { siteConfig as rawConfig } from "@config/site";
import type { License, Leader, Photo, SiteConfig, StateCode, Testimonial } from "@config/types";
import { resolveSiteUrl } from "./env";

export type { License, Leader, Photo, StateCode, Testimonial };

/* ───────────────────────────── Validation ───────────────────────────── */

const isBlank = (v: string | undefined) => !v || v.trim() === "";
const isHttps = (v: string) => {
  try {
    return new URL(v).protocol === "https:";
  } catch {
    return false;
  }
};

/** Plain-English problems with the config; empty when it is valid. Blank optional fields are fine. */
export function validateSiteConfig(c: SiteConfig): string[] {
  const problems: string[] = [];
  const digits = c.contact.phone.replace(/\D/g, "");
  if (!(digits.length === 10 || (digits.length === 11 && digits.startsWith("1")))) {
    problems.push(`contact.phone must be a 10-digit US number (got "${c.contact.phone}").`);
  }
  if (c.contact.emergencyPhone && c.contact.emergencyPhone.trim()) {
    const e = c.contact.emergencyPhone.replace(/\D/g, "");
    if (!(e.length === 10 || (e.length === 11 && e.startsWith("1")))) {
      problems.push(`contact.emergencyPhone must be a 10-digit US number (got "${c.contact.emergencyPhone}").`);
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.contact.email)) problems.push(`contact.email "${c.contact.email}" is not a valid email address.`);
  const year = c.company.foundedYear;
  if (year !== undefined && !(Number.isInteger(year) && year >= 1900 && year <= new Date().getFullYear())) {
    problems.push(`company.foundedYear must be a four-digit year between 1900 and this year (got ${year}).`);
  }
  if (!c.serviceAreas.some((a) => a.featured)) problems.push("serviceAreas: at least one jurisdiction must have featured: true.");
  for (const l of c.licenses) {
    if (!isBlank(l.verifyUrl) && !isHttps(l.verifyUrl as string)) problems.push(`licenses (${l.state}): verifyUrl must start with https:// (got "${l.verifyUrl}").`);
  }
  (["ownerUrl", "tenantUrl", "paymentUrl"] as const).forEach((k) => {
    const v = c.portals[k];
    if (!isBlank(v) && !isHttps(v as string)) problems.push(`portals.${k} must start with https:// (got "${v}").`);
  });
  const checkPhoto = (p: Photo, where: string) => {
    if (!p.src.startsWith("/")) problems.push(`${where}: src must start with "/" (a file in /public), got "${p.src}".`);
    if (!(p.width > 0 && p.height > 0)) problems.push(`${where}: width and height must be the image's real pixel size.`);
    if (isBlank(p.alt)) problems.push(`${where}: alt text is required (describe the photo for people who can't see it).`);
  };
  c.propertyPhotos.forEach((p, i) => checkPhoto(p, `propertyPhotos[${i}]`));
  c.leadership.forEach((l, i) => l.photo && checkPhoto(l.photo, `leadership[${i}].photo`));
  c.leadership.forEach((l, i) => {
    if (!isBlank(l.name) && isBlank(l.title)) problems.push(`leadership[${i}] (${l.name}): title is required.`);
  });
  c.testimonials.forEach((t, i) => {
    if (!isBlank(t.quote) && isBlank(t.name)) problems.push(`testimonials[${i}]: name is required (say who is quoted).`);
  });
  return problems;
}

/* ───────────────────────────── Derivation ───────────────────────────── */

function joinNames(names: string[], conjunction: string): string {
  if (names.length <= 1) return names[0] ?? "";
  return `${names.slice(0, -1).join(", ")} ${conjunction} ${names[names.length - 1]}`;
}

function telHref(phone: string): string {
  const d = phone.replace(/\D/g, "");
  return `tel:+${d.length === 11 ? d : `1${d}`}`;
}

export function deriveSite(c: SiteConfig, url: string) {
  const problems = validateSiteConfig(c);
  if (problems.length > 0) {
    throw new Error(`Invalid business information in src/config/site.ts:\n - ${problems.join("\n - ")}`);
  }

  const areas = c.serviceAreas.filter((a) => a.featured);
  const short = (a: { code: StateCode; name: string }) => (a.code === "DC" ? "DC" : a.name);
  const stateName = c.serviceAreas.find((a) => a.code === c.address.region)?.name ?? c.address.region;
  const street = c.address.street?.trim() || undefined;
  const emergencyPhone = c.contact.emergencyPhone?.trim() || c.contact.phone;

  const licenses = c.licenses
    .filter((l) => !isBlank(l.number))
    .map((l) => {
      const name = c.serviceAreas.find((a) => a.code === l.state)?.name ?? l.state;
      return {
        state: l.state,
        stateName: name,
        number: l.number.trim(),
        holderName: l.holderName?.trim() || undefined,
        verifyUrl: l.verifyUrl?.trim() || undefined,
        label: `${name} ${l.licenseType?.trim() || "license"} ${l.number.trim()}`,
      };
    });

  return {
    name: c.company.name,
    /** Legal entity name when supplied, else the trade name. Used in footers and policies. */
    legalName: c.company.legalName?.trim() || c.company.name,
    tagline: c.company.tagline,
    description: c.company.description,
    foundedYear: c.company.foundedYear,
    url,

    phone: c.contact.phone,
    phoneHref: telHref(c.contact.phone),
    emergencyPhone,
    emergencyPhoneHref: telHref(emergencyPhone),
    email: c.contact.email,
    hours: c.contact.hours?.trim() || undefined,

    address: { poBox: c.address.poBox, street, locality: c.address.locality, region: c.address.region, postalCode: c.address.postalCode },
    /** "PO Box 95, Purcellville, VA 20132" */
    mailingLine: `${c.address.poBox}, ${c.address.locality}, ${c.address.region} ${c.address.postalCode}`,
    /** The street address line, only when one was supplied. */
    officeLine: street ? `${street}, ${c.address.locality}, ${c.address.region} ${c.address.postalCode}` : undefined,
    /** Never claims an office unless a street address exists. */
    basedInSentence: street
      ? `Our office is at ${street}, ${c.address.locality}, ${c.address.region} ${c.address.postalCode}.`
      : `We're based in ${c.address.locality}, ${stateName}.`,
    /** "Purcellville, VA" */
    place: `${c.address.locality}, ${c.address.region}`,

    serviceAreas: areas,
    serviceAreaDetail: c.serviceAreaDetail?.trim() || undefined,
    /** "Virginia, Maryland, Pennsylvania and DC" */
    areasPhrase: joinNames(areas.map(short), "and"),
    /** "Virginia, Maryland, Pennsylvania & DC" */
    areasPhraseAmp: joinNames(areas.map(short), "&"),
    areaNames: areas.map((a) => a.name),

    licenses,
    leadership: c.leadership.filter((l) => !isBlank(l.name) && !isBlank(l.title)),
    testimonials: c.testimonials.filter((t) => !isBlank(t.quote) && !isBlank(t.name)),
    propertyPhotos: c.propertyPhotos,

    portals: {
      owner: isBlank(c.portals.ownerUrl) ? undefined : c.portals.ownerUrl?.trim(),
      tenant: isBlank(c.portals.tenantUrl) ? undefined : c.portals.tenantUrl?.trim(),
      payment: isBlank(c.portals.paymentUrl) ? undefined : c.portals.paymentUrl?.trim(),
    },
  };
}

export type Site = ReturnType<typeof deriveSite>;

export const siteConfig: Site = deriveSite(rawConfig, resolveSiteUrl());
export const serviceAreas = siteConfig.serviceAreas;

/* ───────────────────────────── Navigation & positioning ───────────────────────────── */

export type Pillar = {
  id: "residential" | "commercial" | "construction" | "lender";
  title: string;
  summary: string;
  href: string;
  cta: string;
};

/** The reference site's navigation (maxalley.net/tpm), in its order. */
export const primaryNav = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/careers", label: "Join Our Team" },
  { href: "/about", label: "About" },
  { href: "/spaces", label: "Looking For a Space" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/vendors", label: "Vendors" },
  { href: "/contact", label: "Contact" },
] as const;

/** Audience landing pages: in the utility strip, the menu drawer and the footer. */
export const audienceNav = [
  { href: "/owners", label: "Owners" },
  { href: "/tenants", label: "Tenants" },
  { href: "/commercial", label: "Commercial" },
  { href: "/lenders", label: "Lenders" },
] as const;

export const pillars: readonly Pillar[] = [
  {
    id: "residential",
    title: "Residential Property Management",
    summary:
      "We step into the shoes of property owners and handle every aspect of management, from roof repair to landscaping, so your home stays in first-class condition.",
    href: "/owners",
    cta: "Get a free rental analysis",
  },
  {
    id: "commercial",
    title: "Commercial & CAM",
    summary:
      "Lease management, rent coordination, financial reporting and annual budgets built to keep CAM and related costs under control, with one point of contact for your tenants.",
    href: "/commercial",
    cta: "Explore commercial services",
  },
  {
    id: "construction",
    title: "Construction Management",
    summary:
      "From permits and bids to punch list and close-out, we coordinate architects, engineers and licensed, insured contractors on behalf of landlords and tenants.",
    href: "/commercial#construction",
    cta: "See how we manage builds",
  },
  {
    id: "lender",
    title: "Lender REO & Foreclosure Services",
    summary:
      "A first point of contact for lenders during foreclosure. Properties are renovated, landscaped and cleaned to a high standard before they go to market.",
    href: "/lenders",
    cta: "Talk to us about REO",
  },
];

/** Resolve a site path to an absolute URL on the canonical origin. */
export function absoluteUrl(path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${clean}`;
}
