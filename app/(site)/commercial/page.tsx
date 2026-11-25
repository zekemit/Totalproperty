import { ContactForm } from "@/components/forms/contact-form";
import { Band, EditorialRow, PageHero, RuledList, SectionTitle, Sequence } from "@/components/site/sections";
import { Button } from "@/components/ui/button";
import { commercialLandlord, commercialTenant, construction } from "@/lib/catalog";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("commercial");
}

export default async function CommercialPage() {
  const { site: siteConfig } = await getContent();
  return (
    <>
      <PageHero art="commercial"
        kicker="For commercial landlords and tenants"
        title="Commercial property|management built|around controlling CAM."
        lede="One team for landlord services, tenant services and construction, with annual budgets and expense tracking designed to minimize CAM and related costs."
      >
        <Button asChild size="lg" variant="accent"><a href="#proposal">Request a proposal</a></Button>
        <Button asChild size="lg" variant="outline"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Band labelledBy="landlord-h">
        <EditorialRow
          label={
            <>
              <h2 id="landlord-h" className="font-display text-[clamp(2.2rem,1.6rem+2vw,3.5rem)] leading-none">{commercialLandlord.title}</h2>
              <p className="mt-4 max-w-[16rem] text-muted">We act as the first point of contact for your tenants and run the property day to day.</p>
            </>
          }
        >
          <RuledList items={commercialLandlord.items} />
        </EditorialRow>

        <EditorialRow
          className="mt-24"
          label={
            <>
              <h2 className="font-display text-[clamp(2.2rem,1.6rem+2vw,3.5rem)] leading-none">{commercialTenant.title}</h2>
              <p className="mt-4 max-w-[16rem] text-muted">Tenants get a single place to turn, and a partner in meeting their lease obligations.</p>
            </>
          }
        >
          <RuledList items={commercialTenant.items} />
        </EditorialRow>
      </Band>

      <Band id="construction" tone="ink" labelledBy="construction-h" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionTitle id="construction-h" className="lg:col-span-5" lede="From permits and bids to punch list and close-out, we coordinate the architects, engineers and contractors for landlords and tenants.">
            Construction management
          </SectionTitle>
          <div className="lg:col-span-7">
            <Sequence items={construction.items} />
          </div>
        </div>
      </Band>

      <Band id="proposal" tone="travertine" labelledBy="proposal-h" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle id="proposal-h" lede="Tell us about the property and what you need. We’ll follow up to talk it through.">
              Request a commercial proposal
            </SectionTitle>
          </div>
          <div className="sheet p-6 sm:p-10 lg:col-span-8">
            <ContactForm defaultTopic="commercial" />
          </div>
        </div>
      </Band>
    </>
  );
}
