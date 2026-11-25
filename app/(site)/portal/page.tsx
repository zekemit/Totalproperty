import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Band, display, PageHero } from "@/components/site/sections";
import { portalUrlsFor } from "@/lib/portals";
import type { Site } from "@/lib/site";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("portal");
}

function Row({ id, title, url, signInLabel, siteConfig }: { id: string; title: string; url?: string; signInLabel: string; siteConfig: Pick<Site, "phone" | "phoneHref" | "email"> }) {
  return (
    <li id={id} aria-labelledby={`${id}-h`} className="grid scroll-mt-24 gap-6 border-t border-[var(--hairline)] py-12 lg:grid-cols-12 lg:items-center">
      <h2 id={`${id}-h`} className={`${display.section} lg:col-span-6`}>{title}</h2>
      <div className="lg:col-span-5 lg:col-start-8">
        {url ? (
          <Button asChild size="lg">
            <a href={url} target="_blank" rel="noopener noreferrer">
              {signInLabel}
              <ExternalLink aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        ) : (
          <p className="text-lg">
            To get portal access, call <a href={siteConfig.phoneHref} className="link-line font-semibold">{siteConfig.phone}</a> or email{" "}
            <a href={`mailto:${siteConfig.email}`} className="link-line font-semibold">{siteConfig.email}</a> and we&rsquo;ll help you directly.
          </p>
        )}
      </div>
    </li>
  );
}

export default async function PortalPage() {
  const { site: siteConfig } = await getContent();
  const { owner, tenant } = portalUrlsFor(siteConfig);
  return (
    <>
      <PageHero art="skyline" title="Owner and tenant|portal login." lede="Choose the portal that matches your role." />
      <Band tone="travertine">
        <ul className="border-b border-[var(--hairline)]">
          <Row id="owners" title="Owners" url={owner} signInLabel="Open owner portal" siteConfig={siteConfig} />
          <Row id="tenants" title="Tenants" url={tenant} signInLabel="Open tenant portal" siteConfig={siteConfig} />
        </ul>
      </Band>
    </>
  );
}
