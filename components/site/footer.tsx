import Link from "next/link";
import { House } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { getContent } from "@/lib/cms/content";
import { audienceNav, primaryNav } from "@/lib/site";
import { Logo } from "./logo";

export async function Footer() {
  const { site } = await getContent();
  const links = [...primaryNav, ...audienceNav, { href: "/portal", label: "Portal login" }];
  return (
    <footer className="on-dark drawing-grid bg-ink-950 text-limestone">
      <div className="container-page relative pb-8 pt-20 sm:pt-28">
        <p className="font-display text-[clamp(2.4rem,1.2rem+5vw,6rem)] leading-[0.95] tracking-[-0.02em]">
          Let&rsquo;s talk about
          <br />
          your property.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <a href={site.phoneHref} className="link-line block font-display text-[clamp(2.2rem,1.6rem+2.4vw,3.5rem)] leading-none">
              {site.phone}
            </a>
            <a href={`mailto:${site.email}`} className="link-line mt-3 inline-block text-lg text-sand">
              {site.email}
            </a>
            <p className="mt-8 max-w-sm text-sand">
              Our geographic focus includes {site.areasPhrase}. Our goal is to provide exceptional customer service along with a complete customer package designed to meet your needs and enhance asset values.
            </p>
          </div>

          <div className="space-y-8 lg:col-span-3 lg:col-start-6">
            <address className="not-italic text-sand">
              <span className="block font-semibold text-limestone">{site.legalName}</span>
              {site.officeLine ? <span className="block">Office: {site.officeLine}</span> : null}
              <span className="block">{site.officeLine ? "Mail: " : ""}{site.mailingLine}</span>
              {site.serviceAreaDetail ? <span className="mt-3 block">{site.serviceAreaDetail}</span> : null}
            </address>
            {site.hours ? (
              <p className="text-sand">
                <span className="block font-semibold text-limestone">Office hours</span>
                {site.hours}
              </p>
            ) : null}
            {site.licenses.length > 0 ? (
              <ul className="space-y-1 text-sm text-sand">
                {site.licenses.map((l) => (
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

          <section aria-labelledby="newsletter-h" className="lg:col-span-4 lg:col-start-9">
            <div className="sheet on-light p-6 sm:p-8">
              <h2 id="newsletter-h" className="font-display text-4xl leading-none">
                Newsletter
              </h2>
              <p className="mb-6 mt-3 text-muted">Want to be notified when we publish a new article or an update? Sign up, and we&rsquo;ll send a notification by email.</p>
              <NewsletterForm compact />
            </div>
          </section>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-[var(--hairline)] pt-6 lg:flex-row lg:items-center lg:justify-between">
          <Logo tone="dark" />
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
              Equal Housing Opportunity. © {new Date().getFullYear()} {site.legalName}.
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
