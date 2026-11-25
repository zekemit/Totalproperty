import * as React from "react";
import { cn } from "@/lib/utils";

type FieldProps = {
  id: string;
  label: string;
  /** Short helper shown under the control. */
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
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-ink-900">
        {label}
        {required ? null : <span className="ml-1.5 font-normal text-muted">optional</span>}
      </label>
      {children({ id, "aria-invalid": errorId ? true : undefined, "aria-describedby": describedBy, "aria-required": required ? true : undefined })}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {errorId ? (
        <p id={errorId} className="text-sm font-semibold text-danger">
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
          className="mt-0.5 size-6 shrink-0 cursor-pointer rounded-[2px] border-2 border-field accent-ink-900"
        />
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] leading-snug text-text">
          {children}
        </label>
      </div>
      {errorId ? (
        <p id={errorId} className="text-sm font-semibold text-danger">
          {errors?.[0]}
        </p>
      ) : null}
    </div>
  );
}
