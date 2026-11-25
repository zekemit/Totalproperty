import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RentalAnalysisSection } from "@/components/forms/rental-analysis-section";
import { Band, EditorialRow, Faq, IndexRows, PageHero, PullQuote, RuledList, SectionTitle } from "@/components/site/sections";
import { ownerServices } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rental property management for owners",
  description: `Free rental analysis and full-service residential property management for owners in ${siteConfig.areasPhrase}. We step into your shoes, from roof repair to landscaping.`,
  alternates: { canonical: "/owners" },
};

const covered = ["Maintenance", "Renovation", "Repair", "Landscaping", "Accounting"] as const;

const steps = [
  { title: "Tell us about the property", text: "Use the form above. It takes a few minutes and you can leave anything you're unsure of blank." },
  { title: "We review it", text: "A member of our team looks at the property and your goals, then follows up with your rental analysis." },
  { title: "You decide what we handle", text: "Take on the whole management package or just the services you need. You're under no obligation." },
] as const;

const faqs = [
  { q: "Do I have to hire you for everything?", a: "No. We tailor our service to your specific requirements and budget, and you can choose one service or all of them." },
  { q: "Which areas do you serve?", a: `${siteConfig.areasPhrase}. ${siteConfig.basedInSentence}` },
  { q: "What does the rental analysis cost?", a: "Nothing. It's free, and requesting one doesn't commit you to anything." },
  { q: "What happens to the information I send?", a: "We use it to prepare your analysis and to contact you about it. We don't sell it. The privacy policy explains the details." },
] as const;

export default function OwnersPage() {
  return (
    <>
      <PageHero art="owners"
        kicker="For property owners"
        title="See what your|rental should|be earning."
        lede="Request a free rental analysis and we'll show you how we would manage your property. We protect your asset the way we'd protect our own."
      >
        <Button asChild size="lg" variant="accent"><a href="#analysis">Start my free analysis</a></Button>
        <Button asChild size="lg" variant="outline"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Band id="analysis" tone="travertine" labelledBy="analysis-h" className="scroll-mt-16">
        <SectionTitle id="analysis-h" className="mb-16" lede="Start with the vacancy math if you like, then send us the property details.">
          Free rental analysis
        </SectionTitle>
        <RentalAnalysisSection />
      </Band>

      <Band tone="ink" labelledBy="shoes-h">
        <PullQuote className="max-w-5xl">{siteConfig.tagline}</PullQuote>
        <div className="mt-24 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="shoes-h" className="font-display text-[clamp(2.4rem,1.5rem+3.4vw,4.5rem)] leading-[0.95]">We step into your shoes</h2>
            <p className="mt-6 max-w-md text-lg text-limestone/85">Our residential package takes the day-to-day stress off you and keeps your home in first-class condition.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <RuledList items={ownerServices.items} />
            <p className="mb-4 mt-12 text-sand">Across every property we manage we take care of:</p>
            <ul className="grid grid-cols-2 border-b border-[var(--hairline)] sm:grid-cols-3">
              {covered.map((c) => (
                <li key={c} className="border-t border-[var(--hairline)] py-3 font-display text-3xl leading-none">{c}</li>
              ))}
            </ul>
          </div>
        </div>
      </Band>

      <Band labelledBy="how-h">
        <EditorialRow label={<h2 id="how-h" className="font-sans text-base font-semibold text-brass-700">How it works</h2>}>
          <IndexRows numbered items={steps.map((s) => ({ title: s.title, text: s.text }))} />
        </EditorialRow>
      </Band>

      <Band tone="travertine" labelledBy="faq-h">
        <EditorialRow label={<h2 id="faq-h" className="font-sans text-base font-semibold text-brass-700">Questions owners ask</h2>}>
          <Faq items={faqs} />
          <p className="mt-10 text-lg">
            Managing a commercial property instead? See our <Link href="/commercial" className="link-line font-semibold">commercial services</Link>.
          </p>
        </EditorialRow>
      </Band>
    </>
  );
}
