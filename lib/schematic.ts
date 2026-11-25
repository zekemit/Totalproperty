import { commercialLandlord, commercialTenant, lenderServices, ownerServices } from "@/lib/catalog";
import type { BuildingKind } from "@/components/site/buildings";

/**
 * The company's own diagram (originally a GIF) connects four client types, through one
 * team, to seven functions. Which functions each client uses is mapped here only from
 * services the company already publishes (src: lib/catalog.ts), so nothing is invented.
 */
export const FUNCTIONS = ["Maintenance", "Renovation", "Repair", "CAM", "Security", "Landscaping", "Accounting"] as const;
export type FunctionName = (typeof FUNCTIONS)[number];

/** Pick catalogue lines by index, so the panel shows the services that justify each lit function. */
const pick = (items: readonly string[], indices: readonly number[]) => indices.flatMap((i) => (items[i] ? [items[i]] : []));

export type Client = {
  id: BuildingKind;
  name: string;
  kind: string;
  href: string;
  summary: string;
  /** Functions highlighted in the foundation when this client is selected. */
  uses: readonly FunctionName[];
  bullets: readonly string[];
  cta: string;
};

export const CLIENTS: readonly Client[] = [
  {
    id: "owners",
    name: "Owners",
    kind: "Residential",
    href: "/owners",
    // "from roof repair to landscaping" -> Repair, Landscaping; "first-class condition" -> Maintenance.
    uses: ["Maintenance", "Repair", "Landscaping"],
    summary: "We step into the shoes of property owners and handle every aspect of management, from roof repair to landscaping.",
    bullets: ownerServices.items,
    cta: "Get a free rental analysis",
  },
  {
    id: "commercial",
    name: "Commercial landlords",
    kind: "Retail and office",
    href: "/commercial",
    // Service contracts (landscaping, lot care) -> Maintenance, Landscaping; budgets to minimise CAM -> CAM;
    // security coordination -> Security; financial reporting and accounting -> Accounting.
    uses: ["Maintenance", "Landscaping", "Security", "CAM", "Accounting"],
    summary: "One point of contact for your tenants, with budgets and expense tracking built to keep CAM under control.",
    // One line per lit function: first contact, maintenance and service contracts (Maintenance, Landscaping),
    // financial reporting (Accounting), annual budgets to minimise CAM (CAM), security coordination (Security).
    bullets: pick(commercialLandlord.items, [0, 1, 3, 5, 7]),
    cta: "Explore commercial services",
  },
  {
    id: "lenders",
    name: "Lenders",
    kind: "REO and foreclosure",
    href: "/lenders",
    // "renovated, landscaped and cleaned" -> Renovation, Landscaping, Maintenance.
    uses: ["Renovation", "Landscaping", "Maintenance"],
    summary: "A first point of contact during foreclosure, with properties renovated, landscaped and cleaned before they go to market.",
    bullets: lenderServices.items,
    cta: "Talk to us about REO",
  },
  {
    id: "tenants",
    name: "Tenants",
    kind: "Residential and commercial",
    href: "/tenants",
    // HVAC, painting and decorating -> Maintenance, Repair; coordination of tenant improvements -> Renovation.
    uses: ["Maintenance", "Repair", "Renovation"],
    summary: "A single place to turn for every issue, and a partner in meeting lease obligations.",
    bullets: commercialTenant.items,
    cta: "Pay rent or report a repair",
  },
];
