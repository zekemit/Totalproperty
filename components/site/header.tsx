import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getContent } from "@/lib/cms/content";
import { portalUrls } from "@/lib/portals";
import { audienceNav, primaryNav } from "@/lib/site";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { NavDrawer } from "./nav-drawer";

export async function Header() {
  const { site } = await getContent();
  const portals = portalUrls({ owner: site.portals.owner, tenant: site.portals.tenant, payment: site.portals.payment });
  const portalLinks = [
    portals.owner ? { href: portals.owner, label: "Owner portal", external: true } : { href: "/portal#owners", label: "Owner portal" },
    portals.tenant ? { href: portals.tenant, label: "Tenant portal", external: true } : { href: "/portal#tenants", label: "Tenant portal" },
  ];

  return (
    <>
      {/* Utility strip: phone, email, and the four audience pages. Desktop only; the drawer carries these on small screens. */}
      <div className="on-dark hidden bg-ink-950 text-sm text-limestone lg:block">
        <div className="container-page flex h-10 items-center justify-between gap-6">
          <p className="flex items-center gap-5">
            <a href={site.phoneHref} className="link-line font-semibold">{site.phone}</a>
            <a href={`mailto:${site.email}`} className="link-line text-sand">{site.email}</a>
          </p>
          <ul className="flex items-center gap-5">
            {audienceNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="link-line">{l.label}</Link>
              </li>
            ))}
            <li aria-hidden="true" className="h-4 w-px bg-limestone/25" />
            {portalLinks.map((p) => (
              <li key={p.label}>
                {p.external ? (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="link-line text-sand">
                    {p.label}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <Link href={p.href} className="link-line text-sand">{p.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-ink-900/20 bg-limestone/90 backdrop-blur-md">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
          <Link href="/" className="-m-1 p-1">
            <span className="sr-only">{site.name}, home</span>
            <Logo />
          </Link>

          <MainNav items={primaryNav} className="hidden xl:ml-auto xl:block" />

          <div className="flex items-center gap-4">
            <Button asChild variant="accent" size="sm" className="hidden 2xl:inline-flex">
              <Link href="/owners#analysis">Free rental analysis</Link>
            </Button>
            <NavDrawer links={[...primaryNav]} moreLinks={[...audienceNav]} portalLinks={portalLinks} phone={site.phone} phoneHref={site.phoneHref} email={site.email} />
          </div>
        </div>
      </header>
    </>
  );
}
