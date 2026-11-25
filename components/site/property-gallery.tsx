import Image from "next/image";
import { Band, SectionTitle } from "./sections";
import { getContent } from "@/lib/cms/content";
import { cn } from "@/lib/utils";

/** Column spans and aspect ratios cycle so the grid stays ragged on a shared top edge. */
const SPANS = ["lg:col-span-6", "lg:col-span-3", "lg:col-span-3"] as const;
const ASPECTS = ["aspect-[3/2]", "aspect-[3/4]", "aspect-[4/5]"] as const;

/** Photos from `propertyPhotos` in src/config/site.ts. Renders nothing until one is supplied. */
export async function PropertyGallery() {
  const photos = (await getContent()).site.propertyPhotos;
  if (photos.length === 0) return null;
  return (
    <Band labelledBy="gallery-h">
      <SectionTitle id="gallery-h" className="mb-14">Properties we manage</SectionTitle>
      <ul className="grid items-start gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {photos.map((p, i) => (
          <li key={p.src} className={SPANS[i % SPANS.length]}>
            <Image
              src={p.src}
              alt={p.alt}
              width={p.width}
              height={p.height}
              sizes="(min-width: 1024px) 50vw, 100vw"
              className={cn("h-auto w-full object-cover", ASPECTS[i % ASPECTS.length])}
            />
          </li>
        ))}
      </ul>
    </Band>
  );
}
