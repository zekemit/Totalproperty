import type { Metadata } from "next";
import { VendorForm } from "@/components/forms/vendor-form";
import { PageHero, Section, SectionHeading } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Vendors and contractors",
  description:
    "Contractors and service providers: tell Total Property Management about your trade and service area to work on the properties we manage in Virginia, Maryland, Pennsylvania and DC.",
  alternates: { canonical: "/vendors" },
};

const work = ["Maintenance", "Renovation", "Repair", "Landscaping", "Snow removal and lot care", "Construction"] as const;

export default function VendorsPage() {
  return (
    <>
      <PageHero
        kicker="For vendors and contractors"
        title="Do good work for properties we manage."
        lede="We coordinate maintenance, renovation, repair, landscaping and construction across the properties we manage. If that's your trade, tell us about your business."
      />

      <Section labelledBy="work-h">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="work-h" className="text-2xl">Work we coordinate</h2>
            <ul className="mt-4 space-y-2">
              {work.map((w) => (
                <li key={w} className="border-b border-line pb-2 font-bold text-navy-800">{w}</li>
              ))}
            </ul>
            <p className="mt-6">
              Already working with us and have a question about a job? Contact us at{" "}
              <a href={`mailto:${siteConfig.email}`} className="font-bold text-navy-700 underline">{siteConfig.email}</a> or{" "}
              <a href={siteConfig.phoneHref} className="font-bold text-navy-700 underline">{siteConfig.phone}</a>.
            </p>
          </div>
          <div className="lg:col-span-8">
            <SectionHeading title="Tell us about your business" lede="Share your trade and where you work. We'll follow up with onboarding requirements." className="!mb-6" />
            <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
              <VendorForm />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
