import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero, StatementBand } from "@/components/site/sections";
import { ServiceSplits } from "@/components/site/service-splits";
import { getContent } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/page-metadata";

export async function generateMetadata() {
  return pageMetadata("services");
}

export default async function ServicesPage() {
  const { services } = await getContent();
  return (
    <>
      <PageHero
        art="construction"
        title="Property management|services for every|side of the lease."
        lede="We tailor our service to your specific requirements and budget. Choose one of the following services, or all of them."
      >
        <Button asChild size="lg" variant="accent"><Link href="/contact">Ask about your property</Link></Button>
      </PageHero>
      <StatementBand>Dedicated to providing the highest quality service</StatementBand>
      <ServiceSplits services={services} />
    </>
  );
}
