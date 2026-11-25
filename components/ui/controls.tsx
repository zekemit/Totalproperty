import * as React from "react";
import { cn } from "@/lib/utils";

/** Field borders are #7B7568 (4.3:1 on the paper sheet), well above the 3:1 non-text minimum. */
const control =
  "block w-full rounded-[2px] border border-field bg-paper px-4 text-base text-text placeholder:text-muted/70 transition-colors focus-visible:border-ink-900 aria-[invalid=true]:border-2 aria-[invalid=true]:border-danger disabled:opacity-60";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(control, "min-h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 py-3", className)} {...props} />;
}

/** Native <select>: best accessibility and mobile UX, styled to match. */
export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(control, "min-h-12 appearance-none bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-11", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5 8l5 5 5-5' stroke='%23101927' stroke-width='1.6' fill='none'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
