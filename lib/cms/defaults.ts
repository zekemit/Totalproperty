import { PHOTOS } from "@/lib/photos";
import type { PageKey, FullCmsDoc, HomeDoc, ListingStatus, PropertyTypeDoc, ServiceDoc, CareersDoc } from "./schema";

/**
 * The standard content: what the site shows until Rafi changes something in /admin.
 * Every line is taken from the reference site (maxalley.net/tpm) or from the company's previous
 * live site, per MAXALLEY_REFERENCE_AUDIT.md. Nothing here is invented.
 */

export const DEFAULT_ANNOUNCEMENT: FullCmsDoc["announcement"] = {
  enabled: false,
  mode: "bar",
  headline: "",
  body: "",
  ctaLabel: "",
  ctaHref: "",
};

export const DEFAULT_HOME: HomeDoc = {
  heroLines: ["Total Property", "Management"],
  heroLede:
    "Total Property Management provides a “one stop” property management solution for owners, landlords, tenants and lenders. We have designed a customer-driven process that provides total “end to end” management of both commercial and residential property.",
  primaryCta: { label: "Get a free rental analysis", href: "/owners#analysis" },
  secondaryCta: { label: "Tenant portal and repairs", href: "/tenants" },
  statement: "We are pitbulls about our client’s assets",
  valueProps: [
    { title: "One stop", text: "One management solution for owners, landlords, tenants and lenders." },
    { title: "End to end", text: "A customer-driven process that covers both commercial and residential property." },
    { title: "Added value", text: "Landlords are fully looked after, and tenants get peace of mind as we help with their lease maintenance obligations." },
  ],
};

export const DEFAULT_SERVICES: ServiceDoc[] = [
  {
    id: "landlord",
    visible: true,
    title: "Landlord Services",
    audience: "Commercial landlords",
    summary: "We are the first point of contact for all tenants and offer the following services:",
    items: [
      "All Maintenance",
      "Service Contracts",
      "Landscaping",
      "Litter Control",
      "Lot Sweeping",
      "Snow Removal",
      "Lease Management",
      "Financial Reporting",
      "Accounting",
      "Rent Coordination",
      "Rent Delinquency",
      "Annual Budgets",
      "Expense Tracking",
      "Budget Management",
      "Tenant Relations",
      "Security Coordination",
      "Property Emergency",
      "Lease Advertising",
    ],
    image: PHOTOS.typeRetail.src,
    imageAlt: "Landlord services: a curved glass retail and office building at sunset",
    href: "/commercial",
    cta: "Explore commercial services",
  },
  {
    id: "tenant",
    visible: true,
    title: "Tenant Services",
    audience: "Commercial tenants",
    summary:
      "Our added value approach ensures all aspects of the property management are handled for the landlord as well as providing peace of mind for tenants as we assist with lease maintenance obligations:",
    items: [
      "Point of contact for all issues",
      "Ensure adequate communication between client and landlord",
      "Coordinate tenant improvements",
      "Maintenance contracts and services for tenants, such as HVAC and painting",
    ],
    image: PHOTOS.serviceTenant.src,
    imageAlt: "Tenant services: a bright building lobby with seating and tall windows",
    href: "/tenants",
    cta: "Pay rent or report a repair",
  },
  {
    id: "construction",
    visible: true,
    title: "Commercial Construction Services",
    audience: "Landlords and tenants",
    summary: "Our team oversees and coordinates all construction needs for our clients:",
    items: [
      "Secure Bids",
      "Negotiate Contracts",
      "Project Management",
      "Permit Plans",
      "Code Regulated Work",
      "Complete Construction",
      "Progress Reports",
      "Site Job Records",
      "Final Punch Listing",
    ],
    image: PHOTOS.serviceConstruction.src,
    imageAlt: "Construction services: architectural plans, a tape measure and a drill on a workbench",
    href: "/commercial#construction",
    cta: "See how we manage builds",
  },
  {
    id: "residential",
    visible: true,
    title: "Residential Owner Services",
    audience: "Residential owners",
    summary:
      "We step into the shoes of property owners and handle all aspects of management, from roof repair to landscaping, so your home stays in first-class condition.",
    items: ["Free rental analysis", "Roof repair to landscaping", "Day-to-day management", "First-class home upkeep"],
    image: PHOTOS.typeResidential.src,
    imageAlt: "Residential services: apartment buildings with balconies lit at night",
    href: "/owners",
    cta: "Get a free rental analysis",
  },
  {
    id: "lender",
    visible: true,
    title: "Lender and REO Services",
    audience: "Lenders and servicers",
    summary:
      "We are a first point of contact for lenders during foreclosure. Properties are renovated, landscaped and cleaned to a high standard before they go to market.",
    items: [
      "First contact during foreclosure",
      "Renovation",
      "Landscaping and cleaning",
      "Construction management",
      "Agreed sliding scale of costs",
    ],
    image: PHOTOS.serviceLender.src,
    imageAlt: "Lender services: workers in safety vests on a construction site at night",
    href: "/lenders",
    cta: "Talk to us about REO",
  },
  {
    id: "maintenance",
    visible: false,
    title: "Maintenance",
    audience: "Owners, landlords and tenants",
    summary: "Day-to-day upkeep, handled through service contracts and one point of contact.",
    items: ["All Maintenance", "Service Contracts", "Landscaping", "Litter Control", "Lot Sweeping", "Snow Removal", "Property Emergency"],
    image: PHOTOS.serviceMaintenance.src,
    imageAlt: "Maintenance: the inside of a lit industrial building",
    href: "/services",
    cta: "See all services",
  },
  {
    id: "leasing",
    visible: false,
    title: "Leasing",
    audience: "Owners and landlords",
    summary: "Lease management and rent coordination, with help marketing the space.",
    items: ["Lease Management", "Rent Coordination", "Rent Delinquency", "Lease Advertising", "Tenant Relations"],
    image: PHOTOS.typeOffice.src,
    imageAlt: "Leasing: a glass-walled office floor at night",
    href: "/spaces",
    cta: "See available spaces",
  },
];

export const DEFAULT_PROPERTY_TYPES: PropertyTypeDoc[] = [
  { id: "retail", visible: true, title: "Retail", text: "We offer retail management for all multi-tenant and single-tenant retail properties.", image: PHOTOS.typeRetail.src, imageAlt: PHOTOS.typeRetail.alt, href: "/commercial" },
  { id: "industrial", visible: true, title: "Industrial", text: "We offer full services to any type of industrial building.", image: PHOTOS.typeIndustrial.src, imageAlt: PHOTOS.typeIndustrial.alt, href: "/commercial" },
  { id: "marinas", visible: true, title: "Marinas", text: "No matter the type of marina you own, we provide full service.", image: PHOTOS.typeMarina.src, imageAlt: PHOTOS.typeMarina.alt, href: "/commercial" },
  { id: "hospitality", visible: true, title: "Hospitality", text: "To all commercial hospitality properties, we offer full property management and more.", image: PHOTOS.typeHospitality.src, imageAlt: PHOTOS.typeHospitality.alt, href: "/commercial" },
  { id: "office", visible: true, title: "Office", text: "No matter the tenant or use of the office space, we deliver our promise of protecting your assets.", image: PHOTOS.typeOffice.src, imageAlt: PHOTOS.typeOffice.alt, href: "/commercial" },
  { id: "residential", visible: true, title: "Residential", text: "We step into the shoes of property owners and handle every aspect of management, from roof repair to landscaping.", image: PHOTOS.typeResidential.src, imageAlt: PHOTOS.typeResidential.alt, href: "/owners" },
];

export const DEFAULT_CAREERS: CareersDoc = {
  intro:
    "We are hiring experienced and motivated professionals who are passionate about providing a high-quality client experience.",
  jobs: [],
  benefits: [],
};

export const LISTING_STATUS_LABEL: Record<ListingStatus, string> = {
  available: "Available now",
  coming_soon: "Coming soon",
  application_pending: "Application pending",
  leased: "Recently leased",
};

/* ───────────── SEO defaults ───────────── */

export const PAGE_LABELS: Record<PageKey, { label: string; path: string }> = {
  home: { label: "Home", path: "/" },
  services: { label: "Services", path: "/services" },
  owners: { label: "Owners (ads landing page)", path: "/owners" },
  tenants: { label: "Tenants (ads landing page)", path: "/tenants" },
  commercial: { label: "Commercial", path: "/commercial" },
  lenders: { label: "Lenders", path: "/lenders" },
  about: { label: "About", path: "/about" },
  contact: { label: "Contact", path: "/contact" },
  vendors: { label: "Vendors", path: "/vendors" },
  careers: { label: "Join Our Team", path: "/careers" },
  spaces: { label: "Looking For a Space", path: "/spaces" },
  newsletter: { label: "Newsletter", path: "/newsletter" },
  portal: { label: "Portal login", path: "/portal" },
};

type SeoInput = { name: string; areasPhrase: string; place: string };

/** Title and description for each page, built from the business details so they stay accurate. */
export function defaultSeoPages({ name, areasPhrase, place }: SeoInput): Record<PageKey, { title: string; description: string }> {
  const t = (lead: string) => `${lead} | ${name}`;
  return {
    home: {
      title: t(`Property Management in ${place}`),
      description: `${name} is a one-stop property management team for owners, landlords, tenants and lenders across ${areasPhrase}.`,
    },
    services: {
      title: t("Property Management Services"),
      description: `Landlord, tenant, commercial construction, residential owner and lender REO services from one accountable team serving ${areasPhrase}.`,
    },
    owners: {
      title: t("Landlord & Rental Property Management"),
      description: `Own a rental home in ${areasPhrase}? Get a free rental analysis, see what vacancy costs you, and hand day-to-day management to ${name}.`,
    },
    tenants: {
      title: t("Tenant Portal, Rent Payment & Repairs"),
      description: `Pay rent, report a repair or find your tenant portal. ${name} is one place to turn for every issue, in ${areasPhrase}.`,
    },
    commercial: {
      title: t("Commercial Property Management & CAM"),
      description: `Lease management, rent coordination, CAM budgets and construction management for commercial landlords and tenants in ${areasPhrase}.`,
    },
    lenders: {
      title: t("Lender REO & Foreclosure Property Services"),
      description: `A first point of contact for lenders during foreclosure. Properties renovated, landscaped and cleaned before they go to market, across ${areasPhrase}.`,
    },
    about: {
      title: `About ${name} | ${place}`,
      description: `${name} gives owners, landlords, tenants and lenders one team for end-to-end management of commercial and residential property across ${areasPhrase}.`,
    },
    contact: {
      title: `Contact ${name} | ${place}`,
      description: `Call, email or send a message to ${name} in ${place}. We serve ${areasPhrase}.`,
    },
    vendors: {
      title: t("Vendor Partnerships"),
      description: `Contractors and trade professionals: join the vendor network of ${name} serving ${areasPhrase}.`,
    },
    careers: {
      title: t("Careers: Join Our Team"),
      description: `${name} is hiring experienced, motivated professionals who care about a high-quality client experience in ${areasPhrase}.`,
    },
    spaces: {
      title: t("Commercial & Residential Space for Lease"),
      description: `Looking for a space? See properties available through ${name} in ${areasPhrase}, or tell us what you need.`,
    },
    newsletter: {
      title: t("Newsletter"),
      description: `Get an email when ${name} publishes an article or an update.`,
    },
    portal: {
      title: t("Owner & Tenant Portal Login"),
      description: `Find the ${name} owner and tenant portals, rent payment and maintenance requests in one place.`,
    },
  };
}

/** Local keywords used for structured data and (harmlessly) the keywords meta tag. */
export function defaultKeywords(place: string): string[] {
  return [
    `property management ${place}`,
    "Loudoun County property management",
    "Northern Virginia property management",
    "commercial property management",
    "rental property management",
    "CAM management",
    "REO property services",
  ];
}
