/**
 * Single source of truth for company facts, navigation and positioning.
 *
 * RULE: only facts verified from the company's own live site (audit §2.1) are
 * hard-coded. Anything unverified — licenses, leadership, founding year — is an
 * optional field that is empty by default; pages render those sections only
 * when they are populated. Fill them in once the client confirms the facts.
 */

export type ServiceArea = { code: "VA" | "MD" | "PA" | "DC"; name: string };

export type License = {
  jurisdiction: string;
  number: string;
  holder?: string;
  /** Public regulator lookup page for this license. */
  verifyUrl?: string;
};

export type Leader = { name: string; title: string; bio?: string };

export type Pillar = {
  id: "residential" | "commercial" | "construction" | "lender";
  title: string;
  summary: string;
  href: string;
  cta: string;
};

export const serviceAreas: readonly ServiceArea[] = [
  { code: "VA", name: "Virginia" },
  { code: "MD", name: "Maryland" },
  { code: "PA", name: "Pennsylvania" },
  { code: "DC", name: "Washington, DC" },
];

export const siteConfig = {
  name: "Total Property Management",
  shortName: "Total Property",
  /** The company's own line from its current site; used sparingly, owner-facing only. */
  tagline: "We are pitbulls about our client's assets.",
  description:
    "Total Property Management is a one-stop property management team for owners, commercial landlords, tenants and lenders across Virginia, Maryland, Pennsylvania and the DC area.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://totalproperty.us").replace(/\/+$/, ""),
  phone: "202-528-0140",
  phoneHref: "tel:+12025280140",
  email: "info@totalproperty.us",
  address: { poBox: "PO Box 95", locality: "Purcellville", region: "VA", postalCode: "20132" },
  /** Unverified until the client supplies them — see README "Launch blockers". */
  licenses: [] as License[],
  leadership: [] as Leader[],
  foundedYear: undefined as number | undefined,
} as const;

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/owners", label: "Owners" },
  { href: "/commercial", label: "Commercial" },
  { href: "/lenders", label: "Lenders" },
  { href: "/tenants", label: "Tenants" },
  { href: "/about", label: "About" },
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
