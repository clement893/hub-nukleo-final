import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground focus:ring-primary",
        primary: "bg-primary/10 text-primary border border-primary/20 focus:ring-primary",
        secondary: "bg-secondary/10 text-secondary border border-secondary/20 focus:ring-secondary",
        success: "bg-green-500/10 text-green-700 dark:text-green-400 border border-green-500/20 focus:ring-green-500",
        warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border border-yellow-500/20 focus:ring-yellow-500",
        error: "bg-destructive/10 text-destructive border border-destructive/20 focus:ring-destructive",
        outline: "border-2 border-border bg-transparent text-foreground",
        gradient: "bg-aurora text-white shadow-sm",
      },
      size: {
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
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


