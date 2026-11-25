"use client";

import { useId, useState, type ReactNode } from "react";
import { ImageOff } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/controls";
import { LIBRARY } from "@/lib/photos";
import { cn } from "@/lib/utils";
import { getIn, useDoc } from "./doc";

/** Label, optional hint and error, wired to the control with aria-describedby. */
export function FieldShell({
  id,
  label,
  hint,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  children: (a11y: { id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }) => ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errId = error ? `${id}-err` : undefined;
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-[0.9375rem] font-semibold text-ink-900">
        {label}
      </label>
      {children({ id, "aria-describedby": [hintId, errId].filter(Boolean).join(" ") || undefined, "aria-invalid": error ? true : undefined })}
      {hint ? (
        <p id={hintId} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-sm font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  path,
  label,
  hint,
  multiline = false,
  rows = 3,
  maxLength,
  type = "text",
  placeholder,
  className,
  counter,
}: {
  path: string;
  label: string;
  hint?: ReactNode;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  type?: "text" | "url" | "email" | "tel";
  placeholder?: string;
  className?: string;
  /** Show "n / goal" under the field (used for search titles and descriptions). */
  counter?: number;
}) {
  const { doc, defaults, errors, set } = useDoc();
  const id = useId();
  const value = (getIn(doc, path) as string | undefined) ?? "";
  const fallback = getIn(defaults, path);
  const ph = placeholder ?? (typeof fallback === "string" && fallback ? `Standard: ${fallback}` : undefined);
  return (
    <FieldShell id={id} label={label} hint={hint} error={errors[path]} className={className}>
      {(a11y) => (
        <>
          {multiline ? (
            <Textarea {...a11y} value={value} rows={rows} maxLength={maxLength} placeholder={ph} onChange={(e) => set(path, e.target.value)} />
          ) : (
            <Input {...a11y} type={type} value={value} maxLength={maxLength} placeholder={ph} onChange={(e) => set(path, e.target.value)} />
          )}
          {counter ? (
            <p className={cn("text-sm tabular-nums", value.length > counter ? "font-semibold text-danger" : "text-muted")} aria-live="polite">
              {value.length} of about {counter} characters
              {value.length > counter ? ": longer text may be cut off in search results" : ""}
            </p>
          ) : null}
        </>
      )}
    </FieldShell>
  );
}

/** One item per line: the easiest way to edit a list of short phrases. */
export function LinesField({ path, label, hint, rows = 6, placeholder }: { path: string; label: string; hint?: ReactNode; rows?: number; placeholder?: string }) {
  const { doc, errors, set } = useDoc();
  const id = useId();
  const items = (getIn(doc, path) as string[] | undefined) ?? [];
  return (
    <FieldShell id={id} label={label} hint={hint ?? "One per line."} error={errors[path]}>
      {(a11y) => <Textarea {...a11y} rows={rows} value={items.join("\n")} placeholder={placeholder} onChange={(e) => set(path, e.target.value.split("\n"))} />}
    </FieldShell>
  );
}

export function SelectField({ path, label, options, hint, className }: { path: string; label: string; options: readonly { value: string; label: string }[]; hint?: ReactNode; className?: string }) {
  const { doc, errors, set } = useDoc();
  const id = useId();
  return (
    <FieldShell id={id} label={label} hint={hint} error={errors[path]} className={className}>
      {(a11y) => (
        <Select {...a11y} value={(getIn(doc, path) as string) ?? ""} onChange={(e) => set(path, e.target.value)}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      )}
    </FieldShell>
  );
}

/** An on/off switch. Announced as a switch with its state; works with Space and Enter. */
export function ToggleField({ path, label, hint, onText = "On", offText = "Off" }: { path: string; label: string; hint?: ReactNode; onText?: string; offText?: string }) {
  const { doc, set } = useDoc();
  const id = useId();
  const on = Boolean(getIn(doc, path));
  return (
    <div className="flex items-start gap-4">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-describedby={hint ? `${id}-hint` : undefined}
        onClick={() => set(path, !on)}
        className={cn("relative mt-0.5 inline-flex h-8 w-14 shrink-0 items-center border border-ink-900 transition-colors", on ? "bg-ink-900" : "bg-paper")}
      >
        <span className="sr-only">{label}</span>
        <span aria-hidden="true" className={cn("absolute top-1 size-5 transition-all", on ? "left-8 bg-brass-300" : "left-1 bg-ink-900")} />
      </button>
      <div>
        <label htmlFor={id} className="cursor-pointer text-[0.9375rem] font-semibold text-ink-900">
          {label} <span className="font-normal text-muted">({on ? onText : offText})</span>
        </label>
        {hint ? (
          <p id={`${id}-hint`} className="text-sm text-muted">
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** A picture link with a live preview and one-click choices from the bundled photo library. */
export function ImageField({ path, altPath, label = "Picture", hint }: { path: string; altPath?: string; label?: string; hint?: ReactNode }) {
  const { doc, errors, set } = useDoc();
  const id = useId();
  const [failed, setFailed] = useState<string | null>(null);
  const src = ((getIn(doc, path) as string | undefined) ?? "").trim();
  const showPreview = src !== "" && !errors[path] && (src.startsWith("/") || src.startsWith("https://"));
  const broken = failed === src;
  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_12rem]">
      <div className="flex flex-col gap-4">
        <FieldShell id={id} label={label} error={errors[path]} hint={hint ?? "Paste a link that starts with https://, or choose one from the library below."}>
          {(a11y) => <Input {...a11y} type="text" inputMode="url" value={src} maxLength={500} placeholder="https://example.com/photo.jpg" onChange={(e) => set(path, e.target.value)} />}
        </FieldShell>
        {altPath ? <TextField path={altPath} label="Describe the picture" hint="For people who can't see it, and for search engines. Example: “Retail building with glass storefronts at dusk”." maxLength={160} /> : null}
        <details className="border border-[var(--hairline)] bg-paper">
          <summary className="min-h-11 cursor-pointer px-4 py-3 text-[0.9375rem] font-semibold text-ink-900">Choose from the photo library</summary>
          <ul className="grid grid-cols-3 gap-2 p-3 sm:grid-cols-4">
            {LIBRARY.map((p) => (
              <li key={p.src}>
                <button
                  type="button"
                  onClick={() => {
                    set(path, p.src);
                    if (altPath && !(getIn(doc, altPath) as string)) set(altPath, p.alt);
                  }}
                  aria-label={`Use the ${p.label} photo`}
                  aria-pressed={src === p.src}
                  className={cn("block w-full border-2 p-0", src === p.src ? "border-brass-700" : "border-transparent hover:border-ink-900")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.src} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                  <span className="block truncate px-1 py-1 text-xs">{p.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </details>
      </div>
      <div className="flex aspect-[4/3] items-center justify-center self-start border border-[var(--hairline)] bg-limestone text-sm text-muted" aria-live="polite">
        {showPreview && !broken ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="Preview" className="size-full object-cover" onError={() => setFailed(src)} />
        ) : (
          <span className="flex flex-col items-center gap-2 p-3 text-center">
            <ImageOff aria-hidden="true" className="size-6" />
            {broken ? "We couldn't load that picture. Check the link." : "No picture"}
          </span>
        )}
      </div>
    </div>
  );
}
