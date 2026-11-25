import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ChevronRight, HardHat, House, Landmark, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading } from "@/components/site/sections";
import { TeamDiagram } from "@/components/site/team-diagram";
import { pillars, serviceAreas, siteConfig, type Pillar } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} | Virginia, Maryland, Pennsylvania & DC` },
  description:
    "Residential, commercial, construction and lender-side property management across Virginia, Maryland, Pennsylvania and DC. One accountable team based in Purcellville, VA.",
  alternates: { canonical: "/" },
};

const doors = [
  { href: "/owners#analysis", title: "I own a rental home", text: "Get a free rental analysis for your property." },
  { href: "/commercial", title: "I own commercial property", text: "Leasing, CAM budgets and construction under one team." },
  { href: "/lenders", title: "I'm a lender or servicer", text: "Foreclosure properties renovated, landscaped and cleaned before they go to market." },
  { href: "/tenants", title: "I rent from Total Property", text: "Pay rent, report a repair, find your portal." },
] as const;

const pillarIcons: Record<Pillar["id"], typeof House> = {
  residential: House,
  commercial: Building2,
  construction: HardHat,
  lender: Landmark,
};

export default function HomePage() {
  const badges: string[] = [`Based in ${siteConfig.address.locality}, ${siteConfig.address.region}`];
  if (siteConfig.foundedYear) badges.push(`Serving clients since ${siteConfig.foundedYear}`);
  for (const l of siteConfig.licenses) badges.push(`${l.jurisdiction} license ${l.number}`);

  return (
    <>
      <section className="border-b border-line">
        <div className="container-page grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h1>
              Property management that fights for your&nbsp;asset.
            </h1>
            <p className="mt-6 max-w-xl font-serif text-xl leading-relaxed text-muted sm:text-[1.375rem]">
              Residential, commercial, construction and lender-side management across Virginia, Maryland, Pennsylvania and DC, handled by one accountable team.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="accent">
                <Link href="/owners#analysis">Get a free rental analysis</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/tenants">Tenant portal and repairs</Link>
              </Button>
            </div>
          </div>

          <nav aria-labelledby="who-are-you" className="lg:col-span-5">
            <h2 id="who-are-you" className="text-xl">Who are you?</h2>
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-xl border border-line bg-white shadow-card">
              {doors.map((d) => (
                <li key={d.href}>
                  <Link href={d.href} className="group flex items-center justify-between gap-4 p-5 hover:bg-alabaster-2">
                    <span>
                      <span className="block text-lg font-extrabold text-navy-800">{d.title}</span>
                      <span className="mt-0.5 block text-[0.9375rem] text-muted">{d.text}</span>
                    </span>
                    <ChevronRight aria-hidden="true" className="size-6 shrink-0 text-copper transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>

      <Section tone="dark" labelledBy="one-team">
        <SectionHeading
          id="one-team"
          title="Four clients. One team."
          lede="Most property managers serve the landlord or the tenant. We take care of both sides of the lease, and the lender's side of a foreclosure, so nobody is left chasing someone else."
        />
        <TeamDiagram />
      </Section>

      <Section labelledBy="services">
        <SectionHeading id="services" title="What we manage" lede="Choose one service or all of them. We tailor the work to your requirements and budget." />
        <ul className="grid gap-px overflow-hidden rounded-xl border border-line bg-line shadow-card md:grid-cols-2">
          {pillars.map((p) => {
            const Icon = pillarIcons[p.id];
            return (
              <li key={p.id} className="flex flex-col bg-white p-8">
                <Icon aria-hidden="true" className="size-9 text-copper" />
                <h3 className="mt-4 text-2xl">{p.title}</h3>
                <p className="mt-3 flex-1">{p.summary}</p>
                <Link href={p.href} className="mt-5 inline-flex min-h-11 items-center gap-1 self-start font-bold text-navy-700 underline underline-offset-4 hover:text-navy-900">
                  {p.cta}
                  <ChevronRight aria-hidden="true" className="size-5" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section tone="panel" labelledBy="coverage" className="!py-12">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-4">
            <h2 id="coverage" className="text-2xl">Where we work</h2>
            <p className="mt-2 text-muted">Our office is in Purcellville, in Loudoun County, Virginia.</p>
          </div>
          <ul className="flex flex-wrap gap-3 lg:col-span-8">
            {serviceAreas.map((a) => (
              <li key={a.code} className="rounded-lg border border-navy-800/30 bg-white px-5 py-3 text-lg font-extrabold text-navy-800">{a.name}</li>
            ))}
            {badges.map((b) => (
              <li key={b} className="flex items-center gap-2 rounded-lg border border-navy-800/30 bg-white px-5 py-3 font-bold text-navy-800">
                <MapPin aria-hidden="true" className="size-5 text-copper" />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark" labelledBy="start">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <h2 id="start">Tell us about your property.</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-on-dark">We’ll look at it and tell you what we would do. There’s no charge for the analysis.</p>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <Button asChild size="lg" variant="accent"><Link href="/owners#analysis">Get a free rental analysis</Link></Button>
            <Button asChild size="lg" variant="outline-light"><Link href="/contact">Contact us</Link></Button>
          </div>
        </div>
      </Section>
    </>
  );
}
