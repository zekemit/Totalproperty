import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  /** Short helper shown under the label. */
  hint?: string;
  errors?: string[];
  required?: boolean;
  className?: string;
  children: (a11y: { id: string; "aria-invalid": boolean | undefined; "aria-describedby": string | undefined; "aria-required": boolean | undefined }) => React.ReactNode;
};

/**
 * Label + control + hint + error, wired together with aria-describedby so screen
 * readers announce the hint and the error when the control is focused.
 */
export function Field({ id, label, hint, errors, required, className, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = errors?.length ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-bold text-navy-800">
        {label}
        {required ? null : <span className="ml-1 font-normal text-muted">(optional)</span>}
      </label>
      {hint ? (
        <p id={hintId} className="text-[0.9375rem] text-muted">
          {hint}
        </p>
      ) : null}
      {children({ id, "aria-invalid": errorId ? true : undefined, "aria-describedby": describedBy, "aria-required": required ? true : undefined })}
      {errorId ? (
        <p id={errorId} className="text-[0.9375rem] font-bold text-danger">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}

type CheckboxFieldProps = {
  id: string;
  name: string;
  errors?: string[];
  defaultChecked?: boolean;
  children: React.ReactNode;
};

export function CheckboxField({ id, name, errors, defaultChecked, children }: CheckboxFieldProps) {
  const errorId = errors?.length ? `${id}-error` : undefined;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          defaultChecked={defaultChecked}
          aria-invalid={errorId ? true : undefined}
          aria-describedby={errorId}
          className="mt-1 size-6 shrink-0 cursor-pointer rounded border-2 border-field-border accent-navy-800"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-snug text-ink">
          {children}
        </label>
      </div>
      {errorId ? (
        <p id={errorId} className="text-[0.9375rem] font-bold text-danger">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}
