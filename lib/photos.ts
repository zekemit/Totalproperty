/**
 * The photo library bundled in /public/photos. Used as defaults by the CMS and as the
 * "pick from the library" choices in /admin. Dimensions are the real pixel sizes.
 *
 * Provenance note (see MAXALLEY_REFERENCE_AUDIT.md): these came from the reference site and
 * look like stock or rendered imagery, not the company's own buildings. Alt text describes the
 * picture only, and captions never imply a photo is a client's property.
 */
export type LibraryPhoto = { src: string; width: number; height: number; alt: string; label: string };

export const PHOTOS = {
  mark: { src: "/photos/tpm-mark.webp", width: 420, height: 573, alt: "", label: "Logo mark" },
  logoHorizontal: { src: "/photos/tpm-logo-horizontal.webp", width: 900, height: 351, alt: "Total Property Management", label: "Logo" },

  slideOffice: { src: "/photos/slide-office.webp", width: 1280, height: 853, alt: "A busy open-plan office with warm desk lamps and floor-to-ceiling windows", label: "Office interior" },
  slideRetail: { src: "/photos/slide-retail.webp", width: 1280, height: 853, alt: "A two-storey glass-fronted retail building lit at dusk", label: "Retail building" },
  slideCondos: { src: "/photos/slide-condos.webp", width: 1280, height: 853, alt: "Two residential towers glowing against an evening sky", label: "Residential towers" },
  slideIndustrial: { src: "/photos/slide-industrial.webp", width: 1280, height: 853, alt: "A modern industrial warehouse with a wide loading apron at night", label: "Industrial building" },

  typeRetail: { src: "/photos/type-retail.webp", width: 1100, height: 733, alt: "A curved glass retail and office building at sunset", label: "Retail" },
  typeIndustrial: { src: "/photos/type-industrial.webp", width: 1100, height: 733, alt: "An industrial building with roll-up doors beneath a dramatic sky", label: "Industrial" },
  typeMarina: { src: "/photos/type-marina.webp", width: 1100, height: 733, alt: "Sailboats moored in a calm marina at dusk", label: "Marina" },
  typeHospitality: { src: "/photos/type-hospitality.webp", width: 1100, height: 732, alt: "A resort courtyard and pool seen from above at night", label: "Hospitality" },
  typeOffice: { src: "/photos/type-office.webp", width: 1100, height: 733, alt: "A glass-walled office floor at night", label: "Office" },
  typeResidential: { src: "/photos/type-residential.webp", width: 1100, height: 733, alt: "Apartment buildings with balconies lit at night", label: "Residential" },

  serviceTenant: { src: "/photos/service-tenant.webp", width: 1100, height: 619, alt: "A bright building lobby with seating and tall windows", label: "Lobby" },
  serviceConstruction: { src: "/photos/service-construction.webp", width: 1100, height: 733, alt: "Architectural plans, a tape measure and a drill on a workbench", label: "Plans and tools" },
  serviceLender: { src: "/photos/service-lender.webp", width: 1100, height: 733, alt: "Workers in safety vests on a construction site at night", label: "Construction site" },
  serviceMaintenance: { src: "/photos/service-maintenance.webp", width: 1100, height: 733, alt: "The inside of a lit industrial building", label: "Building interior" },

  team1: { src: "/photos/team-01.webp", width: 960, height: 640, alt: "Two colleagues reviewing a tablet in a bright corridor", label: "Colleagues" },
  team2: { src: "/photos/team-02.webp", width: 960, height: 640, alt: "People working over documents and a laptop", label: "Desk work" },
  team3: { src: "/photos/team-03.webp", width: 960, height: 639, alt: "A team meeting in front of a whiteboard", label: "Team meeting" },
  team4: { src: "/photos/team-04.webp", width: 960, height: 640, alt: "A handshake across a desk", label: "Handshake" },
} as const satisfies Record<string, LibraryPhoto>;

/** Photos offered in the admin picker (logos excluded). */
export const LIBRARY: readonly LibraryPhoto[] = Object.entries(PHOTOS)
  .filter(([key]) => key !== "mark" && key !== "logoHorizontal")
  .map(([, p]) => p);
