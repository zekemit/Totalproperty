import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero, Section } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Total Property Management",
  description: `Contact Total Property Management in ${siteConfig.place} by phone, email or secure form. Serving ${siteConfig.areasPhrase}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero title="Talk to Total Property." lede="Call, email, or send a message. Tell us what you need and we'll point you to the right person." />

      <Section labelledBy="contact-h">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="contact-h" className="text-2xl">Reach us directly</h2>
            <ul className="mt-6 space-y-6">
              <li className="flex gap-4">
                <Phone aria-hidden="true" className="mt-1 size-6 shrink-0 text-copper" />
                <div>
                  <p className="font-bold text-navy-800">Phone</p>
                  <a href={siteConfig.phoneHref} className="text-lg underline underline-offset-4">{siteConfig.phone}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <Mail aria-hidden="true" className="mt-1 size-6 shrink-0 text-copper" />
                <div>
                  <p className="font-bold text-navy-800">Email</p>
                  <a href={`mailto:${siteConfig.email}`} className="text-lg underline underline-offset-4">{siteConfig.email}</a>
                </div>
              </li>
              <li className="flex gap-4">
                <MapPin aria-hidden="true" className="mt-1 size-6 shrink-0 text-copper" />
                <address className="not-italic">
                  {siteConfig.officeLine ? (
                    <>
                      <p className="font-bold text-navy-800">Office</p>
                      {siteConfig.officeLine}
                      <br />
                    </>
                  ) : null}
                  <p className={siteConfig.officeLine ? "mt-3 font-bold text-navy-800" : "font-bold text-navy-800"}>Mailing address</p>
                  {siteConfig.legalName}
                  <br />
                  {siteConfig.mailingLine}
                </address>
              </li>
              {siteConfig.hours ? (
                <li className="flex gap-4">
                  <Clock aria-hidden="true" className="mt-1 size-6 shrink-0 text-copper" />
                  <div>
                    <p className="font-bold text-navy-800">Hours</p>
                    {siteConfig.hours}
                  </div>
                </li>
              ) : null}
            </ul>
            <p className="mt-8 rounded-lg bg-alabaster-2 p-4">
              <strong className="text-navy-800">Tenant with an emergency?</strong> Call {siteConfig.emergencyPhone}. For a routine repair use the <a href="/tenants#maintenance" className="font-bold text-navy-700 underline">maintenance request form</a>.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-8">
            <h2 className="mb-6 text-2xl">Send a message</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
