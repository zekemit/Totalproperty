import Link from "next/link";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { portalUrls } from "@/lib/portals";
import { navLinks, siteConfig } from "@/lib/site";
import { Logo } from "./logo";
import { MobileNav } from "./mobile-nav";

export function Header() {
  const portals = portalUrls();
  const portalLinks = [
    portals.owner ? { href: portals.owner, label: "Owner portal", external: true } : { href: "/portal#owners", label: "Owner portal" },
    portals.tenant ? { href: portals.tenant, label: "Tenant portal", external: true } : { href: "/portal#tenants", label: "Tenant portal" },
  ];
  const links = [...navLinks, { href: "/contact", label: "Contact" }];

  return (
    <header className="relative z-30 border-b border-line bg-alabaster">
      <div className="hidden bg-navy-900 text-sm text-muted-on-dark lg:block on-dark">
        <div className="container-page flex min-h-10 items-center justify-end gap-6">
          {portalLinks.map((p) =>
            p.external ? (
              <a key={p.label} href={p.href} target="_blank" rel="noopener noreferrer" className="font-bold text-white underline-offset-4 hover:underline">
                {p.label}<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ) : (
              <Link key={p.label} href={p.href} className="font-bold text-white underline-offset-4 hover:underline">{p.label}</Link>
            ),
          )}
          <a href={siteConfig.phoneHref} className="inline-flex items-center gap-2 font-bold text-white">
            <Phone aria-hidden="true" className="size-4" />
            {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="container-page flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="rounded-md">
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="rounded-md px-3 py-2.5 font-bold text-navy-800 hover:bg-alabaster-2">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild variant="accent" className="hidden lg:inline-flex">
            <Link href="/owners#analysis">Free rental analysis</Link>
          </Button>
          <MobileNav links={links} portalLinks={portalLinks} phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} />
        </div>
      </div>
    </header>
  );
}
