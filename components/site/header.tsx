import Link from "next/link";
import { Button } from "@/components/ui/button";
import { portalUrls } from "@/lib/portals";
import { navLinks, siteConfig } from "@/lib/site";
import { Logo } from "./logo";
import { NavDrawer } from "./nav-drawer";

export function Header() {
  const portals = portalUrls();
  const portalLinks = [
    portals.owner ? { href: portals.owner, label: "Owner portal", external: true } : { href: "/portal#owners", label: "Owner portal" },
    portals.tenant ? { href: portals.tenant, label: "Tenant portal", external: true } : { href: "/portal#tenants", label: "Tenant portal" },
  ];
  const links = [...navLinks, { href: "/contact", label: "Contact" }];

  return (
    <header className="sticky top-0 z-40 border-b border-ink-900/20 bg-limestone/90 backdrop-blur-md">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link href="/" className="-m-1 p-1">
          <span className="sr-only">{siteConfig.name}, home</span>
          <Logo />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-7">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line text-[0.9375rem] font-medium text-ink-900">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-6">
          <ul className="hidden items-center gap-5 text-sm text-muted xl:flex">
            {portalLinks.map((p) => (
              <li key={p.label}>
                {p.external ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-line">
                    {p.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={p.href} className="link-line">{p.label}</Link>
                )}
              </li>
            ))}
          </ul>
          <Button asChild variant="accent" size="sm" className="hidden lg:inline-flex">
            <Link href="/owners#analysis">Free rental analysis</Link>
          </Button>
          <NavDrawer links={links} portalLinks={portalLinks} phone={siteConfig.phone} phoneHref={siteConfig.phoneHref} email={siteConfig.email} />
        </div>
      </div>
    </header>
  );
}
