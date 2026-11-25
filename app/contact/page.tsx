import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/contact-form";
import { Band, PageHero } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Total Property Management",
  description: `Contact Total Property Management in ${siteConfig.place} by phone, email or secure form. Serving ${siteConfig.areasPhrase}.`,
  alternates: { canonical: "/contact" },
};

function Item({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-[var(--hairline)] py-5">
      <dt className="text-sm font-semibold text-brass-700">{label}</dt>
      <dd className="mt-1">{children}</dd>
    </div>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero art="skyline" title="Talk to|Total Property." lede="Call, email, or send a message. Tell us what you need and we'll point you to the right person." />

      <Band tone="travertine" labelledBy="contact-h">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 id="contact-h" className="sr-only">Contact details</h2>
            <dl className="border-b border-[var(--hairline)]">
              <Item label="Phone">
                <a href={siteConfig.phoneHref} className="link-line font-display text-5xl leading-none sm:text-6xl">{siteConfig.phone}</a>
              </Item>
              <Item label="Email">
                <a href={`mailto:${siteConfig.email}`} className="link-line font-display text-3xl leading-none sm:text-4xl">{siteConfig.email}</a>
              </Item>
              {siteConfig.officeLine ? <Item label="Office">{siteConfig.officeLine}</Item> : null}
              <Item label="Mailing address">
                <address className="not-italic">
                  {siteConfig.legalName}
                  <br />
                  {siteConfig.mailingLine}
                </address>
              </Item>
              {siteConfig.hours ? <Item label="Hours">{siteConfig.hours}</Item> : null}
              <Item label="Tenant with an emergency?">
                Call <a href={siteConfig.emergencyPhoneHref} className="link-line font-semibold">{siteConfig.emergencyPhone}</a>. For a routine repair use the{" "}
                <a href="/tenants#maintenance" className="link-line font-semibold">maintenance request form</a>.
              </Item>
            </dl>
          </div>
          <div className="sheet p-6 sm:p-10 lg:col-span-7">
            <h2 className="mb-8 font-display text-4xl leading-none sm:text-5xl">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </Band>
    </>
  );
}
