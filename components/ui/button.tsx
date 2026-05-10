import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full text-sm font-semibold transition-all disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-slate-950 text-white shadow-soft hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950",
        secondary: "bg-white text-slate-950 shadow-sm ring-1 ring-slate-200 hover:-translate-y-0.5 dark:bg-slate-900 dark:text-white dark:ring-white/10",
        ghost: "hover:bg-slate-100 dark:hover:bg-white/10",
        gradient: "bg-gradient-to-r from-indigo-600 via-violet-600 to-sky-500 text-white shadow-glow hover:-translate-y-0.5"
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";
