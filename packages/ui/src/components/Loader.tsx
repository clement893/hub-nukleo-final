import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const loaderVariants = cva("animate-spin rounded-full border-t-2 border-b-2", {
  variants: {
    size: {
      sm: "h-4 w-4 border-2",
      md: "h-8 w-8 border-2",
      lg: "h-12 w-12 border-4",
    },
    variant: {
      primary: "border-blue-600",
      secondary: "border-gray-600",
      white: "border-white",
    },
  },
  defaultVariants: {
    size: "md",
    variant: "primary",
  },
});

export interface LoaderProps
  extends VariantProps<typeof loaderVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const Loader = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ className, size, variant, text, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center", className)}
        {...props}
      >
        <div className={cn(loaderVariants({ size, variant }))} />
        {text && (
          <p className="mt-2 text-sm text-gray-600">{text}</p>
        )}
      </div>
    );
  }
);

Loader.displayName = "Loader";

export { Loader };

