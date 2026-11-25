import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Building, type BuildingKind } from "./buildings";
import { LogoMark } from "./logo";

/* ───────────────────────── Bands (page sections) ───────────────────────── */

export type Tone = "limestone" | "travertine" | "ink" | "ink-deep";

const tones: Record<Tone, string> = {
  limestone: "bg-limestone text-text grain",
  travertine: "bg-travertine text-text grain",
  ink: "on-dark bg-ink-900 text-limestone drawing-grid",
  "ink-deep": "on-dark bg-ink-950 text-limestone drawing-grid",
};

/** Vertical rhythm lives here and only here, so bands never fight over margins. */
export function Band({
  id,
  tone = "limestone",
  className,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: Tone;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-20 sm:py-28 lg:py-32", tones[tone], className)}>
      <div className="container-page relative z-[1]">{children}</div>
    </section>
  );
}

/** A hairline with end ticks and a short label, borrowed from architectural dimensioning. */
export function Rule({ label, className }: { label?: string; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("dim text-sm", className)}>
      {label ? <span className="opacity-80">{label}</span> : null}
      <i />
    </div>
  );
}

/** Label column on the left, content on the right: the site's default asymmetric row. */
export function EditorialRow({ label, children, className }: { label?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("grid gap-x-12 gap-y-6 lg:grid-cols-12", className)}>
      <div className="lg:col-span-3">{label}</div>
      <div className="lg:col-span-9">{children}</div>
    </div>
  );
}

export const display = {
  hero: "font-display text-[clamp(3.25rem,1rem+7.4vw,9rem)] leading-[0.96] tracking-[-0.025em]",
  page: "font-display text-[clamp(3rem,1.4rem+6.4vw,7.75rem)] leading-[0.96] tracking-[-0.025em]",
  section: "font-display text-[clamp(2.6rem,1.5rem+4.2vw,5.5rem)] leading-[0.95] tracking-[-0.02em]",
  sub: "font-display text-[clamp(2rem,1.4rem+2.2vw,3.25rem)] leading-[1] tracking-[-0.015em]",
} as const;

export function SectionTitle({ id, children, lede, className }: { id?: string; children: ReactNode; lede?: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-4xl", className)}>
      <h2 id={id} className={display.section}>
        {children}
      </h2>
      {lede ? <p className="mt-6 max-w-xl text-lg opacity-85">{lede}</p> : null}
    </div>
  );
}

/* ───────────────────────── Page hero ───────────────────────── */

/**
 * Interior-page opener. `title` uses "|" to break lines; each later line steps in on large
 * screens so the headline has shape. Lines rise out of a mask on load (see globals.css).
 */
export function PageHero({
  kicker,
  title,
  lede,
  children,
  tone = "limestone",
  art,
}: {
  kicker?: string;
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
  tone?: Tone;
  /** A building elevation (or the four-building "skyline") drawn at the right edge of the headline. */
  art?: BuildingKind | "skyline";
}) {
  const lines = title.split("|");
  const dark = tone === "ink" || tone === "ink-deep";
  return (
    <Band tone={tone} className="!pb-16 !pt-14 sm:!pt-20 lg:!pb-20 lg:!pt-16">
      {kicker ? <p className="mb-8 max-w-md text-[0.9375rem] font-semibold text-brass-700 [.on-dark_&]:text-brass-300">{kicker}</p> : null}
      <div className="relative">
        {art ? (
          // Bound to the headline's own height, so the drawing can never reach the lede below it.
          <div aria-hidden="true" className="fade-in pointer-events-none absolute bottom-0 right-0 hidden lg:block lg:h-full lg:min-h-[17rem] lg:max-h-[26rem]" style={{ "--i": 2 } as CSSProperties}>
            {art === "skyline" ? (
              <div className={cn("flex h-36 items-end gap-3 xl:h-44", dark ? "text-brass-300/60" : "text-brass-600/55")}>
                {(["owners", "commercial", "lenders", "tenants"] as const).map((k) => (
                  <Building key={k} kind={k} className="h-full w-auto" />
                ))}
              </div>
            ) : (
              <Building kind={art} className={cn("h-full w-auto", dark ? "text-brass-300/60" : "text-brass-600/55")} />
            )}
          </div>
        ) : null}
        <h1 className={cn(display.page, "max-w-[18ch] sm:max-w-none")}>
          {lines.map((line, i) => (
            <span key={line} className="rise-line" style={{ "--i": i, "--step": i } as CSSProperties}>
              <span className="lg:[padding-left:calc(var(--step)*7%)]">{line}{" "}</span>
            </span>
          ))}
        </h1>
      </div>
      {lede || children ? (
        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          <div className="fade-in lg:col-span-6 lg:col-start-6" style={{ "--i": lines.length } as CSSProperties}>
            {lede ? <p className="max-w-xl text-xl leading-relaxed opacity-90 sm:text-[1.375rem]">{lede}</p> : null}
            {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
          </div>
        </div>
      ) : null}
    </Band>
  );
}

/* ───────────────────────── Lists ───────────────────────── */

/** Hairline-ruled lines with a brass tick; the editorial replacement for dashed bullet lists. */
export function RuledList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("border-b border-[var(--hairline)]", className)}>
      {items.map((item) => (
        <li key={item} className="relative border-t border-[var(--hairline)] py-4 pl-7 leading-snug">
          <span aria-hidden="true" className="absolute left-0 top-[1.55rem] h-px w-4 bg-brass-600 [.on-dark_&]:bg-brass-300" />
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Index rows. Number them only when the content is a true sequence. */
export function IndexRows({
  items,
  numbered = false,
  className,
}: {
  items: readonly { title: string; text?: ReactNode }[];
  numbered?: boolean;
  className?: string;
}) {
  const Tag = numbered ? "ol" : "ul";
  return (
    <Tag className={cn("border-b border-[var(--hairline)]", className)}>
      {items.map((item, i) => (
        <li key={item.title} className="grid gap-x-8 gap-y-2 border-t border-[var(--hairline)] py-8 sm:grid-cols-12">
          {numbered ? (
            <span aria-hidden="true" className="font-display text-5xl leading-none text-brass-700 sm:col-span-2 [.on-dark_&]:text-brass-300">
              {String(i + 1).padStart(2, "0")}
            </span>
          ) : null}
          <h3 className={cn(display.sub, numbered ? "sm:col-span-5" : "sm:col-span-6")}>{item.title}</h3>
          {item.text ? <div className={cn("opacity-85", numbered ? "sm:col-span-5" : "sm:col-span-6")}>{item.text}</div> : null}
        </li>
      ))}
    </Tag>
  );
}

export function PullQuote({ children, cite, className }: { children: ReactNode; cite?: string; className?: string }) {
  return (
    <figure className={cn("relative", className)}>
      <span aria-hidden="true" className="mb-6 block h-px w-24 bg-brass-600 [.on-dark_&]:bg-brass-300" />
      <blockquote className="font-display-italic text-[clamp(2.2rem,1.3rem+3.8vw,5rem)] leading-[1.02] tracking-[-0.015em]">{children}</blockquote>
      {cite ? <figcaption className="mt-6 text-[0.9375rem] opacity-80">{cite}</figcaption> : null}
    </figure>
  );
}

/** A real sequence in long-form sentences: numbered rows, ruled. */
export function Sequence({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ol className={cn("border-b border-[var(--hairline)]", className)}>
      {items.map((text, i) => (
        <li key={text} className="grid grid-cols-[3.25rem_1fr] gap-4 border-t border-[var(--hairline)] py-5 sm:grid-cols-[5rem_1fr]">
          <span aria-hidden="true" className="font-display text-3xl leading-none text-brass-700 sm:text-4xl [.on-dark_&]:text-brass-300">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="max-w-2xl leading-snug">{text}</p>
        </li>
      ))}
    </ol>
  );
}

/** Questions as ruled rows that open in place. Native <details>: keyboard and screen-reader friendly, no JavaScript. */
export function Faq({ items, className }: { items: readonly { q: string; a: string }[]; className?: string }) {
  return (
    <div className={cn("border-b border-[var(--hairline)]", className)}>
      {items.map((f) => (
        <details key={f.q} className="group border-t border-[var(--hairline)]">
          <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-8 py-5 [&::-webkit-details-marker]:hidden">
            <span className={display.sub}>{f.q}</span>
            <span aria-hidden="true" className="relative size-6 shrink-0">
              <span className="absolute left-0 top-1/2 h-px w-6 bg-current" />
              <span className="absolute left-0 top-1/2 h-px w-6 rotate-90 bg-current transition-transform duration-300 group-open:scale-x-0 motion-reduce:transition-none" />
            </span>
          </summary>
          <p className="max-w-2xl pb-8 text-lg text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ───────────────────────── Statement band ───────────────────────── */

/**
 * The reference site's signature: the pit bull mark above a one-line statement, under every page's
 * opening. Here the mark sits beside the statement, which is set large with a brass underline.
 */
export function StatementBand({ children, tone = "travertine" }: { children: ReactNode; tone?: Tone }) {
  return (
    <Band tone={tone} className="!py-12 sm:!py-16 lg:!py-20">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-10">
        <LogoMark className="h-20 sm:h-24" />
        <div>
          <h2 className="max-w-4xl font-display text-[clamp(2rem,1.2rem+3.2vw,4.25rem)] leading-[1.02] tracking-[-0.02em]">{children}</h2>
          <span aria-hidden="true" className="mt-5 block h-[5px] w-28 bg-brass-600" />
        </div>
      </div>
    </Band>
  );
}

/** Short capability chips as a two-column ruled list (the reference's services lists). */
export function ChipList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("grid border-b border-[var(--hairline)] sm:grid-cols-2 sm:gap-x-10", className)}>
      {items.map((item) => (
        <li key={item} className="relative border-t border-[var(--hairline)] py-3 pl-7 leading-snug">
          <span aria-hidden="true" className="absolute left-0 top-[1.4rem] h-px w-4 bg-brass-600 [.on-dark_&]:bg-brass-300" />
          {item}
        </li>
      ))}
    </ul>
  );
}
