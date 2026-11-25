import "server-only";

export type PortalUrls = { owner?: string; tenant?: string; payment?: string };

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
 * Outbound links to the property-management platform (owner login, tenant login,
 * rent payment). Read on the server only; unset or non-https values are dropped
 * so pages fall back to contact instructions instead of rendering a dead or
 * unsafe link. Values are baked in at build time: change them, then redeploy.
 */
export function portalUrls(env: Record<string, string | undefined> = process.env): PortalUrls {
  const out: PortalUrls = {};
  const owner = httpsOnly(env.OWNER_PORTAL_URL);
  const tenant = httpsOnly(env.TENANT_PORTAL_URL);
  const payment = httpsOnly(env.TENANT_PAYMENT_URL);
  if (owner) out.owner = owner;
  if (tenant) out.tenant = tenant;
  if (payment) out.payment = payment;
  return out;
}
