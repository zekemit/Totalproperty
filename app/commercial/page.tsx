import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { CheckList, PageHero, Section, SectionHeading } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { commercialLandlord, commercialTenant, construction } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Commercial property management, CAM and construction",
  description: `Commercial landlord and tenant services, CAM budget control and construction management for properties in ${siteConfig.areasPhrase}.`,
  alternates: { canonical: "/commercial" },
};

export default function CommercialPage() {
  return (
    <>
      <PageHero
        kicker="For commercial landlords and tenants"
        title="Commercial management built around controlling CAM."
        lede="One team for landlord services, tenant services and construction, with annual budgets and expense tracking designed to minimize CAM and related costs."
      >
        <Button asChild size="lg" variant="accent"><a href="#proposal">Request a proposal</a></Button>
        <Button asChild size="lg" variant="outline"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Section labelledBy="landlord-h">
        <div className="grid gap-12 lg:grid-cols-2">
          <div id={commercialLandlord.id}>
            <SectionHeading id="landlord-h" title={commercialLandlord.title} lede="We act as the first point of contact for your tenants and run the property day to day." className="!mb-6" />
            <CheckList items={commercialLandlord.items} />
          </div>
          <div id={commercialTenant.id}>
            <SectionHeading title={commercialTenant.title} lede="Tenants get a single place to turn, and a partner in meeting their lease obligations." className="!mb-6" />
            <CheckList items={commercialTenant.items} />
          </div>
        </div>
      </Section>

      <Section id="construction" tone="panel" labelledBy="construction-h" className="scroll-mt-4">
        <SectionHeading
          id="construction-h"
          title="Construction management"
          lede="From permits and bids to punch list and close-out, we coordinate the architects, engineers and contractors for landlords and tenants."
        />
        <CheckList items={construction.items} className="max-w-3xl" />
      </Section>

      <Section id="proposal" labelledBy="proposal-h" className="scroll-mt-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="proposal-h">Request a commercial proposal</h2>
            <p className="mt-4 text-muted">Tell us about the property and what you need. We’ll follow up to talk it through.</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-8">
            <ContactForm defaultTopic="commercial" />
          </div>
        </div>
      </Section>
    </>
  );
}
