/**
 * Service catalogue. Transcribed from the company's current services page
 * (originally an image, so invisible to search and screen readers) and lightly
 * edited for the web. No claims beyond what the company already publishes.
 */

export type CatalogSection = { id: string; title: string; audience: string; items: readonly string[] };

export const commercialLandlord: CatalogSection = {
  id: "landlord",
  title: "Landlord services",
  audience: "Commercial landlords",
  items: [
    "First point of contact for all tenant liaison",
    "Management of maintenance and service contracts: landscaping, litter control, lot sweeping, snow removal and more",
    "Lease management",
    "Financial reporting and accounting",
    "Rent coordination, including a rent delinquency process",
    "Annual budgets and ongoing expenditure tracking to minimize CAM and other associated costs",
    "Tenant relations",
    "Security coordination",
    "Property emergency management",
    "Assistance with marketing, leasing and advertising",
  ],
};

export const commercialTenant: CatalogSection = {
  id: "tenant",
  title: "Tenant services",
  audience: "Commercial tenants",
  items: [
    "First point of contact for every issue",
    "Clear communication between tenant and landlord",
    "Maintenance support to help tenants meet ongoing lease obligations, such as HVAC service, painting and decorating",
    "Coordination of tenant improvements",
  ],
};

export const construction: CatalogSection = {
  id: "construction",
  title: "Commercial construction services",
  audience: "Landlords and tenants",
  items: [
    "Oversight and coordination of architectural and engineering services, contracts and building permits",
    "Construction bids from licensed, insured general contractors, adopting LEED criteria where feasible",
    "Negotiation of final construction contracts",
    "Day-to-day project management for the entire construction period",
    "Verification that all work follows permit plans and specifications",
    "Job-site records and progress reports",
    "Confirmation that all work meets local codes and regulations",
    "Negotiation of change-order requests with the general contractor",
    "Final punch list issued to the contractor",
    "Completion and close-out of all construction work",
  ],
};

export const lenderServices: CatalogSection = {
  id: "lender",
  title: "Lender services",
  audience: "Lenders and servicers",
  items: [
    "First contact for lenders during the foreclosure process, so the property is presented well",
    "Foreclosure properties renovated, landscaped and cleaned to the highest standards before marketing for sale",
    "All services offered in line with an agreed sliding scale of costs",
    "Traditional construction management, including liaison with architects, engineers and contractors for permits and approvals",
  ],
};

export const ownerServices: CatalogSection = {
  id: "owner",
  title: "Owner services",
  audience: "Residential owners",
  items: [
    "We step into the shoes of property owners to handle all aspects of management, from roof repair to landscaping",
    "A residential management package that removes the day-to-day stress from owners and lets our professional team keep your home in first-class condition",
  ],
};
