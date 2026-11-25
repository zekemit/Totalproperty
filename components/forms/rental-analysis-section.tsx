"use client";

import { useState } from "react";
import { RentalAnalysisForm } from "./rental-analysis-form";
import { VacancyEstimator } from "./vacancy-estimator";

/** Pairs the estimator with the request form and lets the estimator pre-fill the rent field. */
export function RentalAnalysisSection() {
  const [rent, setRent] = useState({ value: "", key: 0 });
  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-5 lg:sticky lg:top-6">
        <VacancyEstimator onUseRent={(value) => setRent((r) => ({ value, key: r.key + 1 }))} />
      </div>
      <div className="lg:col-span-7">
        <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8">
          <h3 className="text-2xl">Request your free rental analysis</h3>
          <p className="mb-6 mt-2 text-muted">Tell us about the property. A member of our team will review it and follow up with your analysis.</p>
          <RentalAnalysisForm suggestedRent={rent.value} rentKey={rent.key} />
        </div>
      </div>
    </div>
  );
}
