import React from "react";
import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define button variants using class-variance-authority
const buttonVariants = cva(
  "text-white rounded font-medium hover:bg-transparent transition border border-transparent disabled:border-transparent cursor-pointer disabled:cursor-default disabled:opacity-50 disabled:text-white min-w-fit",
  {
    variants: {
      variant: {
        default:
          "bg-primary hover:text-primary hover:border-primary hover:bg-transparent",
        outline:
          "bg-transparent border-primary text-primary hover:bg-primary hover:text-white",
        destructive:
          "bg-red-600 text-white hover:text-red-600 hover:bg-white hover:border-red-600",
        ghost: "bg-white text-primary border-transparent hover:bg-gray-100",
        link: "text-primary underline-offset-4 hover:underline",
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
