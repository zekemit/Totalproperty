import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Band, display, PageHero } from "@/components/site/sections";
import { portalUrls } from "@/lib/portals";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Owner and tenant portal login",
  description: "Sign in to your Total Property Management owner or tenant portal.",
  alternates: { canonical: "/portal" },
};

function Row({ id, title, url, signInLabel }: { id: string; title: string; url?: string; signInLabel: string }) {
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

export default function PortalPage() {
  const { owner, tenant } = portalUrls();
  return (
    <>
      <PageHero art="skyline" title="Portal login." lede="Choose the portal that matches your role." />
      <Band tone="travertine">
        <ul className="border-b border-[var(--hairline)]">
          <Row id="owners" title="Owners" url={owner} signInLabel="Open owner portal" />
          <Row id="tenants" title="Tenants" url={tenant} signInLabel="Open tenant portal" />
        </ul>
      </Band>
    </>
  );
}
