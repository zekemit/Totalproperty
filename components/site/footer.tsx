import Link from "next/link";
import { House } from "lucide-react";
import { navLinks, serviceAreas, siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="on-dark bg-navy-900 text-muted-on-dark">
      <div className="container-page grid gap-10 py-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="dark" />
          <p className="mt-5 max-w-sm">
            One accountable team for owners, commercial landlords, tenants and lenders in {siteConfig.areasPhrase}.
          </p>
          <address className="mt-5 not-italic">
            {siteConfig.legalName}
            <br />
            {siteConfig.officeLine ? (
              <>
                Office: {siteConfig.officeLine}
                <br />
                Mail:{" "}
              </>
            ) : null}
            {siteConfig.mailingLine}
          </address>
          <p className="mt-3">
            <a href={siteConfig.phoneHref} className="font-bold text-white underline underline-offset-4">{siteConfig.phone}</a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${siteConfig.email}`} className="font-bold text-white underline underline-offset-4">{siteConfig.email}</a>
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <h2 className="text-base font-extrabold text-white">Explore</h2>
          <ul className="mt-4 space-y-2.5">
            {[...navLinks, { href: "/contact", label: "Contact" }, { href: "/vendors", label: "Vendors" }, { href: "/portal", label: "Portal login" }].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="underline-offset-4 hover:text-white hover:underline">{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-base font-extrabold text-white">Where we work</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {serviceAreas.map((a) => (
              <li key={a.code} className="rounded-md border border-white/30 px-3 py-1.5 text-white">{a.name}</li>
            ))}
          </ul>
          {siteConfig.serviceAreaDetail ? <p className="mt-3">{siteConfig.serviceAreaDetail}</p> : null}
          {siteConfig.licenses.length > 0 ? (
            <div className="mt-6">
              <h2 className="text-base font-extrabold text-white">Licensing</h2>
              <ul className="mt-3 space-y-1.5">
                {siteConfig.licenses.map((l) => (
                  <li key={`${l.state}-${l.number}`}>
                    {l.verifyUrl ? (
                      <a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-white">
                        {l.label}<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    ) : (
                      <>{l.label}</>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container-page flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <House aria-hidden="true" className="size-5 shrink-0 text-gold" />
            <span>Equal Housing Opportunity. © {new Date().getFullYear()} {siteConfig.legalName}.</span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="underline-offset-4 hover:text-white hover:underline">Privacy</Link></li>
            <li><Link href="/accessibility" className="underline-offset-4 hover:text-white hover:underline">Accessibility</Link></li>
            <li><Link href="/fair-housing" className="underline-offset-4 hover:text-white hover:underline">Fair housing</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
