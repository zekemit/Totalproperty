import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/sections";
import { serviceAreas, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Total Property Management",
  description:
    "Total Property Management is a one-stop property management team for owners, landlords, tenants and lenders, based in Purcellville, Virginia and serving VA, MD, PA and DC.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const { address, leadership, licenses, foundedYear } = siteConfig;
  return (
    <>
      <PageHero
        title="One team for both sides of the lease."
        lede="Total Property Management is a one-stop property management solution for owners, landlords, tenants and lenders, covering commercial and residential property from end to end."
      />

      <Section labelledBy="different">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHeading id="different" title="Why we're different" className="!mb-6" />
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
          <figure className="self-center lg:col-span-4 lg:col-start-9">
            <blockquote className="border-l-4 border-copper pl-6 font-serif text-3xl leading-snug text-navy-800">{siteConfig.tagline}</blockquote>
          </figure>
        </div>
      </Section>

      <Section tone="panel" labelledBy="where">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="where" title="Based in Purcellville, serving four jurisdictions" className="!mb-6" />
            <p className="text-lg">
              Our office is in Purcellville, in Loudoun County, Virginia. From there we serve properties across {serviceAreas.map((a) => a.name).join(", ").replace(/, ([^,]*)$/, ", and $1")}.
            </p>
            <address className="mt-6 not-italic">
              <strong className="text-navy-800">{siteConfig.name}</strong>
              <br />
              Mailing address: {address.poBox}, {address.locality}, {address.region} {address.postalCode}
              <br />
              <a href={siteConfig.phoneHref} className="font-bold text-navy-700 underline">{siteConfig.phone}</a>
              <br />
              <a href={`mailto:${siteConfig.email}`} className="font-bold text-navy-700 underline">{siteConfig.email}</a>
            </address>
          </div>
          <ul className="grid grid-cols-2 gap-3 self-start lg:col-span-5 lg:col-start-8">
            {serviceAreas.map((a) => (
              <li key={a.code} className="rounded-xl border border-line bg-white p-5 text-center">
                <span className="block text-3xl font-extrabold text-navy-800">{a.code}</span>
                <span className="text-muted">{a.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {leadership.length > 0 ? (
        <Section labelledBy="team">
          <SectionHeading id="team" title="Leadership" />
          <ul className="grid gap-6 md:grid-cols-3">
            {leadership.map((l) => (
              <li key={l.name} className="rounded-xl border border-line bg-white p-6">
                <h3 className="text-xl">{l.name}</h3>
                <p className="text-copper font-bold">{l.title}</p>
                {l.bio ? <p className="mt-3">{l.bio}</p> : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {licenses.length > 0 ? (
        <Section tone="panel" labelledBy="licensing">
          <SectionHeading id="licensing" title="Licensing" />
          <ul className="space-y-2">
            {licenses.map((l) => (
              <li key={`${l.jurisdiction}-${l.number}`}>
                {l.jurisdiction}: {l.holder ? `${l.holder}, ` : ""}license {l.number}
                {l.verifyUrl ? (
                  <>
                    {" "}
                    (<a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-navy-700 underline">verify<span className="sr-only"> (opens in a new tab)</span></a>)
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section tone="dark" labelledBy="about-cta">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <h2 id="about-cta">Let&apos;s talk about your property.</h2>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" variant="accent"><Link href="/owners#analysis">Get a free rental analysis</Link></Button>
            <Button asChild size="lg" variant="outline-light"><Link href="/contact">Contact us</Link></Button>
          </div>
        </div>
      </Section>
    </>
  );
}
