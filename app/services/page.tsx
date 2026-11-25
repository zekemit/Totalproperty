import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Band, display, EditorialRow, PageHero, RuledList, type Tone } from "@/components/site/sections";
import { commercialLandlord, commercialTenant, construction, lenderServices, ownerServices } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Property management services",
  description: "Every service Total Property Management offers: residential owner services, commercial landlord and tenant services, construction management and lender REO services.",
  alternates: { canonical: "/services" },
};

const groups = [
  { section: ownerServices, href: "/owners", cta: "Get a free rental analysis" },
  { section: commercialLandlord, href: "/commercial", cta: "Explore commercial services" },
  { section: commercialTenant, href: "/commercial", cta: "Explore commercial services" },
  { section: construction, href: "/commercial#construction", cta: "See construction management" },
  { section: lenderServices, href: "/lenders", cta: "Talk to us about REO" },
] as const;

const tones: Tone[] = ["limestone", "travertine", "limestone", "ink", "travertine"];

export default function ServicesPage() {
  return (
    <>
      <PageHero art="construction" title="Services for owners,|landlords, tenants|and lenders." lede="We tailor our service to your specific requirements and budget. Choose one of the following services, or all of them.">
        <Button asChild size="lg" variant="accent"><Link href="/contact">Ask about your property</Link></Button>
      </PageHero>

      {groups.map((g, i) => (
        <Band key={g.section.id} id={g.section.id} tone={tones[i] ?? "limestone"} labelledBy={`${g.section.id}-h`} className="scroll-mt-16 !py-16 sm:!py-24">
          <EditorialRow
            label={
              <>
                <h2 id={`${g.section.id}-h`} className={`${display.sub} max-w-[11ch]`}>{g.section.title}</h2>
                <p className="mt-4 opacity-75">For {g.section.audience.toLowerCase()}.</p>
                <Link href={g.href} className="link-line mt-5 inline-block font-semibold">{g.cta}</Link>
              </>
            }
          >
            <RuledList items={g.section.items} />
          </EditorialRow>
        </Band>
      ))}
    </>
  );
}
