"use client";

import { submitVendor } from "@/app/actions";
import { vendorTradeOptions } from "@/lib/forms/options";
import { FormShell } from "./form-shell";
import { ConsentField, PersonFields, SelectField, TextAreaField, TextField } from "./parts";

const LABELS = { name: "Contact name", email: "Email", phone: "Phone", company: "Company", trade: "Primary trade", serviceArea: "Where you work", message: "About your work", consent: "Consent" };

export function VendorForm() {
  return (
    <FormShell action={submitVendor} submitLabel="Send vendor information" successTitle="Information received" fieldLabels={LABELS}>
      {(h) => (
        <>
          <TextField h={h} name="company" label="Company name" autoComplete="organization" maxLength={120} />
          <PersonFields h={h} phoneRequired />
          <div className="grid gap-6 sm:grid-cols-2">
            <SelectField h={h} name="trade" label="Primary trade" options={vendorTradeOptions} />
            <TextField h={h} name="serviceArea" label="Where do you work?" hint="Counties, cities, or states." maxLength={200} />
          </div>
          <TextAreaField h={h} name="message" label="Anything else about your work?" required={false} maxLength={1500} rows={4} />
          <ConsentField h={h} />
        </>
      )}
    </FormShell>
  );
}
