"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";

type Item = { href: string; label: string; external?: boolean };

/**
 * Full-screen menu built on the native <dialog>: the browser traps focus, makes the page
 * inert, and closes on Escape. We add the choreography (a clip reveal and staggered links),
 * which collapses to an instant open/close under prefers-reduced-motion.
 */
export function NavDrawer({
  links,
  moreLinks,
  portalLinks,
  phone,
  phoneHref,
  email,
}: {
  links: Item[];
  /** Secondary routes (the audience pages), shown smaller under the main list. */
  moreLinks: Item[];
  portalLinks: Item[];
  phone: string;
  phoneHref: string;
  email: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  function openDrawer() {
    const d = dialog.current;
    if (!d || d.open) return;
    d.showModal();
    setOpen(true);
    // Next frame, so the closed-to-open transition has a starting state to animate from.
    requestAnimationFrame(() => d.setAttribute("data-open", "true"));
  }

  function closeDrawer() {
    const d = dialog.current;
    if (!d?.open) return;
    d.removeAttribute("data-open");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => d.close(), reduce ? 0 : 420);
  }

  // Navigating (a link inside the drawer was followed) closes it.
  useEffect(() => {
    const d = dialog.current;
    if (d?.open) {
      d.removeAttribute("data-open");
      d.close();
    }
  }, [pathname]);

  return (
    <div className="xl:hidden">
      <button
        type="button"
        onClick={openDrawer}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="site-menu"
        className="inline-flex min-h-11 items-center gap-3 border border-ink-900 px-4 text-[0.9375rem] font-semibold text-ink-900"
      >
        <span aria-hidden="true" className="flex w-5 flex-col gap-[5px]">
          <span className="h-px bg-ink-900" />
          <span className="h-px w-3/4 bg-ink-900" />
        </span>
        Menu
      </button>

      <dialog
        id="site-menu"
        ref={dialog}
        aria-label="Site menu"
        className="drawer on-dark"
        onClose={() => {
          setOpen(false);
          dialog.current?.removeAttribute("data-open");
        }}
      >
        <div className="drawing-grid flex min-h-full flex-col overflow-y-auto">
          <div className="container-page relative flex items-center justify-between py-4">
            <Logo tone="dark" />
            <button type="button" onClick={closeDrawer} className="inline-flex min-h-11 items-center border border-sand px-4 text-[0.9375rem] font-semibold text-limestone">
              Close
            </button>
          </div>

          <nav aria-label="Menu" className="container-page relative flex-1 pt-8">
            <ul>
              {links.map((l, i) => (
                <li key={l.href} className="drawer-link border-t border-[var(--hairline)]" style={{ "--i": i } as React.CSSProperties}>
                  <Link href={l.href} onClick={closeDrawer} className="block py-2.5 font-display text-[clamp(2rem,8.5vw,3.5rem)] leading-none">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="drawer-link mt-6 flex flex-wrap gap-x-6 gap-y-2 text-lg" style={{ "--i": links.length } as React.CSSProperties}>
              {moreLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={closeDrawer} className="link-line text-sand">{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="container-page relative pb-10 pt-8">
            <div className="drawer-link flex flex-wrap gap-3" style={{ "--i": links.length + 1 } as React.CSSProperties}>
              {portalLinks.map((p) => (
                <Button key={p.label} asChild variant="outline-light" size="sm">
                  {p.external ? (
                    <a href={p.href} target="_blank" rel="noopener noreferrer">
                      {p.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    <Link href={p.href} onClick={closeDrawer}>{p.label}</Link>
                  )}
                </Button>
              ))}
              <Button asChild variant="accent" size="sm">
                <Link href="/owners#analysis" onClick={closeDrawer}>Free rental analysis</Link>
              </Button>
            </div>
            <p className="drawer-link mt-6 text-lg" style={{ "--i": links.length + 2 } as React.CSSProperties}>
              <a href={phoneHref} className="link-line font-semibold">{phone}</a>
              <br />
              <a href={`mailto:${email}`} className="link-line text-sand">{email}</a>
            </p>
          </div>
        </div>
      </dialog>
    </div>
  );
}
