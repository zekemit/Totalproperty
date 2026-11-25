"use client";

import { useId, useState } from "react";
import { vacancyCost } from "@/lib/calc/vacancy";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/controls";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function parseRent(raw: string): number {
  const cleaned = raw.replace(/[,$\s]/g, "");
  return cleaned === "" ? Number.NaN : Number(cleaned);
}

/**
 * "What does vacancy cost?" Arithmetic on the visitor's own numbers, nothing else:
 * no market data, no rent guidance. It gives an owner a concrete reason to act and
 * a number to bring to the conversation, without us guessing at their rent.
 */
export function VacancyEstimator({ onUseRent }: { onUseRent: (rent: string) => void }) {
  const rentId = useId();
  const daysId = useId();
  const [rent, setRent] = useState("");
  const [days, setDays] = useState(30);
  const [added, setAdded] = useState(false);

  const result = vacancyCost({ monthlyRent: parseRent(rent), vacantDays: days });
  const touched = rent.trim() !== "";

  return (
    <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
      <h3 className="text-2xl">What does a vacancy cost you?</h3>
      <p className="mt-2 text-muted">Enter your monthly rent to see what empty days add up to. This is simple math on your numbers, not a market estimate.</p>

      <div className="mt-6 flex flex-col gap-1.5">
        <label htmlFor={rentId} className="font-bold text-navy-800">Monthly rent</label>
        <div className="relative">
          <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">$</span>
          <Input
            id={rentId}
            inputMode="decimal"
            autoComplete="off"
            placeholder="2,500"
            value={rent}
            maxLength={9}
            aria-invalid={touched && !result ? true : undefined}
            aria-describedby={`${rentId}-note`}
            className="pl-8"
            onChange={(e) => {
              setRent(e.target.value);
              setAdded(false);
            }}
          />
        </div>
        <p id={`${rentId}-note`} className={touched && !result ? "text-[0.9375rem] font-bold text-danger" : "text-[0.9375rem] text-muted"}>
          {touched && !result ? "Enter a monthly rent between $1 and $100,000." : "Numbers only. Nothing you type here is sent anywhere."}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-1.5">
        <label htmlFor={daysId} className="font-bold text-navy-800">
          Days empty between tenants: <span className="tabular-nums">{days}</span>
        </label>
        <input
          id={daysId}
          type="range"
          min={0}
          max={120}
          step={5}
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
          className="h-11 w-full cursor-pointer accent-navy-800"
        />
      </div>

      <div aria-live="polite" className="mt-6 rounded-lg bg-alabaster p-5">
        {result ? (
          <>
            <p className="text-lg">
              <span className="text-3xl font-extrabold tabular-nums text-navy-800">{money.format(result.lostIncome)}</span>
              <span className="ml-2">lost over {days} empty days</span>
            </p>
            <p className="mt-2 text-muted">
              Each empty day costs about {money.format(result.perVacantDay)}. A full empty month costs {money.format(result.perVacantMonth)}.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                onUseRent(String(Math.round(parseRent(rent))));
                setAdded(true);
              }}
            >
              Use this rent in my request
            </Button>
            {added ? <p className="mt-3 font-bold text-success">Added to the request form.</p> : null}
          </>
        ) : (
          <p className="text-muted">Your numbers will appear here.</p>
        )}
      </div>
    </div>
  );
}
