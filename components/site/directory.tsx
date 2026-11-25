import Link from "next/link";

const ROWS = [
  { href: "/owners#analysis", name: "Owners", note: "Residential rental homes. Start with a free rental analysis." },
  { href: "/commercial", name: "Commercial", note: "Leasing, CAM budgets and construction under one team." },
  { href: "/lenders", name: "Lenders", note: "Foreclosure properties made ready for market." },
  { href: "/tenants", name: "Tenants", note: "Pay rent, report a repair, find your portal." },
] as const;

/**
 * The audience selector, as a lobby directory: a charcoal plaque with a brass inset line.
 * Each row is a plain link, so it works with a keyboard, a screen reader, and no JavaScript.
 */
export function Directory() {
  return (
    <nav aria-labelledby="directory-h" className="on-dark border border-brass-500/60 bg-ink-900 p-1.5 text-limestone shadow-[0_40px_70px_-35px_rgb(11_17_26/0.75)]">
      <div className="border border-limestone/15">
        <h2 id="directory-h" className="px-6 pb-4 pt-5 font-sans text-[0.9375rem] font-semibold text-sand">
          Find your way in
        </h2>
        <ul>
          {ROWS.map((r, i) => (
            <li key={r.href} className="border-t border-limestone/15">
              <Link href={r.href} className="dir-row flex items-center justify-between gap-4 px-6 py-5">
                <span>
                  <span className="block font-display text-[2.6rem] leading-[0.95]">{r.name}</span>
                  <span className="mt-2 block max-w-[17rem] text-sm text-sand">{r.note}</span>
                </span>
                <span aria-hidden="true" className="font-display text-2xl text-brass-300">{String(i + 1).padStart(2, "0")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
