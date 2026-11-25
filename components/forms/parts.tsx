import type { ReactNode } from "react";
import Link from "next/link";
import { Input, Select, Textarea } from "@/components/ui/controls";
import { CheckboxField, Field } from "./field";
import type { FormHelpers } from "./form-shell";

type Option = { readonly value: string; readonly label: string };

export function TextField({
  h, name, label, hint, required = true, type = "text", autoComplete, inputMode, maxLength, className, defaultValue,
}: {
  h: FormHelpers; name: string; label: string; hint?: string; required?: boolean; type?: string;
  autoComplete?: string; inputMode?: "text" | "numeric" | "decimal" | "tel" | "email"; maxLength?: number; className?: string;
  defaultValue?: string;
}) {
  return (
    <Field id={h.id(name)} label={label} hint={hint} errors={h.errors(name)} required={required} className={className}>
      {(a11y) => (
        <Input {...a11y} name={name} type={type} autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
          defaultValue={h.value(name) ?? defaultValue} />
      )}
    </Field>
  );
}

export function SelectField({
  h, name, label, options, required = true, hint, className, autoComplete, placeholder = "Choose one", defaultValue,
}: {
  h: FormHelpers; name: string; label: string; options: readonly Option[]; required?: boolean; hint?: string;
  className?: string; autoComplete?: string; placeholder?: string; defaultValue?: string;
}) {
  return (
    <Field id={h.id(name)} label={label} hint={hint} errors={h.errors(name)} required={required} className={className}>
      {(a11y) => (
        <Select {...a11y} name={name} autoComplete={autoComplete} defaultValue={h.value(name) ?? defaultValue ?? ""}>
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      )}
    </Field>
  );
}

export function TextAreaField({
  h, name, label, hint, required = true, maxLength, rows = 5,
}: { h: FormHelpers; name: string; label: string; hint?: string; required?: boolean; maxLength?: number; rows?: number }) {
  return (
    <Field id={h.id(name)} label={label} hint={hint} errors={h.errors(name)} required={required}>
      {(a11y) => <Textarea {...a11y} name={name} rows={rows} maxLength={maxLength} defaultValue={h.value(name)} />}
    </Field>
  );
}

/** Name, email and phone: the same three fields on every form. */
export function PersonFields({ h, phoneRequired = false, phoneHint }: { h: FormHelpers; phoneRequired?: boolean; phoneHint?: string }) {
  return (
    <>
      <TextField h={h} name="name" label="Full name" autoComplete="name" maxLength={100} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField h={h} name="email" label="Email" type="email" autoComplete="email" inputMode="email" maxLength={254} />
        <TextField h={h} name="phone" label="Phone" type="tel" autoComplete="tel" inputMode="tel" required={phoneRequired} hint={phoneHint} maxLength={30} />
      </div>
    </>
  );
}

export function ConsentField({ h }: { h: FormHelpers }): ReactNode {
  return (
    <CheckboxField id={h.id("consent")} name="consent" errors={h.errors("consent")} defaultChecked={h.value("consent") === "on"}>
      I agree that Total Property Management may contact me about this request by phone or email. I have read the{" "}
      <Link href="/privacy" className="font-semibold underline">privacy policy</Link>.
    </CheckboxField>
  );
}
