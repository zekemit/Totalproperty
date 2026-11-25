import Link from "next/link";
import type { ServiceDoc } from "@/lib/cms/schema";
import { isExternal, safeHref } from "@/lib/cms/safe-url";
import { cn } from "@/lib/utils";
import { CmsImage } from "./cms-image";
import { Band, ChipList, display, type Tone } from "./sections";

const TONES: Tone[] = ["limestone", "travertine"];

/**
 * The reference's services page: a picture on one side, the service on the other, alternating.
 * Every visible service from the Services tab is one split; a service with no picture simply
 * uses the full width.
 */
export function ServiceSplits({ services }: { services: readonly ServiceDoc[] }) {
  return (
    <>
      {services.map((s, i) => {
        const href = safeHref(s.href);
        const flip = i % 2 === 1;
        const hasImage = Boolean(s.image);
        return (
          <Band key={s.id} id={s.id} tone={TONES[i % 2] as Tone} labelledBy={`${s.id}-h`} className="scroll-mt-20 !py-16 sm:!py-24">
            <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
              {hasImage ? (
                <div className={cn("lg:col-span-6", flip ? "lg:order-2 lg:col-start-7" : "")}>
                  <div className="relative">
                    <span aria-hidden="true" className={cn("absolute -bottom-4 hidden size-full border border-brass-600/60 lg:block", flip ? "-left-4" : "-right-4")} />
                    <CmsImage src={s.image} alt={s.imageAlt} sizes="(min-width: 1024px) 46vw, 100vw" frameClassName="aspect-[4/3]" />
                  </div>
                </div>
              ) : null}
              <div className={cn(hasImage ? "lg:col-span-5" : "lg:col-span-9", hasImage && (flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"))}>
                <p className="mb-5 text-[0.9375rem] font-semibold text-brass-700">
                  <span aria-hidden="true" className="mr-3 font-display text-xl">{String(i + 1).padStart(2, "0")}</span>
                  {s.audience ? `For ${s.audience.toLowerCase()}` : "Service"}
                </p>
                <h2 id={`${s.id}-h`} className={cn(display.section, "max-w-[14ch]")}>{s.title}</h2>
                {s.summary ? <p className="mt-6 max-w-xl text-lg text-muted">{s.summary}</p> : null}
                {s.items.length > 0 ? <ChipList items={s.items} className="mt-8" /> : null}
                {href && s.cta ? (
                  isExternal(href) ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="link-line mt-8 inline-block font-semibold text-ink-900">
                      {s.cta}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={href} className="link-line mt-8 inline-block font-semibold text-ink-900">{s.cta}</Link>
                  )
                ) : null}
              </div>
            </div>
          </Band>
        );
      })}
    </>
  );
}
