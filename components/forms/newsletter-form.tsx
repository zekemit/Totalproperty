"use client";

import { submitNewsletter } from "@/app/actions";
import { CheckboxField } from "./field";
import { FormShell } from "./form-shell";
import { TextField } from "./parts";

const LABELS = { email: "Email", name: "Name", consent: "Consent" };

/** Email-only signup. Same pipeline as every other form: honeypot, rate limit, validation, first-touch UTM. */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  return (
    <FormShell action={submitNewsletter} submitLabel="Subscribe" successTitle="You're on the list" fieldLabels={LABELS}>
      {(h) => (
        <>
          <div className={compact ? "grid gap-6" : "grid gap-6 sm:grid-cols-2"}>
            <TextField h={h} name="email" label="Email address" type="email" autoComplete="email" inputMode="email" maxLength={254} />
            <TextField h={h} name="name" label="Name" required={false} autoComplete="name" maxLength={100} />
          </div>
          <CheckboxField id={h.id("consent")} name="consent" errors={h.errors("consent")} defaultChecked={h.value("consent") === "on"}>
            Email me the Total Property Management newsletter. To unsubscribe, reply to any email or contact us.
          </CheckboxField>
        </>
      )}
    </FormShell>
  );
}
