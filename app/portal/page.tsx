import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/site/sections";
import { portalUrls } from "@/lib/portals";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Owner and tenant portal login",
  description: "Sign in to your Total Property Management owner or tenant portal.",
  alternates: { canonical: "/portal" },
};

function Block({ id, title, url, signInLabel }: { id: string; title: string; url?: string; signInLabel: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-4 rounded-xl border border-line bg-white p-6 sm:p-8">
      <h2 id={`${id}-h`} className="text-2xl">{title}</h2>
      {url ? (
        <Button asChild size="lg" className="mt-5">
          <a href={url} target="_blank" rel="noopener noreferrer">
            {signInLabel}
            <ExternalLink aria-hidden="true" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Button>
      ) : (
        <p className="mt-3">
          Online sign-in isn&apos;t linked from this website yet. Call <a href={siteConfig.phoneHref} className="font-bold text-navy-700 underline">{siteConfig.phone}</a> or email <a href={`mailto:${siteConfig.email}`} className="font-bold text-navy-700 underline">{siteConfig.email}</a> and we&apos;ll help you directly.
        </p>
      )}
    </section>
  );
}

export default function PortalPage() {
  const { owner, tenant } = portalUrls();
  return (
    <>
      <PageHero title="Portal login." lede="Choose the portal that matches your role." />
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Block id="owners" title="Owners" url={owner} signInLabel="Open owner portal" />
          <Block id="tenants" title="Tenants" url={tenant} signInLabel="Open tenant portal" />
        </div>
      </Section>
    </>
  );
}
