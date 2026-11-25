"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { commercialLandlord, construction, lenderServices, ownerServices } from "@/lib/catalog";
import { pillars, type Pillar } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Building, type BuildingKind } from "./buildings";
import { display, RuledList } from "./sections";

const KIND: Record<Pillar["id"], BuildingKind> = { residential: "owners", commercial: "commercial", construction: "construction", lender: "lenders" };

const BULLETS: Record<Pillar["id"], readonly string[]> = {
  residential: ownerServices.items,
  commercial: commercialLandlord.items.slice(0, 4),
  construction: construction.items.slice(0, 4),
  lender: lenderServices.items.slice(0, 3),
};

/**
 * Split-screen index of the four services. On large screens the drawing on the left is
 * pinned and changes as each row on the right scrolls into the middle of the viewport;
 * on small screens each row carries its own drawing. Without JavaScript every row still
 * reads in order.
 */
export function ServicesShowcase() {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const rows = list.current?.querySelectorAll<HTMLElement>("[data-row]");
    if (!rows || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.row));
      },
      { rootMargin: "-42% 0px -42% 0px" },
    );
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);

  const current = pillars[active] ?? pillars[0]!;

  return (
    <div className="grid gap-x-16 lg:grid-cols-12">
      <div className="relative hidden lg:col-span-5 lg:block" aria-hidden="true">
        <div className="on-dark sticky top-24 flex h-[calc(100svh-8rem)] max-h-[42rem] flex-col justify-between border border-brass-500/50 bg-ink-900 p-8 text-limestone">
          <p className="font-display text-[9rem] leading-none text-brass-300">{String(active + 1).padStart(2, "0")}</p>
          <div className="relative mx-auto my-6 w-full max-w-[17rem] flex-1">
            {pillars.map((p, i) => (
              <div key={p.id} className={cn("absolute inset-0 flex items-end transition-opacity duration-500 motion-reduce:transition-none", i === active ? "opacity-100" : "opacity-0")}>
                <Building kind={KIND[p.id]} active className="max-h-full" />
              </div>
            ))}
          </div>
          <p className="border-t border-limestone/20 pt-4 font-display text-3xl leading-none">{current.title}</p>
        </div>
      </div>

      <ol ref={list} className="lg:col-span-7">
        {pillars.map((p, i) => (
          <li key={p.id} data-row={i} className="border-t border-[var(--hairline)] py-14 first:border-t-0 first:pt-0 lg:py-28 lg:first:pt-2">
            <div className="mb-8 flex items-end gap-6 lg:hidden">
              <Building kind={KIND[p.id]} active className="w-32 text-brass-600" />
              <span aria-hidden="true" className="font-display text-7xl leading-none text-brass-700">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className={cn(display.section, "max-w-[12ch]")}>{p.title}</h3>
            <p className="mt-6 max-w-lg text-lg text-muted">{p.summary}</p>
            <RuledList items={BULLETS[p.id]} className="mt-8 max-w-xl" />
            <Link href={p.href} className="link-line mt-8 inline-block font-semibold text-ink-900">
              {p.cta}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
