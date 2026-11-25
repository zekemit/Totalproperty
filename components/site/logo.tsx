import { cn } from "@/lib/utils";

/**
 * Interim mark: a simplified rendering of the legacy house-and-bars glyph in the new
 * palette. Replace with the commissioned vector logo when it is delivered
 * (see README, Launch blockers).
 */
export function LogoGlyph({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={cn("size-9 shrink-0", className)}>
      <polygon points="3,37 3,22 15,10 15,37" fill={tone === "light" ? "#8f5f00" : "#ddb56a"} />
      <rect x="19" y="4" width="14" height="33" fill={tone === "light" ? "#101927" : "#ece6da"} />
      <rect x="1" y="37" width="34" height="1.5" fill={tone === "light" ? "#101927" : "#ece6da"} />
    </svg>
  );
}

export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <span className={cn("inline-flex shrink-0 items-center gap-3 whitespace-nowrap", className)}>
      <LogoGlyph tone={tone} />
      <span className="flex flex-col">
        <span className={cn("font-display text-[1.75rem] leading-[0.9] tracking-[-0.01em]", tone === "light" ? "text-ink-900" : "text-limestone")}>Total Property</span>
        <span className={cn("mt-1 text-[0.8125rem] font-medium leading-none", tone === "light" ? "text-muted" : "text-sand")}>Management</span>
      </span>
    </span>
  );
}
