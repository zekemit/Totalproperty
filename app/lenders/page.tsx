import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { CheckList, PageHero, Section } from "@/components/site/sections";
import { lenderServices } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lender and REO foreclosure property services",
  description:
    "A single point of contact for lenders and servicers during foreclosure. Properties are renovated, landscaped and cleaned before marketing, at an agreed sliding scale of costs.",
  alternates: { canonical: "/lenders" },
};

export default function LendersPage() {
  return (
    <>
      <PageHero
        kicker="For lenders and servicers"
        title="Foreclosure properties, ready for market."
        lede="We're your first point of contact while a property moves through foreclosure, and we get it renovated, landscaped and cleaned before it's marketed for sale."
      >
        <Button asChild size="lg" variant="accent"><a href="#talk">Talk to us about REO</a></Button>
        <Button asChild size="lg" variant="outline"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Section labelledBy="lender-services">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="lender-services" className="mb-6">{lenderServices.title}</h2>
            <CheckList items={lenderServices.items} />
          </div>
          <aside className="self-start rounded-xl border border-line bg-white p-6 lg:col-span-4 lg:col-start-9">
            <h3 className="text-xl">Where we work</h3>
            <p className="mt-2">Virginia, Maryland, Pennsylvania and the DC area, from our office in Purcellville, Virginia.</p>
          </aside>
        </div>
      </Section>

      <Section id="talk" tone="panel" labelledBy="talk-h" className="scroll-mt-4">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="talk-h">Talk to us about REO</h2>
            <p className="mt-4 text-muted">Tell us about your portfolio or a specific property. We’ll reply to discuss scope and costs.</p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-8">
            <ContactForm defaultTopic="lender" />
          </div>
        </div>
      </Section>
    </>
  );
}
