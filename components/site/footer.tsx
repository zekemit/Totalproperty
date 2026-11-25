import Link from "next/link";
import { House } from "lucide-react";
import { navLinks, siteConfig } from "@/lib/site";
import { Logo } from "./logo";

export function Footer() {
  const links = [...navLinks, { href: "/contact", label: "Contact" }, { href: "/vendors", label: "Vendors" }, { href: "/portal", label: "Portal login" }];
  return (
    <footer className="on-dark drawing-grid bg-ink-950 text-limestone">
      <div className="container-page relative pb-8 pt-20 sm:pt-28">
        <p className="font-display text-[clamp(2.4rem,1.2rem+5vw,6rem)] leading-[0.95] tracking-[-0.02em]">
          Let&rsquo;s talk about
          <br />
          your property.
        </p>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <a href={siteConfig.phoneHref} className="link-line block font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.5rem)] leading-none">
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="link-line mt-3 inline-block text-lg text-sand">
              {siteConfig.email}
            </a>
          </div>
          <address className="not-italic text-sand lg:col-span-4 lg:col-start-7">
            <span className="block font-semibold text-limestone">{siteConfig.legalName}</span>
            {siteConfig.officeLine ? <span className="block">Office: {siteConfig.officeLine}</span> : null}
            <span className="block">{siteConfig.officeLine ? "Mail: " : ""}{siteConfig.mailingLine}</span>
            <span className="mt-3 block">Serving {siteConfig.areasPhrase}.</span>
            {siteConfig.serviceAreaDetail ? <span className="block">{siteConfig.serviceAreaDetail}</span> : null}
          </address>
          {siteConfig.licenses.length > 0 ? (
            <ul className="space-y-1 text-sm text-sand lg:col-span-3">
              {siteConfig.licenses.map((l) => (
                <li key={`${l.state}-${l.number}`}>
                  {l.verifyUrl ? (
                    <a href={l.verifyUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                      {l.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  ) : (
                    l.label
                  )}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-[var(--hairline)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-4">
            <Logo tone="dark" className="[&_svg]:size-8" />
          </div>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.9375rem]">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="link-line text-limestone">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-6 flex flex-col gap-3 text-sm text-sand sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2">
            <House aria-hidden="true" className="size-4 shrink-0 text-brass-300" />
            <span>
              Equal Housing Opportunity. © {new Date().getFullYear()} {siteConfig.legalName}.
            </span>
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li><Link href="/privacy" className="link-line">Privacy</Link></li>
            <li><Link href="/accessibility" className="link-line">Accessibility</Link></li>
            <li><Link href="/fair-housing" className="link-line">Fair housing</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
