import Link from "next/link";
import { LISTING_STATUS_LABEL } from "@/lib/cms/defaults";
import type { ListingDoc } from "@/lib/cms/schema";
import { isExternal, safeHref } from "@/lib/cms/safe-url";
import { cn } from "@/lib/utils";
import { CmsImage } from "./cms-image";

const BADGE: Record<ListingDoc["status"], string> = {
  available: "bg-ink-900 text-paper",
  coming_soon: "bg-brass-300 text-ink-950",
  application_pending: "bg-limestone text-ink-900 border border-ink-900",
  leased: "bg-travertine text-ink-900 border border-ink-900/40",
};

/** Featured properties as photo plates, stepping down the page. Used on /spaces and the home strip. */
export function ListingGrid({ listings, className }: { listings: readonly ListingDoc[]; className?: string }) {
  return (
    <ul className={cn("grid items-start gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {listings.map((l) => {
        const href = safeHref(l.href);
        const Title = <span className="font-display text-[clamp(2rem,1.5rem+1.4vw,2.9rem)] leading-[1.02] tracking-[-0.01em]">{l.title}</span>;
        return (
          <li key={l.id} className="group relative lg:[&:nth-child(3n+2)]:mt-14 lg:[&:nth-child(3n+3)]:mt-28">
            <div className="relative">
              <CmsImage src={l.image} alt={l.imageAlt || `${l.title}${l.location ? `, ${l.location}` : ""}`} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" frameClassName="aspect-[4/3]" className="transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transition-none" />
              <span className={cn("absolute left-0 top-0 px-3 py-1.5 text-[0.8125rem] font-semibold", BADGE[l.status])}>{LISTING_STATUS_LABEL[l.status]}</span>
            </div>
            <h3 className="mt-5">
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
            {l.location ? <p className="mt-2 text-muted">{l.location}</p> : null}
            {l.rent || l.specs ? (
              <p className="mt-3 flex flex-wrap items-baseline gap-x-4 border-t border-[var(--hairline)] pt-3 tabular-nums">
                {l.rent ? <span className="font-semibold">{l.rent}</span> : null}
                {l.specs ? <span className="text-muted">{l.specs}</span> : null}
              </p>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
