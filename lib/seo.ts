import type { MetadataRoute } from "next";

export function buildRobots(allowIndexing: boolean, siteUrl: string): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: [{ userAgent: "*", disallow: "/" }] };
  // /admin and its API are never crawled, even once the public site is open to search engines.
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] }], sitemap: `${siteUrl}/sitemap.xml` };
}

export type RouteEntry = { path: string; priority: number };

/** An empty sitemap while indexing is off: there is nothing to submit to search engines yet. */
export function buildSitemap(allowIndexing: boolean, siteUrl: string, routes: readonly RouteEntry[]): MetadataRoute.Sitemap {
  if (!allowIndexing) return [];
  return routes.map((r) => ({ url: `${siteUrl}${r.path}`, changeFrequency: "monthly" as const, priority: r.priority }));
}
