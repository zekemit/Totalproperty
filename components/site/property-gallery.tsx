import Image from "next/image";
import { Section, SectionHeading } from "./sections";
import { siteConfig } from "@/lib/site";

/**
 * Photos of managed properties from `propertyPhotos` in src/config/site.ts. Renders nothing
 * until at least one photo is supplied. `next/image` serves AVIF/WebP at the right size.
 */
export function PropertyGallery() {
  const photos = siteConfig.propertyPhotos;
  if (photos.length === 0) return null;
  return (
    <Section labelledBy="gallery-h">
      <SectionHeading id="gallery-h" title="Properties we manage" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((p) => (
          <li key={p.src} className="overflow-hidden rounded-xl border border-line bg-white">
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw"
              className="aspect-[3/2] h-auto w-full object-cover"
            />
          </li>
        ))}
      </ul>
    </Section>
  );
}
