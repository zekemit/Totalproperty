"use client";

import { submitContact } from "@/app/actions";
import { contactTopicOptions } from "@/lib/forms/options";
import { FormShell } from "./form-shell";
import { ConsentField, PersonFields, SelectField, TextAreaField, TextField } from "./parts";

const LABELS = { name: "Full name", email: "Email", phone: "Phone", company: "Company", topic: "What this is about", message: "Message", consent: "Consent" };

export function ContactForm({ defaultTopic }: { defaultTopic?: string }) {
  return (
    <FormShell action={submitContact} submitLabel="Send message" successTitle="Message received" fieldLabels={LABELS}>
      {(h) => (
        <>
          <PersonFields h={h} />
          <div className="grid gap-6 sm:grid-cols-2">
            <TextField h={h} name="company" label="Company" required={false} autoComplete="organization" maxLength={120} />
            <SelectField h={h} name="topic" label="What is this about?" options={contactTopicOptions} defaultValue={defaultTopic} />
          </div>
          <TextAreaField h={h} name="message" label="How can we help?" maxLength={2000} rows={6} />
          <ConsentField h={h} />
        </>
      )}
    </FormShell>
  );
}
