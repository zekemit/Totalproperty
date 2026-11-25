import { VendorForm } from "@/components/forms/vendor-form";
import { Band, PageHero, SectionTitle } from "@/components/site/sections";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("vendors");
}

const work = ["Maintenance", "Renovation", "Repair", "Landscaping", "Snow removal and lot care", "Construction"] as const;

export default async function VendorsPage() {
  const { site: siteConfig } = await getContent();
  return (
    <>
      <PageHero art="skyline"
        kicker="For vendors and contractors"
        title="Do good work|for properties|we manage."
        lede="We coordinate maintenance, renovation, repair, landscaping and construction across the properties we manage. If that's your trade, tell us about your business."
      />

      <Band tone="travertine" labelledBy="work-h">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="work-h" className="font-sans text-base font-semibold text-brass-700">Work we coordinate</h2>
            <ul className="mt-6 border-b border-[var(--hairline)]">
              {work.map((w) => (
                <li key={w} className="border-t border-[var(--hairline)] py-3 font-display text-4xl leading-none sm:text-5xl">{w}</li>
              ))}
            </ul>
            <p className="mt-8 max-w-sm text-muted">
              Already working with us and have a question about a job? Contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="link-line font-semibold text-text">{siteConfig.email}</a> or{" "}
              <a href={siteConfig.phoneHref} className="link-line font-semibold text-text">{siteConfig.phone}</a>.
            </p>
          </div>
          <div className="lg:col-span-7">
            <SectionTitle className="mb-10" lede="Share your trade and where you work. We'll follow up with onboarding requirements.">
              Tell us about your business
            </SectionTitle>
            <div className="sheet p-6 sm:p-10">
              <VendorForm />
            </div>
          </div>
        </div>
      </Band>
    </>
  );
}
