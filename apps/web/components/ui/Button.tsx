"use client";

import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-studio-ink/20 focus:ring-offset-2 focus:ring-offset-studio-sand disabled:opacity-50 disabled:pointer-events-none overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-studio-ink text-white hover:bg-studio-ink/90 shadow-soft hover:shadow-card active:scale-[0.98] hover:-translate-y-0.5",
        secondary:
          "bg-white text-studio-ink border border-studio-ink/10 hover:bg-studio-cream shadow-soft hover:shadow-card active:scale-[0.98] hover:-translate-y-0.5",
        ghost:
          "text-studio-ink hover:bg-studio-ink/5 active:bg-studio-ink/10",
        rose:
          "bg-gradient-to-r from-studio-rose to-studio-rose/90 text-studio-ink hover:from-studio-rose/90 hover:to-studio-rose/80 shadow-soft active:scale-[0.98] hover:-translate-y-0.5",
        premium:
          "bg-gradient-to-r from-studio-ink via-studio-ink/95 to-studio-ink text-white shadow-card hover:shadow-elevated active:scale-[0.98] hover:-translate-y-0.5",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg font-semibold",
        xl: "h-16 px-10 text-lg font-semibold tracking-wide",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  shimmer?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shimmer, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      >
        {shimmer && (
          <span className="absolute inset-0 -translate-x-full animate-shimmer bg-shimmer" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
