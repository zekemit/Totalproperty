import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Page opener for interior pages: one h1, a serif lede, optional actions. */
export function PageHero({ kicker, title, lede, children }: { kicker?: string; title: ReactNode; lede?: ReactNode; children?: ReactNode }) {
  return (
    <section className="border-b border-line bg-alabaster">
      <div className="container-page py-14 sm:py-20">
        {kicker ? <p className="kicker mb-3">{kicker}</p> : null}
        <h1 className="max-w-4xl">{title}</h1>
        {lede ? <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-muted sm:text-[1.375rem]">{lede}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}

type Tone = "default" | "panel" | "dark";

const tones: Record<Tone, string> = {
  default: "bg-alabaster",
  panel: "bg-alabaster-2",
  dark: "on-dark bg-navy-800 text-muted-on-dark [&_h2]:text-white [&_h3]:text-white",
};

/** Vertical rhythm lives here and only here, so sections never fight over margins. */
export function Section({ id, tone = "default", className, children, labelledBy }: { id?: string; tone?: Tone; className?: string; children: ReactNode; labelledBy?: string }) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 sm:py-20", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function SectionHeading({ id, title, lede, className }: { id?: string; title: ReactNode; lede?: ReactNode; className?: string }) {
  return (
    <div className={cn("mb-10 max-w-3xl", className)}>
      <h2 id={id}>{title}</h2>
      {lede ? <p className="mt-4 text-lg text-muted [.on-dark_&]:text-muted-on-dark">{lede}</p> : null}
    </div>
  );
}

/** A plain bulleted list used for service catalogues. */
export function CheckList({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((item) => (
        <li key={item} className="relative pl-7">
          <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-0.5 w-4 bg-copper" />
          {item}
        </li>
      ))}
    </ul>
  );
}
