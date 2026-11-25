import type { Metadata } from "next";
import { PageHero, Section } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How Total Property Management collects, uses and protects information submitted through this website.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero title="Privacy policy" lede="Last updated November 25, 2026." />
      <Section>
        <div className="prose-block max-w-3xl">
          <p>
            This policy explains what {siteConfig.legalName} (&ldquo;we&rdquo;) collects through this website and how we use it. It applies to this website only.
          </p>

          <h2>What we collect</h2>
          <p>We collect only what you choose to send us through our forms:</p>
          <ul>
            <li><strong>Contact details:</strong> your name, email address and, where you provide it, phone number.</li>
            <li><strong>Request details:</strong> for a rental analysis, the property address and details you enter; for a maintenance request, the address, unit and problem description; for a vendor inquiry, your company, trade and service area; and any message you write.</li>
            <li><strong>Technical information:</strong> your browser&apos;s user-agent string, and a one-way (hashed) form of your IP address that we use to detect abuse. We do not store your IP address itself.</li>
            <li><strong>Campaign source:</strong> if you arrive from a marketing link, we note which campaign sent you.</li>
          </ul>
          <p>The vacancy calculator on the Owners page runs in your browser. The numbers you type into it are not sent to us unless you choose to use the rent in your request.</p>

          <h2>How we use it</h2>
          <p>We use your information to respond to your request, prepare your rental analysis, handle maintenance and vendor inquiries, keep business records, and protect this website from spam and abuse. We contact you by phone or email about your request only if you agreed to when you submitted the form.</p>

          <h2>Who handles it for us</h2>
          <p>We don&apos;t sell your information. We use service providers who process it on our behalf to host this website, store form submissions, check that submissions come from people, and deliver notification email to our team. They may only use it to provide those services.</p>

          <h2>Cookies and tracking</h2>
          <p>This website does not set advertising or analytics cookies. If you arrive from a marketing link, your browser may store the campaign source for the duration of your visit so we can attribute your request correctly.</p>

          <h2>How long we keep it</h2>
          <p>We keep submissions for as long as we need them to respond to you and to maintain our business records, and then delete them.</p>

          <h2>Your choices</h2>
          <p>
            You can ask us to access, correct or delete the information you sent us, or to stop contacting you, by emailing{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or calling <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>.
          </p>

          <h2>Security</h2>
          <p>Form submissions are sent over an encrypted connection and are stored in a database that is not accessible from the public internet. No method of transmission or storage is perfectly secure, so we cannot guarantee absolute security.</p>

          <h2>Changes</h2>
          <p>We will post any changes to this policy on this page and update the date above.</p>

          <h2>Contact</h2>
          <p>{siteConfig.legalName}, {siteConfig.mailingLine}.</p>
        </div>
      </Section>
    </>
  );
}
