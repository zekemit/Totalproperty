import type { FullCmsDoc } from "./schema";

const clean = (list: readonly string[]) => list.map((s) => s.trim()).filter((s) => s !== "");

/**
 * Tidy a document before validating it: drop blank lines from the "one per line" lists and trim
 * the headline. Runs in the browser (so the preview matches) and again on the server.
 */
export function normalizeDoc(doc: FullCmsDoc): FullCmsDoc {
  return {
    ...doc,
    home: { ...doc.home, heroLines: clean(doc.home.heroLines) },
    services: doc.services.map((s) => ({ ...s, items: clean(s.items) })),
    careers: { ...doc.careers, benefits: clean(doc.careers.benefits) },
    seo: { ...doc.seo, keywords: clean(doc.seo.keywords) },
  };
}
