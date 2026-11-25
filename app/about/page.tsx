import type { Metadata } from "next";
import Image from "next/image";
import { PropertyGallery } from "@/components/site/property-gallery";
import { Band, display, EditorialRow, PageHero, PullQuote } from "@/components/site/sections";
import { Testimonials } from "@/components/site/testimonials";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Total Property Management",
  description: `Total Property Management is a one-stop property management team for owners, landlords, tenants and lenders, based in ${siteConfig.place} and serving ${siteConfig.areasPhrase}.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { leadership, licenses, foundedYear } = siteConfig;
  return (
    <>
      <PageHero art="skyline"
        title="One team for|both sides|of the lease."
        lede="Total Property Management is a one-stop property management solution for owners, landlords, tenants and lenders, covering commercial and residential property from end to end."
      />

      <Band labelledBy="different-h">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="different-h" className={`${display.section} mb-10`}>Why we&rsquo;re different</h2>
            <div className="prose-block text-lg">
              <p>
                Typically, a property management company serves either the landlord or the tenant. We go one step further. Our added-value approach makes sure every aspect of property management is handled for the landlord, and it gives tenants peace of mind because we help with their lease maintenance obligations.
              </p>
              <p>
                We built a customer-driven process that manages commercial and residential property end to end, with exceptional customer service and a complete package designed to meet your needs and enhance asset values.
              </p>
              {foundedYear ? <p>We have served clients since {foundedYear}.</p> : null}
            </div>
          </div>
          <PullQuote className="lg:col-span-5 lg:col-start-8 lg:mt-40">{siteConfig.tagline}</PullQuote>
        </div>
      </Band>

      <Band tone="travertine" labelledBy="where-h">
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
