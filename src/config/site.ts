/**
 * ═══════════════════════════════════════════════════════════════════════════
 *  TOTAL PROPERTY MANAGEMENT: BUSINESS INFORMATION
 *  This is the ONE file to edit when the business details arrive.
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  How it works
 *  - Anything marked PENDING is blank on purpose. The website hides a section
 *    until its information is filled in, so a blank value never looks broken.
 *  - Anything marked VERIFIED came from the company's own current website.
 *  - After editing, commit and push to `main`. Vercel redeploys automatically.
 *
 *  What shows up once you fill it in
 *  - licenses      -> footer, About page, and a badge on the homepage
 *  - leadership    -> a "Leadership" section on the About page
 *  - testimonials  -> a "What clients say" section on the homepage and About page
 *  - propertyPhotos-> a photo gallery on the About page
 *  - portals       -> "Owner portal" / "Tenant portal" / "Pay rent" buttons
 *  - address.street-> "Our office is at ..." wording and the office address
 *  - hours         -> Contact page
 *
 *  Photos: put image files in the /public/photos folder and refer to them as
 *  "/photos/your-file.jpg". Give each its real pixel width and height.
 */

import type { SiteConfig } from "./types";

export const siteConfig: SiteConfig = {
  // ── 1. COMPANY ─────────────────────────────────────────────────────────────
  company: {
    // VERIFIED (live site)
    name: "Total Property Management",
    // PENDING: the exact legal name as registered with the state. The current site
    // uses "Total Property Management", "Total Property" and "Total Properties".
    // Used in the footer copyright and the privacy policy when set.
    legalName: "",
    // VERIFIED (live site). Shown on the Owners and About pages.
    tagline: "We are pitbulls about our client's assets.",
    description:
      "Total Property Management is a one-stop property management team for owners, commercial landlords, tenants and lenders across Virginia, Maryland, Pennsylvania and the DC area.",
    // PENDING: the year the company started, e.g. 2009. The old site's copyright
    // reads 2009-2021, which suggests 2009, but confirm before publishing.
    foundedYear: undefined,
  },

  // ── 2. CONTACT ─────────────────────────────────────────────────────────────
  contact: {
    // VERIFIED (live site)
    phone: "202-528-0140",
    // PENDING (optional): a separate after-hours / emergency maintenance number.
    // Leave blank to use the main number for emergencies.
    emergencyPhone: "",
    // VERIFIED (live site)
    email: "info@totalproperty.us",
    // PENDING (optional): e.g. "Monday to Friday, 8:30 a.m. to 5:00 p.m."
    hours: "",
  },

  // ── 3. OFFICE ADDRESS ──────────────────────────────────────────────────────
  address: {
    // VERIFIED (live site): the only address the company publishes today.
    poBox: "PO Box 95",
    // PENDING: a street address for the office, if clients can visit or the team
    // works from one. While this is blank the site says "based in Purcellville"
    // and shows only the mailing address; it never claims a walk-in office.
    // (A PO box can't be used for a Google Business Profile map listing.)
    street: "",
    locality: "Purcellville",
    region: "VA",
    postalCode: "20132",
  },

  // ── 4. SERVICE AREAS ───────────────────────────────────────────────────────
  // VERIFIED (live site): "Virginia, Maryland, Pennsylvania and the DC area".
  // Set `featured: false` to hide a jurisdiction everywhere, for example one where
  // a license isn't in place yet. The page copy updates automatically.
  serviceAreas: [
    { code: "VA", name: "Virginia", featured: true },
    { code: "MD", name: "Maryland", featured: true },
    { code: "PA", name: "Pennsylvania", featured: true },
    { code: "DC", name: "Washington, DC", featured: true },
  ],
  // PENDING (optional): finer detail, e.g. "Loudoun, Fauquier and Frederick counties".
  serviceAreaDetail: "",

  // ── 5. LICENSES ────────────────────────────────────────────────────────────
  // PENDING: one entry per jurisdiction where the company (or its broker) is licensed.
  // Leave `number` blank until confirmed; blank entries are not displayed.
  // `verifyUrl` is the regulator's public lookup page (optional, must be https://).
  licenses: [
    { state: "VA", number: "", holderName: "", licenseType: "", verifyUrl: "" },
    { state: "MD", number: "", holderName: "", licenseType: "", verifyUrl: "" },
    { state: "PA", number: "", holderName: "", licenseType: "", verifyUrl: "" },
    { state: "DC", number: "", holderName: "", licenseType: "", verifyUrl: "" },
  ],

  // ── 6. LEADERSHIP ──────────────────────────────────────────────────────────
  // PENDING: add the people clients should know. Example (delete the slashes):
  //   {
  //     name: "Jane Smith",
  //     title: "Principal Broker",
  //     bio: "Two sentences about Jane's background.",
  //     photo: { src: "/photos/jane-smith.jpg", width: 800, height: 800, alt: "Jane Smith" },
  //   },
  // Only say "family-owned" or "family-backed" anywhere once this is confirmed.
  leadership: [],

  // ── 7. TESTIMONIALS ────────────────────────────────────────────────────────
  // PENDING: real client quotes, each with the client's permission. Example:
  //   { quote: "They handled everything.", name: "J. Doe", detail: "Property owner, Leesburg" },
  testimonials: [],

  // ── 8. PROPERTY PHOTOS ─────────────────────────────────────────────────────
  // PENDING: photos of properties the company manages (shown on the About page).
  // Example:
  //   { src: "/photos/main-street-retail.jpg", width: 1600, height: 1067, alt: "Retail center on Main Street" },
  propertyPhotos: [],

  // ── 9. PORTAL AND PAYMENT LINKS ────────────────────────────────────────────
  // PENDING: the sign-in and rent-payment pages of the property-management software
  // once it is chosen. Must start with https://. While blank, the pages show the phone
  // number and email instead of a button.
  portals: {
    ownerUrl: "",
    tenantUrl: "",
    paymentUrl: "",
  },
};
