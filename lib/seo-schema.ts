import type { Content } from "@/lib/cms/content";
import { PHOTOS } from "@/lib/photos";

/**
 * schema.org structured data for the whole business, built from the live content
 * (company details, services, hours) so it can never drift from what the page says.
 *
 * Deliberately left out because we have no verified data for them: geo coordinates (no street
 * address), aggregateRating / review (self-serving reviews are not eligible for rich results),
 * priceRange and sameAs profiles. Add them once they exist.
 */

type Json = Record<string, unknown>;

const STATE_TYPE = (code: string) => (code === "DC" ? "AdministrativeArea" : "State");

function areaServed(c: Content): Json[] {
  const s = c.site;
  const seen = new Set<string>();
  const out: Json[] = [];
  const add = (type: string, name: string) => {
    const key = name.toLowerCase();
    if (!name || seen.has(key)) return;
    seen.add(key);
    out.push({ "@type": type, name });
  };
  // The office is in Purcellville, which is in Loudoun County, in Northern Virginia.
  add("City", `${s.address.locality}, ${s.address.region}`);
  add("AdministrativeArea", "Loudoun County, VA");
  add("AdministrativeArea", "Northern Virginia");
  for (const a of s.serviceAreas) add(STATE_TYPE(a.code), a.name);
  if (s.serviceAreaDetail) {
    for (const part of s.serviceAreaDetail.split(/,| and /).map((p) => p.trim()).filter(Boolean)) add("AdministrativeArea", part);
  }
  return out;
}

export function localBusinessJsonLd(c: Content): Json {
  const s = c.site;
  return {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "RealEstateAgent"],
    "@id": `${s.url}/#business`,
    name: s.name,
    ...(s.legalName !== s.name ? { legalName: s.legalName } : {}),
    url: s.url,
    description: s.description,
    slogan: s.tagline,
    logo: `${s.url}${PHOTOS.mark.src}`,
    image: `${s.url}${PHOTOS.logoHorizontal.src}`,
    telephone: s.phoneHref.replace("tel:", ""),
    email: s.email,
    ...(s.foundedYear ? { foundingDate: String(s.foundedYear) } : {}),
    address: {
      "@type": "PostalAddress",
      postOfficeBoxNumber: s.address.poBox,
      ...(s.address.street ? { streetAddress: s.address.street } : {}),
      addressLocality: s.address.locality,
      addressRegion: s.address.region,
      postalCode: s.address.postalCode,
      addressCountry: "US",
    },
    areaServed: areaServed(c),
    contactPoint: [
      { "@type": "ContactPoint", contactType: "customer service", telephone: s.phoneHref.replace("tel:", ""), email: s.email, areaServed: "US", availableLanguage: "English" },
    ],
    ...(c.hoursSpecs.length > 0 ? { openingHoursSpecification: c.hoursSpecs } : {}),
    ...(c.services.length > 0
      ? {
          hasOfferCatalog: {
            "@type": "OfferCatalog",
            name: `${s.name} services`,
            itemListElement: c.services.map((svc) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: svc.title,
                ...(svc.summary ? { description: svc.summary } : {}),
                ...(svc.audience ? { audience: { "@type": "Audience", audienceType: svc.audience } } : {}),
                provider: { "@id": `${s.url}/#business` },
                areaServed: s.areaNames,
              },
            })),
          },
        }
      : {}),
    keywords: c.seo.keywords.join(", "),
    knowsAbout: c.services.map((x) => x.title),
  };
}

/** BreadcrumbList for an interior page. */
export function breadcrumbJsonLd(c: Content, trail: readonly { name: string; path: string }[]): Json {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, item: `${c.site.url}${t.path}` })),
  };
}
