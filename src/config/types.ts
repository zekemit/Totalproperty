/** Shapes for src/config/site.ts. Editing business information never requires touching this file. */

export type StateCode = "VA" | "MD" | "PA" | "DC";

/** A photo stored in /public. `width` and `height` are the image's real pixel size. */
export type Photo = { src: string; width: number; height: number; alt: string };

export type License = {
  state: StateCode;
  /** Leave blank until confirmed; blank entries are never shown on the site. */
  number: string;
  /** Who holds it, if different from the company (e.g. the principal broker). */
  holderName?: string;
  /** e.g. "Firm license", "Principal broker license". Shown instead of the word "license". */
  licenseType?: string;
  /** The regulator's public lookup page for this license. Must start with https://. */
  verifyUrl?: string;
};

export type Leader = { name: string; title: string; bio?: string; photo?: Photo };

export type Testimonial = { quote: string; name: string; detail?: string };

export type ServiceArea = {
  code: StateCode;
  name: string;
  /** false hides this jurisdiction everywhere (badges, copy, structured data). */
  featured: boolean;
};

export type SiteConfig = {
  company: {
    name: string;
    legalName?: string;
    tagline: string;
    description: string;
    foundedYear?: number;
  };
  contact: {
    phone: string;
    /** After-hours or emergency maintenance line, if it differs from the main number. */
    emergencyPhone?: string;
    email: string;
    /** Free text shown on the Contact page, e.g. "Monday to Friday, 8:30 a.m. to 5 p.m." */
    hours?: string;
  };
  address: {
    poBox: string;
    /** Physical office address. When set, the site says "our office is at ..." and lists it. */
    street?: string;
    locality: string;
    region: string;
    postalCode: string;
  };
  serviceAreas: ServiceArea[];
  /** Optional extra detail, e.g. "Loudoun, Fauquier and Frederick counties". */
  serviceAreaDetail?: string;
  licenses: License[];
  leadership: Leader[];
  testimonials: Testimonial[];
  propertyPhotos: Photo[];
  portals: {
    ownerUrl?: string;
    tenantUrl?: string;
    /** Rent payment page. */
    paymentUrl?: string;
  };
};
