import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CmsImage } from "./cms-image";
import { Band, display, type Tone } from "./sections";

/** A picture beside a heading and copy, alternating sides, as on the reference's About page. */
export function ImageSplit({
  id,
  tone = "limestone",
  title,
  image,
  alt,
  flip = false,
  children,
}: {
  id: string;
  tone?: Tone;
  title: string;
  image: string;
  alt: string;
  flip?: boolean;
  children: ReactNode;
}) {
  return (
    <Band tone={tone} labelledBy={`${id}-h`} className="!py-16 sm:!py-24">
      <div className="grid items-center gap-x-16 gap-y-10 lg:grid-cols-12">
        <div className={cn("lg:col-span-6", flip ? "lg:order-2 lg:col-start-7" : "")}>
          <div className="relative">
            <span aria-hidden="true" className={cn("absolute -bottom-4 hidden size-full border border-brass-600/60 lg:block", flip ? "-left-4" : "-right-4")} />
            <CmsImage src={image} alt={alt} sizes="(min-width: 1024px) 46vw, 100vw" frameClassName="aspect-[4/3]" />
          </div>
        </div>
        <div className={cn("lg:col-span-5", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-8")}>
          <h2 id={`${id}-h`} className={cn(display.section, "max-w-[12ch]")}>{title}</h2>
          <div className="prose-block mt-8 text-lg">{children}</div>
        </div>
      </div>
    </Band>
  );
}
