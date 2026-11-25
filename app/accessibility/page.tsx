import type { Metadata } from "next";
import { Band, PageHero } from "@/components/site/sections";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Accessibility statement",
  description: "Total Property Management's commitment to an accessible website, and how to report a problem.",
  alternates: { canonical: "/accessibility" },
};

export default function AccessibilityPage() {
  return (
    <>
      <PageHero title="Accessibility|statement" lede="Everyone should be able to use this website." />
      <Band tone="travertine">
        <div className="prose-block ">
          <p>
            We design and test this website to meet the Web Content Accessibility Guidelines (WCAG) 2.2, Level AA. That includes keyboard navigation, visible focus indicators, text and controls with sufficient color contrast, labelled form fields with clear error messages, and support for screen readers and for reduced motion.
          </p>
          <h2>Tell us about a problem</h2>
          <p>
            If something on this website is hard to use, or you need information in another format, tell us and we&apos;ll help you directly and work to fix the problem. Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> or call <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>. Please include the page and what you were trying to do.
          </p>
          <h2>Other ways to reach us</h2>
          <p>Everything you can do on this website you can also do by phone, email or mail.</p>
        </div>
      </Band>
    </>
  );
}
