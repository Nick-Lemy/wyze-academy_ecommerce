import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "text-white rounded-lg font-normal hover:bg-transparent transition border border-transparent disabled:border-transparent cursor-pointer disabled:cursor-default disabled:bg-surface-500/20 disabled:text-white min-w-fit",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:text-primary hover:border-primary hover:bg-transparent",
        secondary:
          "bg-secondary hover:text-secondary hover:border-secondary hover:bg-white",
        destructive:
          "bg-error text-white hover:text-error hover:bg-white hover:border-error",
        outline:
          "bg-white border-gray-300 text-gray hover:bg-gray-50 hover:text-gray-900",
        "default-outline": "text-primary border-primary",
        "secondary-outline": "text-secondary border-secondary",
        ghost: "bg-white text-primary border-transparent hover:bg-surface-200",
        "ghost-secondary":
          "bg-white text-secondary border-transparent hover:bg-surface-200",
        link: "",
      },
      size: {
        default: "py-4 px-8 text-xl",
        sm: "py-3 px-6",
        xs: "py-2 px-6",
        "2xs": "py-2 px-4 text-xs",
        lg: "py-6 px-10 text-2xl",
        icon: "p-2 w-10 h-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

/**
 * Button component with multiple variants
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
