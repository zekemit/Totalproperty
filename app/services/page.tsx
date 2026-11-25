import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckList, PageHero, Section } from "@/components/site/sections";
import { commercialLandlord, commercialTenant, construction, lenderServices, ownerServices } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Property management services",
  description:
    "Every service Total Property Management offers: residential owner services, commercial landlord and tenant services, construction management and lender REO services.",
  alternates: { canonical: "/services" },
};

const groups = [
  { section: ownerServices, heading: "Residential", href: "/owners", cta: "Get a free rental analysis" },
  { section: commercialLandlord, heading: "Commercial", href: "/commercial", cta: "Explore commercial services" },
  { section: commercialTenant, heading: "Commercial", href: "/commercial", cta: "Explore commercial services" },
  { section: construction, heading: "Construction", href: "/commercial#construction", cta: "See construction management" },
  { section: lenderServices, heading: "Lenders", href: "/lenders", cta: "Talk to us about REO" },
] as const;

export default function ServicesPage() {
  return (
    <>
      <PageHero
        title="Services for owners, landlords, tenants and lenders."
        lede="We tailor our service to your specific requirements and budget. Choose one of the following services, or all of them."
      >
        <Button asChild size="lg" variant="accent"><Link href="/contact">Ask about your property</Link></Button>
      </PageHero>

      {groups.map((g, i) => (
        <Section key={g.section.id} id={g.section.id} tone={i % 2 === 0 ? "default" : "panel"} labelledBy={`${g.section.id}-h`} className="scroll-mt-4">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="kicker">{g.heading}</p>
              <h2 id={`${g.section.id}-h`} className="mt-1 text-3xl">{g.section.title}</h2>
              <p className="mt-3 text-muted">For {g.section.audience.toLowerCase()}.</p>
              <Link href={g.href} className="mt-4 inline-flex min-h-11 items-center font-bold text-navy-700 underline underline-offset-4">{g.cta}</Link>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <CheckList items={g.section.items} />
            </div>
          </div>
        </Section>
      ))}
    </>
  );
}
