import Image from "next/image";
import { PHOTOS } from "@/lib/photos";
import { cn } from "@/lib/utils";

/** The company's pit bull mark, from the original brand files (see MAXALLEY_REFERENCE_AUDIT.md). */
export function LogoMark({ className }: { className?: string }) {
  return <Image src={PHOTOS.mark.src} width={PHOTOS.mark.width} height={PHOTOS.mark.height} alt="" className={cn("h-11 w-auto shrink-0", className)} />;
}

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <LogoMark />
      <span className="flex flex-col">
        <span className={cn("font-display text-[1.75rem] leading-[0.9] tracking-[-0.01em]", tone === "light" ? "text-ink-900" : "text-limestone")}>Total Property</span>
        <span className={cn("mt-1 text-[0.8125rem] font-medium leading-none", tone === "light" ? "text-muted" : "text-sand")}>Management</span>
      </span>
    </span>
  );
}

/** Back-compat for diagrams that place the mark on its own. Size it with a height class. */
export function LogoGlyph({ className }: { className?: string; tone?: "light" | "dark" }) {
  return <LogoMark className={cn("w-auto object-contain", className)} />;
}
