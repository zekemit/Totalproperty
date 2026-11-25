import Link from "next/link";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import { Directory } from "@/components/site/directory";
import { HeroSlides } from "@/components/site/hero-slides";
import { ListingGrid } from "@/components/site/listings";
import { PropertyTypes } from "@/components/site/property-types";
import { Schematic } from "@/components/site/schematic";
import { Band, display, SectionTitle, StatementBand } from "@/components/site/sections";
import { ServicesShowcase } from "@/components/site/services-showcase";
import { Testimonials } from "@/components/site/testimonials";
import { getContent } from "@/lib/cms/content";
import { safeHref } from "@/lib/cms/safe-url";
import { pageMetadata } from "@/lib/page-metadata";
import { PHOTOS } from "@/lib/photos";

export async function generateMetadata() {
  return pageMetadata("home");
}

const SLIDES = [
  { src: PHOTOS.slideOffice.src, alt: PHOTOS.slideOffice.alt, label: "Office" },
  { src: PHOTOS.slideRetail.src, alt: PHOTOS.slideRetail.alt, label: "Retail" },
  { src: PHOTOS.slideCondos.src, alt: PHOTOS.slideCondos.alt, label: "Residential" },
  { src: PHOTOS.slideIndustrial.src, alt: PHOTOS.slideIndustrial.alt, label: "Industrial" },
] as const;

export default async function HomePage() {
  const { site, home, services, listings } = await getContent();
  const primary = safeHref(home.primaryCta.href);
  const secondary = safeHref(home.secondaryCta.href);
  const lines = home.heroLines;
  const facts: string[] = [];
  if (site.foundedYear) facts.push(`Serving clients since ${site.foundedYear}`);
  for (const l of site.licenses) facts.push(l.label);

  return (
    <>
      {/* 1. Hero, in the reference's order: name and promise on the left, the fading property slides on the right. */}
      <section className="on-dark relative isolate overflow-hidden bg-ink-900 text-limestone drawing-grid">
        <div className="container-page relative z-[1] grid items-center gap-12 pb-16 pt-12 sm:pt-16 lg:grid-cols-12 lg:gap-10 lg:pb-24 lg:pt-20">
          <div className="lg:col-span-7">
            <h1 className="font-display text-[clamp(3rem,1rem+6.4vw,7.5rem)] leading-[0.96] tracking-[-0.025em]">
              {lines.map((line, i) => (
                <span key={line} className="rise-line" style={{ "--i": i } as CSSProperties}>
                  <span className="block lg:[padding-left:calc(var(--step)*8%)]" style={{ "--step": i } as CSSProperties}>
                    {line}{" "}
                  </span>
                </span>
              ))}
              <span className="rise-line" style={{ "--i": lines.length } as CSSProperties}>
                <span className="font-display-italic mt-6 block text-[clamp(1.35rem,1rem+1.3vw,2.1rem)] leading-[1.15] tracking-normal text-brass-300 lg:pl-[16%]">
                  Property management in {site.place} and across {site.areasPhrase}
                </span>
              </span>
            </h1>

            <div className="fade-in mt-10 lg:pl-[16%]" style={{ "--i": lines.length + 1 } as CSSProperties}>
              <p className="max-w-xl text-xl leading-relaxed text-limestone/90">{home.heroLede}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {primary && home.primaryCta.label ? (
                  <Button asChild size="lg" variant="accent">
                    <Link href={primary}>{home.primaryCta.label}</Link>
                  </Button>
                ) : null}
                {secondary && home.secondaryCta.label ? (
                  <Button asChild size="lg" variant="outline-light">
                    <Link href={secondary}>{home.secondaryCta.label}</Link>
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="fade-in lg:col-span-5" style={{ "--i": 2 } as CSSProperties}>
            <HeroSlides slides={SLIDES} />
          </div>
        </div>
      </section>

      {/* 2. The statement band. */}
      <StatementBand>{home.statement}</StatementBand>

      {/* 3. Property types we manage. */}
      <PropertyTypes />

      {/* 4. Why us, beside the audience directory. */}
      <Band tone="travertine" labelledBy="why-h">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="why-h" className={`${display.section} max-w-[11ch]`}>One team, every side of the lease.</h2>
            {home.valueProps.length > 0 ? (
              <ol className="mt-12 border-b border-[var(--hairline)]">
                {home.valueProps.map((v, i) => (
                  <li key={v.title} className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-[var(--hairline)] py-6">
                    <span aria-hidden="true" className="font-display text-3xl leading-none text-brass-700">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className={display.sub}>{v.title}</h3>
                      {v.text ? <p className="mt-2 max-w-md text-muted">{v.text}</p> : null}
                    </div>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-6">
            <Directory />
          </div>
        </div>
      </Band>

      {/* 5. One foundation, four buildings. */}
      <Band tone="ink" labelledBy="one-team">
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

      {/* 6. Services: a pinned drawing beside tall index rows. */}
      {services.length > 0 ? (
        <Band labelledBy="services-h">
          <SectionTitle id="services-h" className="mb-20" lede="Choose one service or all of them. We tailor the work to your requirements and budget.">
            What we manage
          </SectionTitle>
          <ServicesShowcase services={services} />
        </Band>
      ) : null}

      {/* 7. Available spaces, only when Rafi has listed some. */}
      {listings.length > 0 ? (
        <Band tone="travertine" labelledBy="spaces-h">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionTitle id="spaces-h">Available now</SectionTitle>
            <Link href="/spaces" className="link-line font-semibold text-ink-900">See all spaces</Link>
          </div>
          <ListingGrid listings={listings.slice(0, 3)} />
        </Band>
      ) : null}

      <Testimonials />

      {/* 8. Where we work, set as type. */}
      <Band tone={site.testimonials.length > 0 ? "limestone" : "travertine"} labelledBy="where-h">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-3">
            <h2 id="where-h" className="font-sans text-base font-semibold text-brass-700">Where we work</h2>
            <p className="mt-3 max-w-[16rem] text-muted">
              {site.basedInSentence}
              {site.serviceAreaDetail ? ` ${site.serviceAreaDetail}.` : ""}
            </p>
          </div>
          <ul className="border-b border-[var(--hairline)] lg:col-span-9">
            {site.serviceAreas.map((a) => (
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
