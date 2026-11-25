"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type Item = { href: string; label: string };

/** The primary navigation. Marks the current page with aria-current so it is announced and styled. */
export function MainNav({ items, className }: { items: readonly Item[]; className?: string }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className={className}>
      <ul className="flex items-center gap-6 2xl:gap-8">
        {items.map((l) => {
          const current = l.href === "/" ? pathname === "/" : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={current ? "page" : undefined}
                className={cn("link-line whitespace-nowrap text-[0.9375rem] font-medium text-ink-900", current && "link-line-current")}
              >
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
