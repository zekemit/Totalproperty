"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { isExternal } from "@/lib/cms/safe-url";

type Props = { id: string; headline: string; body: string; ctaLabel: string; ctaHref: string };

const keyFor = (kind: "bar" | "popup", id: string) => `tpm_${kind}_${id}`;

function seen(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function remember(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    /* storage unavailable: it simply shows again next time */
  }
}

function Cta({ label, href, className, onClick }: { label: string; href: string; className?: string; onClick?: () => void }) {
  if (!label || !href) return null;
  return isExternal(href) || href.startsWith("mailto:") || href.startsWith("tel:") ? (
    <a href={href} onClick={onClick} className={className} {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
      {isExternal(href) ? <span className="sr-only"> (opens in a new tab)</span> : null}
    </a>
  ) : (
    <Link href={href} onClick={onClick} className={className}>
      {label}
    </Link>
  );
}

/** A slim banner above the header. Dismissible; stays dismissed for the browser session. */
export function AnnouncementBar({ id, headline, body, ctaLabel, ctaHref }: Props) {
  const [dismissed, setDismissed] = useState(false);
  // Read once from sessionStorage after hydration (never changes from outside, so there is nothing to subscribe to).
  const dismissedEarlier = useSyncExternalStore(
    () => () => {},
    () => seen(keyFor("bar", id)),
    () => false,
  );
  if (dismissed || dismissedEarlier) return null;
  return (
    <section aria-label="Announcement" data-testid="announcement-bar" className="on-dark relative bg-ink-800 text-limestone">
      <div className="container-page flex items-start gap-4 py-2.5 pr-12 text-[0.9375rem] sm:items-center sm:pr-14">
        <p className="flex flex-1 flex-wrap items-baseline gap-x-3 gap-y-1">
          <strong className="font-semibold">{headline}</strong>
          {body ? <span className="text-sand">{body}</span> : null}
          <Cta label={ctaLabel} href={ctaHref} className="link-line font-semibold text-brass-200" />
        </p>
        <button
          type="button"
          onClick={() => {
            remember(keyFor("bar", id));
            setDismissed(true);
          }}
          className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center text-limestone"
          aria-label="Dismiss announcement"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
      </div>
    </section>
  );
}

/** A modal shown once per browser session, a moment after the page loads. Native <dialog>: focus trap and Esc for free. */
export function AnnouncementPopup({ id, headline, body, ctaLabel, ctaHref }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const key = keyFor("popup", id);
    if (seen(key)) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = window.setTimeout(() => {
      const d = dialog.current;
      if (d && !d.open) {
        d.showModal();
        remember(key);
      }
    }, reduce ? 600 : 2200);
    return () => window.clearTimeout(timer);
  }, [id]);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="announcement-popup-title"
      data-testid="announcement-popup"
      className="m-auto w-[min(32rem,calc(100vw-2rem))] border border-brass-600 bg-paper p-0 text-text backdrop:bg-ink-950/70"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="relative p-7 sm:p-9">
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          className="absolute right-2 top-2 inline-flex size-11 items-center justify-center text-ink-900"
          aria-label="Close announcement"
        >
          <X aria-hidden="true" className="size-5" />
        </button>
        <span aria-hidden="true" className="mb-5 block h-px w-16 bg-brass-600" />
        <h2 id="announcement-popup-title" className="font-display text-[2.4rem] leading-[1] tracking-[-0.015em]">
          {headline}
        </h2>
        {body ? <p className="mt-4 text-lg text-muted">{body}</p> : null}
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Cta
            label={ctaLabel}
            href={ctaHref}
            onClick={() => dialog.current?.close()}
            className="inline-flex min-h-12 items-center bg-ink-900 px-6 font-semibold text-paper hover:bg-ink-800"
          />
          <button type="button" onClick={() => dialog.current?.close()} className="link-line min-h-11 font-semibold text-ink-900">
            Not now
          </button>
        </div>
      </div>
    </dialog>
  );
}
