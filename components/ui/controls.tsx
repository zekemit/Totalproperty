import * as React from "react";
import { cn } from "@/lib/utils";

const control =
  "block w-full rounded-md border border-field-border bg-white px-4 text-base text-ink placeholder:text-muted/80 aria-[invalid=true]:border-danger aria-[invalid=true]:border-2 disabled:opacity-60";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn(control, "min-h-12", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn(control, "min-h-32 py-3", className)} {...props} />;
}

/** Native <select>: best accessibility and mobile UX, styled to match. */
export function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn(control, "min-h-12 appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-11", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%2312263f'%3E%3Cpath d='M5.5 7.5 10 12l4.5-4.5' stroke='%2312263f' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
