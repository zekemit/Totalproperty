"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { vacancyCost } from "@/lib/calc/vacancy";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const MONTHS = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"] as const;
const TICKS = [0, 30, 60, 90, 120] as const;

function parseRent(raw: string): number {
  const cleaned = raw.replace(/[,$\s]/g, "");
  return cleaned === "" ? Number.NaN : Number(cleaned);
}

/**
 * Eases a displayed number toward its target. Every update goes through a frame callback
 * (so there is no synchronous state change inside the effect), and reduced motion
 * collapses the duration to zero so the final value appears on the next frame.
 */
function useTween(target: number, duration = 650): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const startValue = from.current;
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : duration;
    let raf = 0;
    const step = (now: number) => {
      const t = ms === 0 ? 1 : Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = startValue + (target - startValue) * eased;
      from.current = next;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/**
 * Vacancy cost, as an instrument: a brass slider, a year bar whose hatched section grows
 * with the days you enter, and a tweened cost figure. It is arithmetic on the visitor's
 * own numbers (see lib/calc/vacancy.ts), never a market-rent estimate.
 */
export function VacancyInstrument({ onUseRent }: { onUseRent: (rent: string) => void }) {
  const rentId = useId();
  const daysId = useId();
  const [rent, setRent] = useState("");
  const [days, setDays] = useState(30);
  const [added, setAdded] = useState(false);

  const result = vacancyCost({ monthlyRent: parseRent(rent), vacantDays: days });
  const touched = rent.trim() !== "";
  const lost = useTween(result?.lostIncome ?? 0);
  const share = Math.round((days / 365) * 100);

  return (
    <div className="on-dark border border-brass-500/50 bg-ink-900 p-1.5 text-limestone">
      <div className="border border-limestone/15 p-6 sm:p-8">
        <h3 className="font-display text-4xl leading-none sm:text-5xl">What does a vacancy cost?</h3>
        <p className="mt-3 text-[0.9375rem] text-sand">
          Enter your monthly rent and drag the slider. This is arithmetic on your numbers, not a market estimate.
        </p>

        <div className="mt-8">
          <label htmlFor={rentId} className="text-sm font-semibold text-limestone">Monthly rent</label>
          <div className="relative mt-1 flex items-baseline gap-2 border-b border-brass-400 focus-within:border-brass-200">
            <span aria-hidden="true" className="font-sans text-4xl tabular-nums text-brass-300">$</span>
            <input
              id={rentId}
              inputMode="decimal"
              autoComplete="off"
              placeholder="2,500"
              value={rent}
              maxLength={9}
              aria-invalid={touched && !result ? true : undefined}
              aria-describedby={`${rentId}-note`}
              className="min-h-14 w-full bg-transparent font-sans text-5xl tabular-nums text-limestone placeholder:text-sand/50 focus-visible:outline-none"
              onChange={(e) => {
                setRent(e.target.value);
                setAdded(false);
              }}
            />
          </div>
          <p id={`${rentId}-note`} className={touched && !result ? "mt-2 text-sm font-semibold text-brass-200" : "mt-2 text-sm text-sand"}>
            {touched && !result ? "Enter a monthly rent between $1 and $100,000." : "Nothing you type here is sent anywhere."}
          </p>
        </div>

        <div className="mt-8">
          <div className="flex items-baseline justify-between">
            <label htmlFor={daysId} className="text-sm font-semibold text-limestone">Days empty between tenants</label>
            <span aria-hidden="true" className="font-sans text-4xl tabular-nums text-brass-300">{days}</span>
          </div>
          <input id={daysId} type="range" min={0} max={120} step={5} value={days} onChange={(e) => setDays(Number(e.target.value))} className="range mt-1" aria-valuetext={`${days} days`} />
          <div aria-hidden="true" className="flex justify-between text-xs tabular-nums text-sand">
            {TICKS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* The year: occupied time against hatched empty time. */}
        <div className="mt-8" aria-hidden="true">
          <div className="relative h-12 overflow-hidden bg-ink-700">
            <div className="hatch absolute inset-y-0 left-0 transition-[width] duration-500 ease-out motion-reduce:transition-none" style={{ width: `${(days / 365) * 100}%` }} />
            {MONTHS.slice(1).map((_, i) => (
              <span key={i} className="absolute inset-y-0 w-px bg-ink-900/70" style={{ left: `${((i + 1) / 12) * 100}%` }} />
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-12 text-center text-xs text-sand">
            {MONTHS.map((m, i) => (
              <span key={i}>{m}</span>
            ))}
          </div>
          <p className="mt-2 text-sm text-sand">
            <span className="tabular-nums text-limestone">{share}%</span> of the year empty
          </p>
        </div>

        <div className="mt-8 border-t border-limestone/20 pt-6" data-testid="vacancy-result">
          {result ? (
            <>
              <p className="font-sans text-6xl leading-none tabular-nums text-brass-300 sm:text-7xl" data-testid="lost-income" aria-hidden="true">
                {money.format(Math.round(lost))}
              </p>
              <p className="mt-2 text-sand" aria-hidden="true">lost over {days} empty days</p>
              <dl className="mt-6 divide-y divide-limestone/15 border-y border-limestone/15 text-[0.9375rem]">
                {[
                  ["Each empty day", result.perVacantDay],
                  ["One empty month", result.perVacantMonth],
                  ["Rent for a full year", result.annualPotential],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex items-baseline justify-between py-2.5">
                    <dt className="text-sand">{label}</dt>
                    <dd className="font-semibold tabular-nums text-limestone">{money.format(value as number)}</dd>
                  </div>
                ))}
              </dl>
              <p className="sr-only" aria-live="polite">
                {`About ${money.format(result.lostIncome)} lost over ${days} empty days. Each empty day costs about ${money.format(result.perVacantDay)}. One empty month costs ${money.format(result.perVacantMonth)}.`}
              </p>
              <Button
                type="button"
                variant="outline-light"
                size="sm"
                className="mt-6"
                onClick={() => {
                  onUseRent(String(Math.round(parseRent(rent))));
                  setAdded(true);
                }}
              >
                Use this rent in my request
              </Button>
              {added ? (
                <p className="mt-3 text-sm font-semibold text-brass-200" role="status">Added to the request form.</p>
              ) : null}
            </>
          ) : (
            <p className="text-sand" aria-live="polite">Your cost appears here once you enter a rent.</p>
          )}
        </div>
      </div>
    </div>
  );
}
