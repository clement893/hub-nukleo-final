import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const skeletonVariants = cva("animate-pulse rounded bg-gray-200", {
  variants: {
    variant: {
      text: "h-4",
      circle: "rounded-full",
      rectangle: "h-20",
    },
  },
  defaultVariants: {
    variant: "text",
  },
});

export interface SkeletonProps
  extends VariantProps<typeof skeletonVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  width?: string | number;
  height?: string | number;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant, width, height, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(skeletonVariants({ variant }), className)}
        style={{ width, height, ...style }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export { Skeleton };

