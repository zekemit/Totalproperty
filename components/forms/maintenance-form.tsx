"use client";

import { submitMaintenance } from "@/app/actions";
import { maintenanceCategoryOptions } from "@/lib/forms/options";
import { siteConfig } from "@/lib/site";
import { CheckboxField } from "./field";
import { FormShell } from "./form-shell";
import { ConsentField, PersonFields, SelectField, TextAreaField, TextField } from "./parts";

const LABELS = {
  name: "Full name", email: "Email", phone: "Phone", address: "Property address", unit: "Unit",
  category: "Type of problem", description: "What's happening", permissionToEnter: "Permission to enter", consent: "Consent",
};

export function MaintenanceForm() {
  return (
    <FormShell action={submitMaintenance} submitLabel="Send maintenance request" successTitle="Request received" fieldLabels={LABELS}>
      {(h) => (
        <>
          <PersonFields h={h} phoneRequired phoneHint="So a technician can reach you." />
          <div className="grid gap-6 sm:grid-cols-4">
            <TextField h={h} name="address" label="Property address" autoComplete="street-address" maxLength={160} className="sm:col-span-3" />
            <TextField h={h} name="unit" label="Unit" required={false} maxLength={20} />
          </div>
          <SelectField h={h} name="category" label="Type of problem" options={maintenanceCategoryOptions} />
          <TextAreaField h={h} name="description" label="What's happening?" hint="Where it is, when it started, and anything you've already tried." maxLength={2000} rows={5} />
          <SelectField
            h={h}
            name="permissionToEnter"
            label="May we enter if you're not home?"
            options={[{ value: "yes", label: "Yes, you may enter" }, { value: "no", label: "No, please contact me first" }]}
            placeholder="Choose one"
          />
          <CheckboxField id={h.id("emergency")} name="emergency" defaultChecked={h.value("emergency") === "on"}>
            <strong>This is an emergency</strong> (active flooding, no heat in freezing weather, gas smell, fire, or a safety risk). After you send this, call {siteConfig.phone} right away.
          </CheckboxField>
          <ConsentField h={h} />
        </>
      )}
    </FormShell>
  );
}
