import Image from "next/image";
import { ImageSplit } from "@/components/site/image-split";
import { PropertyGallery } from "@/components/site/property-gallery";
import { Band, display, EditorialRow, PageHero, StatementBand } from "@/components/site/sections";
import { Testimonials } from "@/components/site/testimonials";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";
import { PHOTOS } from "@/lib/photos";

export async function generateMetadata() {
  return pageMetadata("about");
}

export default async function AboutPage() {
  const { site: siteConfig } = await getContent();
  const { leadership, licenses, foundedYear } = siteConfig;
  return (
    <>
      <PageHero
        art="skyline"
        title="About Total|Property Management."
        lede={`A one-stop property management team for owners, landlords, tenants and lenders, based in ${siteConfig.place} and serving ${siteConfig.areasPhrase}.`}
      />

      <StatementBand>Designed to meet your needs and enhance asset values</StatementBand>

      <ImageSplit id="who" title="Who are we?" image={PHOTOS.slideIndustrial.src} alt={PHOTOS.slideIndustrial.alt}>
        <p>
          Total Property Management provides a &ldquo;one stop&rdquo; property management solution for owners, landlords, tenants and lenders. We have designed a customer-driven process which provides total &ldquo;end to end&rdquo; management of both commercial and residential property.
        </p>
        <p>
          Our geographic focus includes {siteConfig.areasPhrase}. Our goal is to provide exceptional customer service along with a complete customer package designed to meet your needs and enhance asset values.
        </p>
        {foundedYear ? <p>We have served clients since {foundedYear}.</p> : null}
      </ImageSplit>

      <ImageSplit id="different" tone="travertine" flip title="Why are we different?" image={PHOTOS.serviceTenant.src} alt={PHOTOS.serviceTenant.alt}>
        <p>
          Typically, a property management company would provide a service for either a landlord or tenant. We go one step further by providing a Total Property Management service. Our added value approach ensures all aspects of property management are handled for the landlord as well as providing peace of mind for tenants as we assist with lease maintenance obligations.
        </p>
      </ImageSplit>

      <Band labelledBy="where-h">
        <EditorialRow label={<h2 id="where-h" className="font-sans text-base font-semibold text-brass-700">Where we are</h2>}>
          <p className={`${display.sub} max-w-3xl`}>
            {siteConfig.basedInSentence} From here we serve properties across {siteConfig.areasPhrase}.
            {siteConfig.serviceAreaDetail ? ` ${siteConfig.serviceAreaDetail}.` : ""}
          </p>
          <address className="mt-12 grid gap-8 not-italic sm:grid-cols-2">
            <div className="border-t border-[var(--hairline)] pt-4">
              <p className="font-semibold">{siteConfig.legalName}</p>
              {siteConfig.officeLine ? <p>Office: {siteConfig.officeLine}</p> : null}
              <p>Mailing address: {siteConfig.mailingLine}</p>
            </div>
            <div className="border-t border-[var(--hairline)] pt-4">
              <a href={siteConfig.phoneHref} className="link-line font-semibold">{siteConfig.phone}</a>
              <br />
              <a href={`mailto:${siteConfig.email}`} className="link-line">{siteConfig.email}</a>
            </div>
          </address>
        </EditorialRow>
      </Band>

      {leadership.length > 0 ? (
        <Band labelledBy="team-h">
          <EditorialRow label={<h2 id="team-h" className="font-sans text-base font-semibold text-brass-700">Leadership</h2>}>
            <ul className="grid items-start gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {leadership.map((l, i) => (
                <li key={l.name} className={i % 2 === 1 ? "lg:mt-16" : ""}>
                  {l.photo ? (
                    <Image src={l.photo.src} alt={l.photo.alt} width={l.photo.width} height={l.photo.height} sizes="(min-width: 1024px) 28vw, 90vw" className="mb-6 aspect-[4/5] w-full object-cover" />
                  ) : null}
                  <h3 className={display.sub}>{l.name}</h3>
                  <p className="mt-1 font-semibold text-brass-700">{l.title}</p>
                  {l.bio ? <p className="mt-3 text-muted">{l.bio}</p> : null}
                </li>
              ))}
            </ul>
          </EditorialRow>
        </Band>
      ) : null}

      {licenses.length > 0 ? (
        <Band tone="travertine" labelledBy="licensing-h">
          <EditorialRow label={<h2 id="licensing-h" className="font-sans text-base font-semibold text-brass-700">Licensing</h2>}>
            <ul className="border-b border-[var(--hairline)]">
              {licenses.map((l) => (
                <li key={`${l.state}-${l.number}`} className="border-t border-[var(--hairline)] py-4 text-lg">
                  {l.holderName ? `${l.holderName}: ` : ""}
                  {l.label}
                  {l.verifyUrl ? (
                    <>
                      {" "}
                      <a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" className="link-line font-semibold">
                        Verify<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </>
                  ) : null}
                </li>
              ))}
            </ul>
          </EditorialRow>
        </Band>
      ) : null}

      <PropertyGallery />
      <Testimonials tone={licenses.length > 0 ? "limestone" : "travertine"} />
    </>
  );
}
