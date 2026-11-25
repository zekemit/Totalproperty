import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Square-cornered, 44px+ targets. Brass is an edge or a fill, never a gradient wash. */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-semibold leading-none whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-ink-900 text-paper shadow-[inset_0_-3px_0_var(--color-brass-400)] hover:bg-ink-700",
        accent: "bg-brass-400 text-ink-950 shadow-[inset_0_-3px_0_var(--color-brass-700)] hover:bg-brass-300",
        outline: "border border-ink-900 text-ink-900 hover:bg-ink-900 hover:text-paper",
        "outline-light": "border border-sand text-limestone hover:border-limestone hover:bg-limestone hover:text-ink-950",
      },
      size: {
        sm: "min-h-11 px-4 text-[0.9375rem]",
        md: "min-h-12 px-6 text-base",
        lg: "min-h-14 px-8 text-[1.0625rem]",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
