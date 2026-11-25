import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RentalAnalysisSection } from "@/components/forms/rental-analysis-section";
import { CheckList, PageHero, Section, SectionHeading } from "@/components/site/sections";
import { ownerServices } from "@/lib/catalog";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Rental property management for owners",
  description: `Free rental analysis and full-service residential property management for owners in ${siteConfig.areasPhrase}. We step into your shoes, from roof repair to landscaping.`,
  alternates: { canonical: "/owners" },
};

const covered = ["Maintenance", "Renovation", "Repair", "Landscaping", "Accounting"] as const;

const steps = [
  { title: "Tell us about the property", text: "Use the form below. It takes a few minutes and you can leave anything you're unsure of blank." },
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
      <PageHero
        kicker="For property owners"
        title="See what your rental should be earning."
        lede="Request a free rental analysis and we'll show you how we would manage your property. We protect your asset the way we'd protect our own."
      >
        <Button asChild size="lg" variant="accent"><a href="#analysis">Start my free analysis</a></Button>
        <Button asChild size="lg" variant="outline"><a href={siteConfig.phoneHref}>Call {siteConfig.phone}</a></Button>
      </PageHero>

      <Section id="analysis" tone="panel" labelledBy="analysis-h" className="scroll-mt-4">
        <SectionHeading id="analysis-h" title="Free rental analysis" lede="Start with the vacancy math if you like, then send us the property details." />
        <RentalAnalysisSection />
      </Section>

      <Section labelledBy="we-take-on">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading id="we-take-on" title="We step into your shoes" lede="Our residential package takes the day-to-day stress off you and keeps your home in first-class condition." className="!mb-6" />
            <CheckList items={ownerServices.items} />
            <p className="mt-6">Across every property we manage we take care of:</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {covered.map((c) => (
                <li key={c} className="rounded-md border border-navy-800/30 bg-white px-4 py-2 font-bold text-navy-800">{c}</li>
              ))}
            </ul>
          </div>
          <figure className="self-center lg:col-span-5 lg:col-start-8">
            <blockquote className="border-l-4 border-copper pl-6 font-serif text-3xl leading-snug text-navy-800">
              {siteConfig.tagline}
            </blockquote>
            <figcaption className="mt-4 pl-6 text-muted">Our promise to the owners we work for.</figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="panel" labelledBy="how">
        <SectionHeading id="how" title="How it works" />
        <ol className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-white p-6">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-navy-800 text-lg font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 text-xl">{s.title}</h3>
              <p className="mt-2">{s.text}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="faq">
        <SectionHeading id="faq" title="Questions owners ask" />
        <div className="max-w-3xl divide-y divide-line border-y border-line">
          {faqs.map((f) => (
            <details key={f.q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-lg font-bold text-navy-800 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="text-2xl leading-none text-copper group-open:rotate-45 transition-transform">+</span>
              </summary>
              <p className="pb-4 pr-10">{f.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-8">
          Managing a commercial property instead? See our <Link href="/commercial" className="font-bold text-navy-700 underline">commercial services</Link>.
        </p>
      </Section>
    </>
  );
}
