"use client";

import { submitRentalAnalysis } from "@/app/actions";
import { occupancyOptions, propertyTypeOptions, stateOptions, timelineOptions } from "@/lib/forms/options";
import { FormShell } from "./form-shell";
import { ConsentField, PersonFields, SelectField, TextAreaField, TextField } from "./parts";

const LABELS = {
  name: "Full name", email: "Email", phone: "Phone", street: "Street address", city: "City", state: "State",
  zip: "ZIP code", propertyType: "Property type", occupancy: "Current situation", bedrooms: "Bedrooms",
  currentRent: "Current rent", timeline: "When to start", notes: "Anything else", consent: "Consent",
};

/** `suggestedRent` pre-fills the rent field from the vacancy estimator; `rentKey` remounts it when it changes. */
export function RentalAnalysisForm({ suggestedRent, rentKey = 0 }: { suggestedRent?: string; rentKey?: number }) {
  return (
    <FormShell
      action={submitRentalAnalysis}
      submitLabel="Request my free rental analysis"
      successTitle="Request received"
      fieldLabels={LABELS}
    >
      {(h) => (
        <>
          <PersonFields h={h} phoneHint="Optional. Add it if you'd rather talk it through." />

          <fieldset className="flex flex-col gap-6">
            <legend className="mb-1 text-lg font-extrabold text-navy-800">The property</legend>
            <TextField h={h} name="street" label="Street address" autoComplete="address-line1" maxLength={120} />
            <div className="grid gap-6 sm:grid-cols-6">
              <TextField h={h} name="city" label="City" autoComplete="address-level2" maxLength={80} className="sm:col-span-3" />
              <SelectField h={h} name="state" label="State" options={stateOptions} autoComplete="address-level1" className="sm:col-span-2" />
              <TextField h={h} name="zip" label="ZIP code" autoComplete="postal-code" inputMode="numeric" maxLength={10} className="sm:col-span-1" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField h={h} name="propertyType" label="Property type" options={propertyTypeOptions} />
              <SelectField h={h} name="occupancy" label="Current situation" options={occupancyOptions} />
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              <TextField h={h} name="bedrooms" label="Bedrooms" required={false} inputMode="numeric" maxLength={2} />
              <TextField
                key={rentKey}
                h={h}
                name="currentRent"
                label="Current rent"
                required={false}
                inputMode="decimal"
                maxLength={9}
                hint="Monthly, if it's rented now."
                defaultValue={suggestedRent}
              />
              <SelectField h={h} name="timeline" label="When to start" options={timelineOptions} />
            </div>
            <TextAreaField h={h} name="notes" label="Anything else we should know?" required={false} maxLength={1500} rows={4} />
          </fieldset>

          <ConsentField h={h} />
        </>
      )}
    </FormShell>
  );
}
