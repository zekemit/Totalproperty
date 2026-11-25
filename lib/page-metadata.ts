import type { Metadata } from "next";
import { getContent } from "@/lib/cms/content";
import { PAGE_LABELS } from "@/lib/cms/defaults";
import type { PageKey } from "@/lib/cms/schema";

/**
 * Title, description, canonical URL, Open Graph and Twitter tags for a page, taken from the SEO tab
 * of /admin (or the standard wording). Titles are used exactly as written: no suffix is appended.
 */
export async function pageMetadata(key: PageKey): Promise<Metadata> {
  const { seo, site } = await getContent();
  const { title, description } = seo.pages[key];
  const path = PAGE_LABELS[key].path;
  return {
    title: { absolute: title },
    description,
    keywords: seo.keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: site.name, locale: "en_US", title, description, url: path },
    twitter: { card: "summary_large_image", title, description },
  };
}
