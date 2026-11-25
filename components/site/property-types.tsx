import Link from "next/link";
import { getContent } from "@/lib/cms/content";
import { isExternal, safeHref } from "@/lib/cms/safe-url";
import { CmsImage } from "./cms-image";
import { Band, SectionTitle } from "./sections";

const ASPECTS = ["aspect-[4/5]", "aspect-[5/4]", "aspect-square"] as const;

/**
 * "Property Types We Manage": the reference site's five photo cards plus Residential, as photo plates
 * that step down the page the way the headline steps in. Whole card is one stretched link (the title).
 * Content (and visibility) comes from the Services tab of /admin.
 */
export async function PropertyTypes({ id = "types-h", limit }: { id?: string; limit?: number }) {
  const { propertyTypes } = await getContent();
  const items = typeof limit === "number" ? propertyTypes.slice(0, limit) : propertyTypes;
  if (items.length === 0) return null;
  return (
    <Band tone="limestone" labelledBy={id}>
      <div className="mb-16 grid gap-8 lg:grid-cols-12">
        <SectionTitle id={id} className="lg:col-span-7">
          Property types
          <br />
          we manage
        </SectionTitle>
        <p className="text-lg text-muted lg:col-span-4 lg:col-start-9 lg:self-end">
          With our &ldquo;one stop&rdquo; property management approach, we protect our clients&rsquo; assets and overdeliver on results.
        </p>
      </div>
      <ul className="grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => {
          const href = safeHref(p.href);
          const Title = <span className="font-display text-[clamp(2.2rem,1.6rem+1.6vw,3.25rem)] leading-none tracking-[-0.01em]">{p.title}</span>;
          return (
            <li key={p.id} className="group relative lg:[&:nth-child(3n+2)]:mt-16 lg:[&:nth-child(3n+3)]:mt-32">
              <CmsImage src={p.image} alt={p.imageAlt} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" frameClassName={ASPECTS[i % ASPECTS.length] as string} className="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
              <div className="mt-5 flex items-baseline gap-4">
                <span aria-hidden="true" className="font-display text-xl text-brass-700">{String(i + 1).padStart(2, "0")}</span>
                <h3>
                  {href ? (
                    isExternal(href) ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="after:absolute after:inset-0">
                        {Title}
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <Link href={href} className="after:absolute after:inset-0">{Title}</Link>
                    )
                  ) : (
                    Title
                  )}
                </h3>
              </div>
              {p.text ? <p className="mt-3 max-w-sm pl-10 text-muted">{p.text}</p> : null}
            </li>
          );
        })}
      </ul>
    </Band>
  );
}
