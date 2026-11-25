import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Button } from "@/components/ui/button";
import { Band, display, PageHero, RuledList, SectionTitle } from "@/components/site/sections";
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
      <PageHero art="lenders"
        tone="ink"
        kicker="For lenders and servicers"
        title="Foreclosure properties,|ready for market."
        lede="We're your first point of contact while a property moves through foreclosure, and we get it renovated, landscaped and cleaned before it's marketed for sale."
      >
        <Button asChild size="lg" variant="accent"><a href="#talk">Talk to us about REO</a></Button>
        <Button asChild size="lg" variant="outline-light"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Band labelledBy="lender-services">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="lender-services" className={`${display.section} mb-10`}>{lenderServices.title}</h2>
            <RuledList items={lenderServices.items} />
          </div>
          <aside className="self-start border-t border-ink-900 pt-6 lg:col-span-4 lg:col-start-9 lg:mt-24">
            <h3 className="font-display text-4xl leading-none">Where we work</h3>
            <p className="mt-4 text-lg">{siteConfig.areasPhrase}.</p>
            <p className="mt-2 text-muted">{siteConfig.basedInSentence}</p>
          </aside>
        </div>
      </Band>

      <Band id="talk" tone="travertine" labelledBy="talk-h" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle id="talk-h" lede="Tell us about your portfolio or a specific property. We’ll reply to discuss scope and costs.">
              Talk to us about REO
            </SectionTitle>
          </div>
          <div className="sheet p-6 sm:p-10 lg:col-span-8">
            <ContactForm defaultTopic="lender" />
          </div>
        </div>
      </Band>
    </>
  );
}
