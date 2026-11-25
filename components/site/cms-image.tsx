import Image from "next/image";
import { safeImage } from "@/lib/cms/safe-url";
import { cn } from "@/lib/utils";

/**
 * A picture from the CMS: either a file in /public (optimised by next/image) or an https image
 * Rafi pasted in /admin (shown as-is; the Content-Security-Policy allows https images).
 * The frame fixes the aspect ratio, so a photo of any shape never shifts the layout.
 * An unsafe or empty source renders nothing, never a broken image.
 */
export function CmsImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
  frameClassName = "aspect-[3/2]",
}: {
  src: string | undefined;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  frameClassName?: string;
}) {
  const safe = safeImage(src);
  if (!safe) return null;
  const local = safe.startsWith("/");
  return (
    <span className={cn("relative block overflow-hidden bg-travertine", frameClassName)}>
      {local ? (
        <Image src={safe} alt={alt} fill sizes={sizes} priority={priority} className={cn("object-cover", className)} />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={safe} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer" className={cn("absolute inset-0 size-full object-cover", className)} />
      )}
    </span>
  );
}
