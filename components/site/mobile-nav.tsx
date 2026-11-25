"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type Item = { href: string; label: string; external?: boolean };

/**
 * Disclosure-style mobile menu (not a modal): button toggles aria-expanded, Escape
 * closes and returns focus to the button, and navigating closes the panel.
 */
export function MobileNav({ links, portalLinks, phone, phoneHref }: { links: Item[]; portalLinks: Item[]; phone: string; phoneHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const button = useRef<HTMLButtonElement>(null);
  const [lastPath, setLastPath] = useState(pathname);

  // Close when the route changes ("adjusting state during render" avoids an effect).
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border-2 border-navy-800 px-3 font-bold text-navy-800"
      >
        {open ? <X aria-hidden="true" className="size-5" /> : <Menu aria-hidden="true" className="size-5" />}
        <span>{open ? "Close" : "Menu"}</span>
      </button>

      <div id="mobile-menu" hidden={!open} className="absolute inset-x-0 top-full z-40 border-b border-line bg-alabaster shadow-card">
        <nav aria-label="Mobile" className="container-page flex flex-col py-4">
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href} className="border-b border-line last:border-0">
                <Link href={l.href} className="block py-3.5 text-lg font-bold text-navy-800">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {portalLinks.map((p) => (
              <Button key={p.label} asChild variant="outline">
                {p.external ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer">{p.label}<span className="sr-only"> (opens in a new tab)</span></a>
                ) : (
                  <Link href={p.href}>{p.label}</Link>
                )}
              </Button>
            ))}
          </div>
          <Button asChild variant="accent" size="lg" className="mt-3">
            <Link href="/owners#analysis">Get a free rental analysis</Link>
          </Button>
          <a href={phoneHref} className="mt-4 text-center text-lg font-bold text-navy-800 underline">Call {phone}</a>
        </nav>
      </div>
    </div>
  );
}
