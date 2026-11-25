import { Button } from "@/components/ui/button";
import { CmsImage } from "@/components/site/cms-image";
import { Band, display, PageHero, RuledList, StatementBand } from "@/components/site/sections";
import { getContent } from "@/lib/cms/content";
import { safeHref } from "@/lib/cms/safe-url";
import { pageMetadata } from "@/lib/page-metadata";
import { PHOTOS } from "@/lib/photos";

export async function generateMetadata() {
  return pageMetadata("careers");
}

export default async function CareersPage() {
  const { site, careers, propertyTypes } = await getContent();
  const tiles = propertyTypes.slice(0, 4);
  const applyHref = (title: string, href: string) => safeHref(href) ?? `mailto:${site.email}?subject=${encodeURIComponent(`Application: ${title}`)}`;
  return (
    <>
      <PageHero kicker="Careers" title="Join our property|management team." lede={careers.intro || undefined}>
        <Button asChild size="lg" variant="accent"><a href="#openings">See openings</a></Button>
      </PageHero>

      <StatementBand>The highest quality service to our clients</StatementBand>

      <Band labelledBy="openings-h" id="openings" className="scroll-mt-16">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 id="openings-h" className={display.section}>Careers</h2>
            <p className="mt-6 max-w-md text-lg text-muted">
              We are hiring experienced and motivated professionals who are passionate about providing a high-quality client experience.
            </p>
            {careers.jobs.length > 0 ? (
              <ul className="mt-10 border-b border-[var(--hairline)]">
                {careers.jobs.map((j) => (
                  <li key={j.id} className="grid items-center gap-4 border-t border-[var(--hairline)] py-6 sm:grid-cols-[1fr_auto]">
                    <div>
                      <h3 className={display.sub}>{j.title}</h3>
                      {j.summary ? <p className="mt-2 max-w-md text-muted">{j.summary}</p> : null}
                    </div>
                    <Button asChild size="sm" variant="outline">
                      <a href={applyHref(j.title, j.href)}>
                        Apply<span className="sr-only"> for {j.title}</span>
                      </a>
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="sheet mt-10 p-6 sm:p-8">
                <p className="text-lg">
                  There are no openings posted right now. We are always glad to hear from experienced, motivated people: send a note and your r&eacute;sum&eacute; to{" "}
                  <a href={`mailto:${site.email}?subject=${encodeURIComponent("Career inquiry")}`} className="link-line font-semibold">{site.email}</a>.
                </p>
              </div>
            )}
          </div>

          {tiles.length > 0 ? (
            <div className="lg:col-span-5 lg:col-start-8">
              <h2 className="font-sans text-base font-semibold text-brass-700">Property types we manage</h2>
              <ul className="mt-5 grid grid-cols-2 gap-3">
                {tiles.map((t) => (
                  <li key={t.id} className="relative">
                    <CmsImage src={t.image} alt={t.imageAlt} sizes="(min-width: 1024px) 20vw, 45vw" frameClassName="aspect-[4/3]" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent px-3 pb-2 pt-8 font-display text-2xl leading-none text-limestone">{t.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </Band>

      {careers.benefits.length > 0 ? (
        <Band tone="ink" labelledBy="why-work-h">
          <div className="grid items-center gap-16 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <h2 id="why-work-h" className={display.section}>Why work here?</h2>
              <RuledList items={careers.benefits} className="mt-10" />
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <CmsImage src={PHOTOS.team3.src} alt={PHOTOS.team3.alt} sizes="(min-width: 1024px) 40vw, 100vw" frameClassName="aspect-[4/3]" />
            </div>
          </div>
        </Band>
      ) : null}
    </>
  );
}
