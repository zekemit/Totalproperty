import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Directory } from "@/components/site/directory";
import { HeroFacade } from "@/components/site/hero-facade";
import { Schematic } from "@/components/site/schematic";
import { Band, display, SectionTitle } from "@/components/site/sections";
import { ServicesShowcase } from "@/components/site/services-showcase";
import { Testimonials } from "@/components/site/testimonials";
import { serviceAreas, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} | ${siteConfig.areasPhraseAmp}` },
  description: `Residential, commercial, construction and lender-side property management across ${siteConfig.areasPhrase}. One accountable team based in ${siteConfig.place}.`,
  alternates: { canonical: "/" },
};

const HEADLINE = ["Property management", "that fights for", "your asset."] as const;

export default function HomePage() {
  const facts: string[] = [];
  if (siteConfig.foundedYear) facts.push(`Serving clients since ${siteConfig.foundedYear}`);
  for (const l of siteConfig.licenses) facts.push(l.label);

  return (
    <>
      {/* 1. Hero: stepped headline, a facade that draws itself, and the lobby directory overlapping the fold. */}
      <section className="relative isolate overflow-hidden bg-limestone text-text grain">
        <HeroFacade className="pointer-events-none absolute -right-10 top-4 hidden h-[112%] text-brass-600/30 [mask-image:linear-gradient(to_right,transparent_0%,black_38%)] lg:block" />
        <div className="container-page relative z-[1] pb-24 pt-12 sm:pt-16 lg:pb-14 lg:pt-14">
          <p className="fade-in mb-8 max-w-md text-[0.9375rem] font-semibold text-brass-700" style={{ "--i": 0 } as CSSProperties}>
            Based in {siteConfig.place}. Serving {siteConfig.areasPhrase}.
          </p>

          <h1 className={display.hero}>
            {HEADLINE.map((line, i) => (
              <span key={line} className="rise-line" style={{ "--i": i } as CSSProperties}>
                <span className="block lg:[padding-left:calc(var(--step)*8%)]" style={{ "--step": i } as CSSProperties}>
                  {line}{" "}
                </span>
              </span>
            ))}
          </h1>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-8">
            <div className="fade-in lg:col-span-5" style={{ "--i": 3 } as CSSProperties}>
              <p className="max-w-md text-xl leading-relaxed sm:text-[1.375rem]">
                Residential, commercial, construction and lender-side management across {siteConfig.areasPhrase}, handled by one accountable team.
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

            <div className="fade-in relative z-10 lg:col-span-5 lg:col-start-8 lg:translate-y-36" style={{ "--i": 4 } as CSSProperties}>
              <Directory />
            </div>
          </div>
        </div>
      </section>

      {/* 2. One foundation, four buildings. */}
      <Band tone="ink" labelledBy="one-team" className="lg:!pt-56">
        <div className="mb-16 grid gap-8 lg:grid-cols-12">
          <SectionTitle id="one-team" className="lg:col-span-7">
            Four clients.
            <br />
            One team.
          </SectionTitle>
          <p className="text-lg text-limestone/85 lg:col-span-4 lg:col-start-9 lg:self-end">
            Most property managers serve the landlord or the tenant. We take care of both sides of the lease, and the lender&rsquo;s side of a foreclosure, so nobody is left chasing someone else. Choose a client to see what they stand on.
          </p>
        </div>
        <Schematic />
      </Band>

      {/* 3. Services: a pinned drawing beside four tall index rows. */}
      <Band labelledBy="services-h">
        <SectionTitle id="services-h" className="mb-20" lede="Choose one service or all of them. We tailor the work to your requirements and budget.">
          What we manage
        </SectionTitle>
        <ServicesShowcase />
      </Band>

      <Testimonials />

      {/* 4. Where we work, set as type. */}
      <Band tone={siteConfig.testimonials.length > 0 ? "limestone" : "travertine"} labelledBy="where-h">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="where-h" className="font-sans text-base font-semibold text-brass-700">
              Where we work
            </h2>
            <p className="mt-3 max-w-[16rem] text-muted">
              {siteConfig.basedInSentence}
              {siteConfig.serviceAreaDetail ? ` ${siteConfig.serviceAreaDetail}.` : ""}
            </p>
          </div>
          <ul className="border-b border-[var(--hairline)] lg:col-span-9">
            {serviceAreas.map((a) => (
              <li key={a.code} className="flex items-baseline justify-between gap-6 border-t border-[var(--hairline)] py-2 sm:py-3">
                <span className="font-display text-[clamp(3rem,1rem+9vw,9.5rem)] leading-[0.95] tracking-[-0.025em]">{a.name}</span>
                <span aria-hidden="true" className="font-display text-2xl text-brass-700">{a.code}</span>
              </li>
            ))}
          </ul>
        </div>
        {facts.length > 0 ? (
          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-3 text-[0.9375rem] font-semibold lg:ml-[25%]">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : null}
      </Band>
    </>
  );
}
