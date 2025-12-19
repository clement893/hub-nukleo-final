import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const progressVariants = cva("w-full overflow-hidden rounded-full bg-gray-200", {
  variants: {
    size: {
      sm: "h-1",
      md: "h-2",
      lg: "h-4",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const progressBarVariants = cva("h-full transition-all", {
  variants: {
    variant: {
      primary: "bg-blue-600",
      success: "bg-green-600",
      warning: "bg-yellow-600",
      error: "bg-red-600",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

export interface ProgressProps
  extends VariantProps<typeof progressVariants>,
    VariantProps<typeof progressBarVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showPercentage?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      size,
      variant,
      value,
      max = 100,
      showPercentage = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className="w-full">
        {showPercentage && (
          <div className="mb-1 flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className={cn(progressBarVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };


