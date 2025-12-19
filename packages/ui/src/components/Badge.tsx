import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-800 focus:ring-gray-500",
        primary: "bg-blue-100 text-blue-800 focus:ring-blue-500",
        secondary: "bg-gray-200 text-gray-900 focus:ring-gray-500",
        success: "bg-green-100 text-green-800 focus:ring-green-500",
        warning: "bg-yellow-100 text-yellow-800 focus:ring-yellow-500",
        error: "bg-red-100 text-red-800 focus:ring-red-500",
        outline: "border border-gray-300 bg-transparent text-gray-700",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-0.5 text-sm",
        lg: "px-3 py-1 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };


