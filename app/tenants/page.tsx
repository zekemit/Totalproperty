import type { Metadata } from "next";
import { ExternalLink, Phone } from "lucide-react";
import { MaintenanceForm } from "@/components/forms/maintenance-form";
import { Button } from "@/components/ui/button";
import { PageHero, Section, SectionHeading } from "@/components/site/sections";
import { portalUrls } from "@/lib/portals";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tenants: pay rent, request maintenance, portal access",
  description:
    "Tenant hub for Total Property Management: pay rent, report a maintenance problem, and find the tenant portal.",
  alternates: { canonical: "/tenants" },
};

const steps = [
  { title: "Is it an emergency?", text: `If anyone is in danger, call 911 first. For an emergency at your home, such as active flooding, no heat in freezing weather, a gas smell or a fire, call us right away at ${siteConfig.phone}.` },
  { title: "Not an emergency? Send a request.", text: "Use the form below. Tell us what's wrong, where it is, and how to reach you." },
  { title: "We follow up.", text: "Our team reviews your request and contacts you about next steps." },
] as const;

function ExternalButton({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" }) {
  return (
    <Button asChild size="lg" variant={variant}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
        <ExternalLink aria-hidden="true" />
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </Button>
  );
}

export default function TenantsPage() {
  const { tenant, payment } = portalUrls();

  return (
    <>
      <PageHero kicker="For tenants" title="Pay rent. Report a repair. Get an answer." lede="Everything you need as a Total Property tenant, in one place." />

      <Section labelledBy="portal-h">
        <SectionHeading id="portal-h" title="Portal and rent" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="text-xl">Tenant portal</h3>
            {tenant ? (
              <>
                <p className="mb-5 mt-2">Sign in to see your account and documents.</p>
                <ExternalButton href={tenant}>Open tenant portal</ExternalButton>
              </>
            ) : (
              <p className="mt-2">Portal access isn&apos;t linked from this website yet. Call <a href={siteConfig.phoneHref} className="font-bold text-navy-700 underline">{siteConfig.phone}</a> or email <a href={`mailto:${siteConfig.email}`} className="font-bold text-navy-700 underline">{siteConfig.email}</a> and we&apos;ll point you to the right place.</p>
            )}
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <h3 className="text-xl">Pay rent</h3>
            {payment ? (
              <>
                <p className="mb-5 mt-2">Pay securely through our payment partner.</p>
                <ExternalButton href={payment} variant="outline">Pay rent online</ExternalButton>
              </>
            ) : (
              <p className="mt-2">Online payment isn&apos;t available on this website yet. Call <a href={siteConfig.phoneHref} className="font-bold text-navy-700 underline">{siteConfig.phone}</a> for current payment instructions.</p>
            )}
          </div>
        </div>
      </Section>

      <Section id="maintenance" tone="panel" labelledBy="maintenance-h" className="scroll-mt-4">
        <SectionHeading id="maintenance-h" title="Report a maintenance problem" />
        <ol className="mb-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-line bg-white p-6">
              <span aria-hidden="true" className="flex size-10 items-center justify-center rounded-full bg-navy-800 text-lg font-extrabold text-white">{i + 1}</span>
              <h3 className="mt-4 text-xl">{s.title}</h3>
              <p className="mt-2">{s.text}</p>
            </li>
          ))}
        </ol>

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h3 className="text-2xl">Maintenance request</h3>
            <a href={siteConfig.phoneHref} className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-navy-700 underline underline-offset-4">
              <Phone aria-hidden="true" className="size-5" />
              Emergency? Call {siteConfig.phone}
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card sm:p-8 lg:col-span-8">
            <MaintenanceForm />
          </div>
        </div>
      </Section>
    </>
  );
}
