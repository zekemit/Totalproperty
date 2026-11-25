"use client";

import { useState } from "react";
import Link from "next/link";
import { CLIENTS, FUNCTIONS, type Client } from "@/lib/schematic";
import { cn } from "@/lib/utils";
import { Building } from "./buildings";
import { RuledList } from "./sections";

/**
 * Four buildings on one foundation. Selecting a client (click, tap, keyboard, or hovering
 * with a mouse) lights the foundation courses that client relies on and swaps the detail.
 */
export function Schematic() {
  const [activeId, setActiveId] = useState<Client["id"]>("owners");
  const active = CLIENTS.find((c) => c.id === activeId) ?? CLIENTS[0]!;

  return (
    <div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4 md:gap-x-8">
        {CLIENTS.map((c) => {
          const isActive = c.id === activeId;
          return (
            <div key={c.id} className="flex flex-col">
              <button
                type="button"
                aria-pressed={isActive}
                aria-describedby="schematic-detail"
                onClick={() => setActiveId(c.id)}
                onPointerEnter={(e) => e.pointerType === "mouse" && setActiveId(c.id)}
                className="group flex flex-1 flex-col items-center text-left"
              >
                <Building kind={c.id} active={isActive} className="max-w-[15rem] transition-transform duration-500 ease-out group-hover:-translate-y-1 motion-reduce:transition-none" />
                <span className="mt-4 block w-full">
                  <span className={cn("block font-display text-[1.9rem] leading-none sm:text-4xl", isActive ? "text-brass-300" : "text-limestone")}>{c.name}</span>
                  <span className="mt-1 block text-sm text-sand">{c.kind}</span>
                </span>
              </button>
              <span aria-hidden="true" className={cn("mx-auto mt-4 block h-8 w-px transition-colors duration-500", isActive ? "bg-brass-300" : "bg-limestone/25")} />
            </div>
          );
        })}
      </div>

      {/* The shared foundation: the seven functions every client stands on. */}
      <div className="border border-limestone/25">
        <p className="border-b border-limestone/25 px-4 py-2 text-sm text-sand">One team, one foundation</p>
        <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
          {FUNCTIONS.map((fn) => {
            const lit = (active.uses as readonly string[]).includes(fn);
            return (
              <li
                key={fn}
                data-lit={lit}
                className={cn(
                  "border-b border-r border-limestone/15 px-4 py-5 text-[0.9375rem] font-semibold transition-colors duration-500 motion-reduce:transition-none",
                  lit ? "bg-brass-300 text-ink-950" : "bg-ink-800 text-sand",
                )}
              >
                {fn}
              </li>
            );
          })}
        </ul>
      </div>

      <div id="schematic-detail" role="region" aria-live="polite" aria-label={`${active.name}: how we work`} className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h3 className="font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.75rem)] leading-none text-brass-300">{active.name}</h3>
          <p className="mt-5 max-w-md text-lg text-limestone/90">{active.summary}</p>
          <Link href={active.href} className="link-line mt-6 inline-block font-semibold text-limestone">
            {active.cta}
          </Link>
        </div>
        <div className="lg:col-span-7">
          <RuledList items={active.bullets} />
        </div>
      </div>
    </div>
  );
}
