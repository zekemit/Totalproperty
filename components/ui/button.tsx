import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/** Interactive targets are at least 44px tall (WCAG 2.2 target size, comfortable on touch). */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md font-bold leading-none whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-60 [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy-800 text-white hover:bg-navy-700",
        accent: "bg-gold text-navy-900 hover:bg-gold-hover",
        outline: "border-2 border-navy-800 text-navy-800 hover:bg-navy-800 hover:text-white",
        "outline-light": "border-2 border-white/80 text-white hover:bg-white hover:text-navy-900",
      },
      size: {
        sm: "min-h-11 px-4 text-[0.9375rem]",
        md: "min-h-12 px-6 text-base",
        lg: "min-h-14 px-8 text-lg",
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
