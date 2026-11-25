import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Band, PageHero } from "@/components/site/sections";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("newsletter");
}

export default function NewsletterPage() {
  return (
    <>
      <PageHero
        title="The Total Property|newsletter."
        lede="Want to be notified when we publish a new article or an update? Sign up, and we'll send a notification by email."
      />
      <Band tone="travertine" labelledBy="signup-h">
        <div className="sheet mx-auto max-w-2xl p-6 sm:p-10 lg:ml-[25%]">
          <h2 id="signup-h" className="mb-8 font-display text-5xl leading-none">Sign up</h2>
          <NewsletterForm />
        </div>
      </Band>
    </>
  );
}
