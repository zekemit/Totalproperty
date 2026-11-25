import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoMark } from "@/components/site/logo";
import { isAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) redirect("/admin/login");
  return (
    <>
      <header className="border-b border-ink-900/30 bg-paper">
        <div className="container-page flex min-h-16 flex-wrap items-center justify-between gap-4 py-2">
          <div className="flex items-center gap-4">
            <LogoMark className="h-10" />
            <div>
              <p className="font-display text-2xl leading-none">Site editor</p>
              <p className="text-sm text-muted">Change the website. No code needed.</p>
            </div>
          </div>
          <nav aria-label="Editor" className="flex items-center gap-5">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="link-line font-semibold">
              View the site<span className="sr-only"> (opens in a new tab)</span>
            </Link>
            <form action="/api/admin/logout" method="post">
              <button type="submit" className="min-h-11 border border-ink-900 px-4 font-semibold hover:bg-ink-900 hover:text-paper">
                Sign out
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="outline-none">
        <h1 className="sr-only">Site editor</h1>
        {children}
      </main>
    </>
  );
}
