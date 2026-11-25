import { cn } from "@/lib/utils";

/**
 * Interim mark: a simplified rendering of the legacy house-and-bars glyph in the
 * new palette. Replace with the commissioned vector logo when it is delivered
 * (see README → "Brand assets").
 */
export function LogoGlyph({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-10 shrink-0", className)}>
      <polygon points="3,37 3,21 15,10 15,37" fill={tone === "light" ? "#8f5f00" : "#e2b35a"} />
      <rect x="19" y="4" width="14" height="33" fill={tone === "light" ? "#12263f" : "#f7f6f1"} />
    </svg>
  );
}

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <LogoGlyph tone={tone} />
      <span className="flex flex-col leading-none">
        <span className={cn("text-xl font-extrabold tracking-tight", tone === "light" ? "text-navy-800" : "text-white")}>
          Total Property
        </span>
        <span className={cn("mt-1 text-[0.8125rem] font-semibold", tone === "light" ? "text-muted" : "text-muted-on-dark")}>
          Management
        </span>
      </span>
    </span>
  );
}
