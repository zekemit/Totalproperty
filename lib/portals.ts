import { siteConfig, type Site } from "./site";

export type PortalUrls = { owner?: string; tenant?: string; payment?: string };

type Source = { owner?: string; tenant?: string; payment?: string };

function httpsOnly(value: string | undefined): string | undefined {
  const raw = value?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Outbound links to the property-management platform (owner login, tenant login, rent
 * payment), taken from `portals` in src/config/site.ts. Blank or non-https values are
 * dropped so pages fall back to contact instructions instead of a dead or unsafe link.
 */
export function portalUrls(source: Source = siteConfig.portals): PortalUrls {
  const out: PortalUrls = {};
  const owner = httpsOnly(source.owner);
  const tenant = httpsOnly(source.tenant);
  const payment = httpsOnly(source.payment);
  if (owner) out.owner = owner;
  if (tenant) out.tenant = tenant;
  if (payment) out.payment = payment;
  return out;
}

/** Portal links from the merged (live) site details. */
export function portalUrlsFor(site: Pick<Site, "portals">): PortalUrls {
  return portalUrls(site.portals);
}
