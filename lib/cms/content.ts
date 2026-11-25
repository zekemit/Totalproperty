import { cache } from "react";
import { siteConfig as baseConfig } from "@config/site";
import type { SiteConfig } from "@config/types";
import { resolveStorage } from "@/lib/cms-storage";
import { resolveSiteUrl } from "@/lib/env";
import { deriveSite, type Site } from "@/lib/site";
import {
  DEFAULT_ANNOUNCEMENT,
  DEFAULT_CAREERS,
  DEFAULT_HOME,
  DEFAULT_PROPERTY_TYPES,
  DEFAULT_SERVICES,
  defaultKeywords,
  defaultSeoPages,
} from "./defaults";
import { formatHours, hoursSpecs } from "./hours";
import { DAYS, PAGE_KEYS, cmsDocSchema, type CmsDoc, type FullCmsDoc, type HomeDoc, type PageKey } from "./schema";

/**
 * Turns what the admin saved (a sparse CmsDoc) into what the pages render: the standard content
 * from src/config/site.ts and lib/cms/defaults.ts, with Rafi's edits layered on top.
 *
 * Everything here is pure except `getContent`, which reads storage once per request.
 * The result is cached by the static renderer, and /admin calls revalidatePath on every save.
 */

export type Content = {
  site: Site;
  /** Present only when the announcement is switched on and has a headline. */
  announcement: (FullCmsDoc["announcement"] & { id: string }) | null;
  home: HomeDoc;
  /** Visible services, in the order Rafi set. */
  services: FullCmsDoc["services"];
  propertyTypes: FullCmsDoc["propertyTypes"];
  listings: FullCmsDoc["listings"];
  careers: FullCmsDoc["careers"];
  hoursSpecs: ReturnType<typeof hoursSpecs>;
  seo: { pages: Record<PageKey, { title: string; description: string }>; keywords: string[] };
};

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const or = (value: string | undefined, fallback: string) => (value && value.trim() !== "" ? value : fallback);

function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Base config with the company-tab edits applied. */
export function mergeSiteConfig(base: SiteConfig, company: CmsDoc["company"]): SiteConfig {
  if (!company) return base;
  const hoursText = [formatHours(company.hours), company.hoursNote].filter(Boolean).join(". ");
  return {
    ...base,
    contact: {
      phone: or(company.phone, base.contact.phone),
      emergencyPhone: or(company.emergencyPhone, base.contact.emergencyPhone ?? ""),
      email: or(company.email, base.contact.email),
      hours: hoursText || base.contact.hours,
    },
    serviceAreaDetail: or(company.serviceAreaDetail, base.serviceAreaDetail ?? ""),
    licenses: company.licenses,
    testimonials: company.testimonials.map(({ quote, name, detail }) => ({ quote, name, ...(detail ? { detail } : {}) })),
    portals: {
      ownerUrl: or(company.portals.ownerUrl, base.portals.ownerUrl ?? ""),
      tenantUrl: or(company.portals.tenantUrl, base.portals.tenantUrl ?? ""),
      paymentUrl: or(company.portals.paymentUrl, base.portals.paymentUrl ?? ""),
    },
  };
}

/** Never throws: an invalid merged config (which save-time validation should prevent) falls back to the standard one. */
function safeDerive(config: SiteConfig, url: string): Site {
  try {
    return deriveSite(config, url);
  } catch (error) {
    console.error("[cms] merged company details were invalid; using the standard details", error instanceof Error ? error.message : "");
    return deriveSite(baseConfig, url);
  }
}

/** Every section filled in: the standard values wherever nothing was saved. This is what /admin edits. */
export function effectiveDoc(doc: CmsDoc, base: SiteConfig = baseConfig, url = resolveSiteUrl()): FullCmsDoc {
  const site = safeDerive(mergeSiteConfig(base, doc.company), url);
  const seoDefaults = defaultSeoPages(site);
  const h = doc.home;
  const lines = h?.heroLines.map((l) => l.trim()).filter(Boolean) ?? [];

  const cta = (saved: { label: string; href: string } | undefined, fallback: { label: string; href: string }) =>
    saved && saved.label && saved.href ? saved : fallback;

  const licenseStates = ["VA", "MD", "PA", "DC"] as const;
  const savedLicenses = doc.company?.licenses ?? base.licenses.map((l) => ({ ...l, holderName: l.holderName ?? "", licenseType: l.licenseType ?? "", verifyUrl: l.verifyUrl ?? "" }));
  const licenses = [
    ...savedLicenses,
    ...licenseStates.filter((s) => !savedLicenses.some((l) => l.state === s)).map((state) => ({ state, number: "", holderName: "", licenseType: "", verifyUrl: "" })),
  ];

  return {
    announcement: doc.announcement ?? clone(DEFAULT_ANNOUNCEMENT),
    home: {
      heroLines: lines.length > 0 ? lines : [...DEFAULT_HOME.heroLines],
      heroLede: or(h?.heroLede, DEFAULT_HOME.heroLede),
      primaryCta: cta(h?.primaryCta, DEFAULT_HOME.primaryCta),
      secondaryCta: cta(h?.secondaryCta, DEFAULT_HOME.secondaryCta),
      statement: or(h?.statement, DEFAULT_HOME.statement),
      valueProps: h?.valueProps ?? clone(DEFAULT_HOME.valueProps),
    },
    services: doc.services ?? clone(DEFAULT_SERVICES),
    propertyTypes: doc.propertyTypes ?? clone(DEFAULT_PROPERTY_TYPES),
    listings: doc.listings ?? [],
    company: {
      phone: site.phone,
      emergencyPhone: doc.company?.emergencyPhone ?? base.contact.emergencyPhone ?? "",
      email: site.email,
      hours: DAYS.map((day) => doc.company?.hours.find((r) => r.day === day) ?? { day, open: "", close: "" }),
      hoursNote: doc.company?.hoursNote ?? "",
      serviceAreaDetail: site.serviceAreaDetail ?? "",
      licenses,
      testimonials:
        doc.company?.testimonials ??
        base.testimonials.map((t, i) => ({ id: `t${i + 1}`, quote: t.quote, name: t.name, detail: t.detail ?? "" })),
      portals: {
        ownerUrl: site.portals.owner ?? "",
        tenantUrl: site.portals.tenant ?? "",
        paymentUrl: site.portals.payment ?? "",
      },
    },
    careers: doc.careers ?? clone(DEFAULT_CAREERS),
    seo: {
      pages: Object.fromEntries(
        PAGE_KEYS.map((k) => [
          k,
          { title: or(doc.seo?.pages?.[k]?.title, seoDefaults[k].title), description: or(doc.seo?.pages?.[k]?.description, seoDefaults[k].description) },
        ]),
      ) as Record<PageKey, { title: string; description: string }>,
      keywords: doc.seo?.keywords ?? defaultKeywords(site.place),
    },
  };
}

/** What the pages render. */
export function mergeContent(doc: CmsDoc, base: SiteConfig = baseConfig, url = resolveSiteUrl()): Content {
  const full = effectiveDoc(doc, base, url);
  const site = safeDerive(mergeSiteConfig(base, doc.company), url);
  const a = full.announcement;
  const announcement = a.enabled && a.headline.trim() !== "" ? { ...a, id: hash(`${a.mode}|${a.headline}|${a.body}|${a.ctaLabel}|${a.ctaHref}`) } : null;

  return {
    site,
    announcement,
    home: full.home,
    services: full.services.filter((s) => s.visible),
    propertyTypes: full.propertyTypes.filter((p) => p.visible),
    listings: full.listings.filter((l) => l.visible),
    careers: { ...full.careers, jobs: full.careers.jobs.filter((j) => j.visible) },
    hoursSpecs: hoursSpecs(full.company.hours),
    seo: { pages: full.seo.pages, keywords: full.seo.keywords },
  };
}

/* ───────────── Reading from storage ───────────── */

export async function readDoc(opts?: { fresh?: boolean }): Promise<{ doc: CmsDoc; rev: number }> {
  try {
    const envelope = await resolveStorage().read(opts);
    if (!envelope) return { doc: {}, rev: 0 };
    const parsed = cmsDocSchema.safeParse(envelope.data);
    if (parsed.success) return { doc: parsed.data, rev: envelope.rev };
    console.error("[cms] stored content failed validation; showing the standard content");
    return { doc: {}, rev: envelope.rev };
  } catch (error) {
    console.error("[cms] could not read stored content; showing the standard content", error instanceof Error ? error.message : "");
    return { doc: {}, rev: 0 };
  }
}

/** Per-request memoised. Pages, layout and metadata all call this; storage is read once. */
export const getContent = cache(async (): Promise<Content> => {
  const { doc } = await readDoc();
  return mergeContent(doc);
});

/* ───────────── Saving: keep the stored doc minimal ───────────── */

/**
 * Before storing, blank any text that equals the standard wording and drop lists that equal the
 * standard lists. Later improvements to the standard content then reach the site automatically,
 * and "Reset" simply means "clear the field".
 */
export function compactDoc(full: FullCmsDoc, base: SiteConfig = baseConfig, url = resolveSiteUrl()): CmsDoc {
  const std = effectiveDoc({}, base, url);
  const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
  const blankIf = (value: string, standard: string) => (value === standard ? "" : value);

  const out: CmsDoc = {};
  if (!same(full.announcement, std.announcement)) out.announcement = full.announcement;

  const h = full.home;
  if (!same(h, std.home)) {
    out.home = {
      heroLines: same(h.heroLines, std.home.heroLines) ? [] : h.heroLines,
      heroLede: blankIf(h.heroLede, std.home.heroLede),
      primaryCta: same(h.primaryCta, std.home.primaryCta) ? { label: "", href: "" } : h.primaryCta,
      secondaryCta: same(h.secondaryCta, std.home.secondaryCta) ? { label: "", href: "" } : h.secondaryCta,
      statement: blankIf(h.statement, std.home.statement),
      valueProps: h.valueProps,
    };
  }

  if (!same(full.services, std.services)) out.services = full.services;
  if (!same(full.propertyTypes, std.propertyTypes)) out.propertyTypes = full.propertyTypes;
  if (full.listings.length > 0) out.listings = full.listings;

  const c = full.company;
  const sc = std.company;
  if (!same(c, sc)) {
    out.company = {
      ...c,
      phone: blankIf(c.phone, sc.phone),
      email: blankIf(c.email, sc.email),
      hours: c.hours.every((r) => !r.open && !r.close) ? [] : c.hours,
      licenses: c.licenses.every((l) => !l.number.trim()) ? [] : c.licenses,
      portals: {
        ownerUrl: blankIf(c.portals.ownerUrl, sc.portals.ownerUrl),
        tenantUrl: blankIf(c.portals.tenantUrl, sc.portals.tenantUrl),
        paymentUrl: blankIf(c.portals.paymentUrl, sc.portals.paymentUrl),
      },
    };
  }

  if (!same(full.careers, std.careers)) out.careers = full.careers;

  const pages: NonNullable<CmsDoc["seo"]>["pages"] = {};
  for (const k of PAGE_KEYS) {
    const p = full.seo.pages[k];
    const s = std.seo.pages[k];
    if (p && (p.title !== s.title || p.description !== s.description)) pages[k] = { title: blankIf(p.title, s.title), description: blankIf(p.description, s.description) };
  }
  if (Object.keys(pages).length > 0 || !same(full.seo.keywords, std.seo.keywords)) out.seo = { pages, keywords: full.seo.keywords };

  return out;
}

