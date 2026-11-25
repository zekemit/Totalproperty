import type { MetadataRoute } from "next";
import { indexingAllowed } from "@/lib/env";
import { buildSitemap } from "@/lib/seo";
import { PAGE_LABELS } from "@/lib/cms/defaults";
import { PAGE_KEYS } from "@/lib/cms/schema";
import { getContent } from "@/lib/cms/content";

/** Priority by page. Everything in PAGE_LABELS is public; /admin is deliberately not in that list. */
const PRIORITY: Record<(typeof PAGE_KEYS)[number], number> = {
  home: 1,
  owners: 0.9,
  commercial: 0.9,
  services: 0.8,
  lenders: 0.8,
  tenants: 0.8,
  spaces: 0.7,
  contact: 0.7,
  about: 0.6,
  careers: 0.5,
  vendors: 0.5,
  newsletter: 0.4,
  portal: 0.4,
};

const LEGAL = ["/privacy", "/accessibility", "/fair-housing"] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { site } = await getContent();
  const routes = [
    ...PAGE_KEYS.map((k) => ({ path: PAGE_LABELS[k].path, priority: PRIORITY[k] })),
    ...LEGAL.map((path) => ({ path, priority: 0.2 })),
  ];
  return buildSitemap(indexingAllowed(), site.url, routes);
}
