import type { Metadata } from "next";
import { House } from "lucide-react";
import { Band, PageHero } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Fair housing and equal opportunity",
  description: "Total Property Management's equal housing opportunity statement.",
  alternates: { canonical: "/fair-housing" },
};

export default function FairHousingPage() {
  return (
    <>
      <PageHero title="Fair housing|and equal|opportunity" />
      <Band tone="travertine">
        <div className="prose-block ">
          <p className="flex items-center gap-3 text-xl font-bold text-navy-800">
            <House aria-hidden="true" className="size-8 text-copper" />
            Equal Housing Opportunity
          </p>
          <p>
            {siteConfig.name} supports equal housing opportunity. We do not discriminate in the rental, management or marketing of housing on the basis of race, color, religion, sex, disability, familial status or national origin, or on any other basis protected by federal, state or local law.
          </p>
          <p>
            If you believe you have been treated unfairly, or you need a reasonable accommodation to apply for or live in housing we manage, please tell us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
          </p>
        </div>
      </Band>
    </>
  );
}
