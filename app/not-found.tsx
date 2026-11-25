import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/site/sections";

export default function NotFound() {
  return (
    <PageHero title="We couldn’t|find that page." lede="It may have moved when we rebuilt the website. These links will get you where you need to go.">
      <Button asChild size="lg"><Link href="/">Go to the homepage</Link></Button>
      <Button asChild size="lg" variant="outline"><Link href="/services">See our services</Link></Button>
      <Button asChild size="lg" variant="outline"><Link href="/contact">Contact us</Link></Button>
    </PageHero>
  );
}
