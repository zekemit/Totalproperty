import Link from "next/link";
import { Phone } from "lucide-react";

/**
 * A thumb-reach action bar for ad landing pages on phones: call, or take the main action.
 * Sticky (not fixed) as the last child of <main>: it rides the bottom of the screen while the page
 * scrolls and stops where the page content ends, so it never covers the footer.
 */
export function MobileCtaBar({ phone, phoneHref, label, href }: { phone: string; phoneHref: string; label: string; href: string }) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-ink-900 bg-limestone/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md gap-3">
        <a href={phoneHref} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 border border-ink-900 font-semibold text-ink-900">
          <Phone aria-hidden="true" className="size-4" />
          <span>Call<span className="sr-only"> {phone}</span></span>
        </a>
        <Link href={href} className="inline-flex min-h-12 flex-[1.4] items-center justify-center bg-brass-400 px-3 font-semibold text-ink-950 shadow-[inset_0_-3px_0_var(--color-brass-700)]">
          {label}
        </Link>
      </div>
    </div>
  );
}
