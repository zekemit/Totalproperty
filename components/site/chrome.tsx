import type { ReactNode } from "react";
import { AttributionCapture } from "@/components/forms/attribution";
import { getContent } from "@/lib/cms/content";
import { localBusinessJsonLd } from "@/lib/seo-schema";
import { AnnouncementBar, AnnouncementPopup } from "./announcement";
import { Footer } from "./footer";
import { Header } from "./header";
import { JsonLd } from "./json-ld";

/** Everything around a public page: skip link, announcement, header, footer, attribution, structured data. */
export async function SiteChrome({ children }: { children: ReactNode }) {
  const content = await getContent();
  const a = content.announcement;
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink-900 focus:px-5 focus:py-3 focus:font-semibold focus:text-paper"
      >
        Skip to main content
      </a>
      {a?.mode === "bar" ? <AnnouncementBar id={a.id} headline={a.headline} body={a.body} ctaLabel={a.ctaLabel} ctaHref={a.ctaHref} /> : null}
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
      <AttributionCapture />
      {a?.mode === "popup" ? <AnnouncementPopup id={a.id} headline={a.headline} body={a.body} ctaLabel={a.ctaLabel} ctaHref={a.ctaHref} /> : null}
      <JsonLd data={localBusinessJsonLd(content)} />
    </>
  );
}
