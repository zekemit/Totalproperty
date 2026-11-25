import { ExternalLink } from "lucide-react";
import { MaintenanceForm } from "@/components/forms/maintenance-form";
import { Button } from "@/components/ui/button";
import { Band, display, EditorialRow, IndexRows, PageHero, SectionTitle } from "@/components/site/sections";
import { portalUrlsFor } from "@/lib/portals";
import { getContent } from "@/lib/cms/content";
import { MobileCtaBar } from "@/components/site/mobile-cta";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("tenants");
}

const steps = (siteConfig: { emergencyPhone: string }) => [
  { title: "Is it an emergency?", text: `If anyone is in danger, call 911 first. For an emergency at your home, such as active flooding, no heat in freezing weather, a gas smell or a fire, call us right away at ${siteConfig.emergencyPhone}.` },
  { title: "Not an emergency? Send a request.", text: "Use the form below. Tell us what's wrong, where it is, and how to reach you." },
  { title: "We follow up.", text: "Our team reviews your request and contacts you about next steps." },
];

function Door({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <li className="grid gap-x-10 gap-y-5 border-t border-[var(--hairline)] py-10 lg:grid-cols-12 lg:items-center">
      <h3 className={`${display.section} lg:col-span-6`}>{title}</h3>
      <div className="lg:col-span-5 lg:col-start-8">{children}</div>
    </li>
  );
}

function External({ href, children, variant = "primary" }: { href: string; children: React.ReactNode; variant?: "primary" | "outline" }) {
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

export default async function TenantsPage() {
  const { site: siteConfig } = await getContent();
  const { tenant, payment } = portalUrlsFor(siteConfig);
  const call = (
    <a href={siteConfig.phoneHref} className="link-line font-semibold">
      {siteConfig.phone}
    </a>
  );

  return (
    <>
      <PageHero art="tenants" kicker="For tenants" title="Tenant portal,|rent payment|and repairs." lede="Everything you need as a Total Property tenant, in one place." />

      <Band labelledBy="doors-h">
        <h2 id="doors-h" className="sr-only">Portal, rent and repairs</h2>
        <ul className="border-b border-[var(--hairline)]">
          <Door title="Tenant portal">
            {tenant ? (
              <>
                <p className="mb-5 text-lg">Sign in to see your account and documents.</p>
                <External href={tenant}>Open tenant portal</External>
              </>
            ) : (
              <p className="text-lg">To get set up with your tenant portal, call {call} or email <a href={`mailto:${siteConfig.email}`} className="link-line font-semibold">{siteConfig.email}</a> and we&rsquo;ll help you directly.</p>
            )}
          </Door>
          <Door title="Pay rent">
            {payment ? (
              <>
                <p className="mb-5 text-lg">Pay securely through our payment partner.</p>
                <External href={payment} variant="outline">Pay rent online</External>
              </>
            ) : (
              <p className="text-lg">To pay rent, call {call} for current payment instructions.</p>
            )}
          </Door>
          <Door title="Report a repair">
            <p className="mb-5 text-lg">Tell us what&rsquo;s wrong and we&rsquo;ll follow up.</p>
            <Button asChild size="lg"><a href="#maintenance">Send a maintenance request</a></Button>
          </Door>
        </ul>
      </Band>

      <Band tone="ink" labelledBy="steps-h">
        <EditorialRow label={<h2 id="steps-h" className="font-sans text-base font-semibold text-brass-300">When something breaks</h2>}>
          <IndexRows numbered items={steps(siteConfig).map((s) => ({ title: s.title, text: s.text }))} />
        </EditorialRow>
      </Band>

      <Band id="maintenance" tone="travertine" labelledBy="request-h" className="scroll-mt-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionTitle id="request-h">Maintenance request</SectionTitle>
            <p className="mt-8 text-muted">Emergency? Don&rsquo;t wait for a form.</p>
            <a href={siteConfig.emergencyPhoneHref} className="link-line mt-2 inline-block font-display text-5xl leading-none">
              {siteConfig.emergencyPhone}
            </a>
          </div>
          <div className="sheet p-6 sm:p-10 lg:col-span-8">
            <MaintenanceForm />
          </div>
        </div>
      </Band>
      <MobileCtaBar phone={siteConfig.emergencyPhone} phoneHref={siteConfig.emergencyPhoneHref} label="Report a repair" href="#maintenance" />
    </>
  );
}
