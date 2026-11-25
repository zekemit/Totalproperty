/** Deployment-environment helpers. Pure functions of an env object so they are testable. */

type Env = Record<string, string | undefined>;

const PRODUCTION_DOMAIN = "https://totalproperty.us";

/**
 * Canonical origin for sitemap, canonical URLs, Open Graph and structured data.
 *  1. NEXT_PUBLIC_SITE_URL, if set (set it to https://totalproperty.us at launch).
 *  2. Otherwise the Vercel project's production alias (e.g. totalproperty.vercel.app),
 *     so a preview before cutover points at itself instead of the live site.
 *  3. Otherwise the real domain (local development).
 */
export function resolveSiteUrl(env: Env = process.env): string {
  const explicit = env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/^https?:\/\//, "").replace(/\/+$/, "")}`;
  return PRODUCTION_DOMAIN;
}

/**
 * Search engines may index the site only when ALLOW_INDEXING=true. The default is
 * "no", so a preview or staging copy can never compete with the live site in search.
 * Set it when DNS is cut over.
 */
export function indexingAllowed(env: Env = process.env): boolean {
  return env.ALLOW_INDEXING?.trim().toLowerCase() === "true";
}

/**
 * Preview mode for forms. When FORMS_PREVIEW_MODE=true AND neither the database nor email
 * is configured, forms show a clearly labelled "preview" success so the site can be
 * demonstrated. It has no effect once real delivery is configured. Remove it at launch.
 */
export function formsPreviewMode(env: Env = process.env): boolean {
  return env.FORMS_PREVIEW_MODE?.trim().toLowerCase() === "true";
}
