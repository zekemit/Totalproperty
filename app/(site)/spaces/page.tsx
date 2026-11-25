import { ContactForm } from "@/components/forms/contact-form";
import { ListingGrid } from "@/components/site/listings";
import { Band, display, PageHero, SectionTitle } from "@/components/site/sections";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("spaces");
}

export default async function SpacesPage() {
  const { site, listings } = await getContent();
  return (
    <>
      <PageHero
        art="commercial"
        kicker="Available through Total Property Management"
        title="Looking for|a space to lease?"
        lede={`Properties we are offering in ${site.areasPhrase}. Don't see what you need? Tell us, and we'll look.`}
      />

      <Band labelledBy="listings-h">
        <h2 id="listings-h" className="sr-only">Available properties</h2>
        {listings.length > 0 ? (
          <ListingGrid listings={listings} />
        ) : (
          <div className="grid gap-10 lg:grid-cols-12">
            <p className={`${display.sub} lg:col-span-7`}>Nothing is listed here right now.</p>
            <p className="text-lg text-muted lg:col-span-4 lg:col-start-9">
              New spaces are added as they become available. Call <a href={site.phoneHref} className="link-line font-semibold text-text">{site.phone}</a> or use the form below and we&rsquo;ll tell you what is coming up.
            </p>
          </div>
        )}
      </Band>

      <Band tone="travertine" labelledBy="need-h" id="need" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <SectionTitle id="need-h" className="lg:col-span-5" lede="Tell us the kind of space, the area and your timeline.">
            Tell us what you need
          </SectionTitle>
          <div className="sheet p-6 sm:p-10 lg:col-span-6 lg:col-start-7">
            <ContactForm defaultTopic="commercial" />
          </div>
        </div>
      </Band>
    </>
  );
}
