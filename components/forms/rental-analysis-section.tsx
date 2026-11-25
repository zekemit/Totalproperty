"use client";

import { useState } from "react";
import { RentalAnalysisForm } from "./rental-analysis-form";
import { VacancyInstrument } from "./vacancy-instrument";

/** Instrument beside the request sheet; the instrument can pre-fill the rent field. */
export function RentalAnalysisSection() {
  const [rent, setRent] = useState({ value: "", key: 0 });
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:col-span-5">
        <VacancyInstrument onUseRent={(value) => setRent((r) => ({ value, key: r.key + 1 }))} />
      </div>
      <div className="sheet p-6 sm:p-10 lg:col-span-7">
        <h3 className="font-display text-4xl leading-none sm:text-5xl">Request your free rental analysis</h3>
        <p className="mb-8 mt-3 max-w-xl text-muted">Tell us about the property. A member of our team will review it and follow up with your analysis.</p>
        <RentalAnalysisForm suggestedRent={rent.value} rentKey={rent.key} />
      </div>
    </div>
  );
}
