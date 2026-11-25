"use client";

import { useActionState, useEffect, useId, useRef, type ReactNode } from "react";
import Script from "next/script";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initialFormState, type FormState } from "@/lib/forms/state";
import { siteConfig } from "@/lib/site";
import { readAttribution } from "./attribution";

type Action = (previous: FormState, formData: FormData) => Promise<FormState>;

export type FormHelpers = {
  /** Stable id for a field, shared with the error summary links. */
  id: (name: string) => string;
  /** Previously submitted value, so an error never wipes what the user typed. */
  value: (name: string) => string | undefined;
  errors: (name: string) => string[] | undefined;
};

type Props = {
  action: Action;
  submitLabel: string;
  pendingLabel?: string;
  /** Heading shown after a successful submission. */
  successTitle: string;
  /** Maps field names to the labels used in the error summary. */
  fieldLabels: Record<string, string>;
  children: (helpers: FormHelpers) => ReactNode;
};

declare global {
  interface Window {
    turnstile?: { reset: (widget?: string) => void };
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

/**
 * Shared behaviour for every public form: submission through a Server Action,
 * accessible error summary that takes focus, honeypot, client-measured fill time,
 * first-touch attribution, and optional Cloudflare Turnstile.
 *
 * The forms require JavaScript (the client wrapper adds the fill time and
 * attribution before posting), so a <noscript> notice gives phone and email instead.
 */
export function FormShell({ action, submitLabel, pendingLabel = "Sending…", successTitle, fieldLabels, children }: Props) {
  const [state, formAction, pending] = useActionState(action, initialFormState);
  const formId = useId();
  const mountedAt = useRef(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);

  useEffect(() => {
    if (state.status === "error") {
      summaryRef.current?.focus();
      // Turnstile tokens are single-use; a failed attempt needs a fresh challenge.
      window.turnstile?.reset();
    }
    if (state.status === "success") successRef.current?.focus();
  }, [state]);

  function submit(formData: FormData) {
    formData.set("fillMs", String(Math.max(0, Math.round(performance.now() - mountedAt.current))));
    formData.set("sourcePath", window.location.pathname);
    for (const [key, value] of Object.entries(readAttribution())) formData.set(key, value);
    formAction(formData);
  }

  const helpers: FormHelpers = {
    id: (name) => `${formId}-${name}`,
    value: (name) => state.values?.[name],
    errors: (name) => state.fieldErrors?.[name],
  };

  if (state.status === "success") {
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="rounded-xl border-2 border-success bg-white p-6 outline-offset-4 sm:p-8"
      >
        <CheckCircle2 aria-hidden="true" className="mb-3 size-9 text-success" />
        <h3 className="text-2xl">{successTitle}</h3>
        <p className="mt-2 text-lg">{state.message}</p>
      </div>
    );
  }

  const fieldErrorEntries = Object.entries(state.fieldErrors ?? {}).filter(([, v]) => v && v.length > 0);

  return (
    <form action={submit} noValidate className="relative flex flex-col gap-6">
      {state.status === "error" ? (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-lg border-2 border-danger bg-white p-4 outline-offset-4"
        >
          <p className="font-bold text-danger">{state.message}</p>
          {fieldErrorEntries.length > 0 ? (
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {fieldErrorEntries.map(([name, messages]) => (
                <li key={name}>
                  <a href={`#${helpers.id(name)}`} className="font-bold text-navy-700 underline">
                    {fieldLabels[name] ?? name}
                  </a>
                  : {messages?.[0]}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      {/* Honeypot: invisible to people and assistive tech, tempting to bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Leave this field empty
          <input type="text" name="reference_code" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <noscript>
        <p className="rounded-lg border-2 border-navy-800 bg-white p-4 font-bold text-navy-800">
          This form needs JavaScript. To reach us without it, call {siteConfig.phone} or email {siteConfig.email}.
        </p>
      </noscript>

      {children(helpers)}

      {TURNSTILE_SITE_KEY ? (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" async defer />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
        </>
      ) : null}

      <div>
        <Button type="submit" size="lg" variant="primary" disabled={pending} aria-disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </Button>
      </div>
    </form>
  );
}
