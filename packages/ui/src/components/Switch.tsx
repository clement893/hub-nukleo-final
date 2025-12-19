import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const switchVariants = cva("", {
  variants: {
    size: {
      sm: "h-4 w-7",
      md: "h-5 w-9",
      lg: "h-6 w-11",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const switchThumbVariants = cva("", {
  variants: {
    size: {
      sm: "h-3 w-3 translate-x-0.5",
      md: "h-4 w-4 translate-x-0.5",
      lg: "h-5 w-5 translate-x-0.5",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "size">,
    VariantProps<typeof switchVariants> {
  label?: string;
  error?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, label, error, size, id, ...props }, ref) => {
    const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="w-full">
        <div className="flex items-center space-x-2">
          <label
            htmlFor={switchId}
            className="relative inline-flex cursor-pointer items-center"
          >
            <input
              type="checkbox"
              id={switchId}
              ref={ref}
              className="peer sr-only"
              aria-invalid={!!error}
              aria-describedby={error ? `${switchId}-error` : undefined}
              {...props}
            />
            <div
              className={cn(
                switchVariants({ size }),
                "peer rounded-full bg-gray-200 transition-colors peer-checked:bg-blue-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 peer-focus:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
                error && "bg-red-200 peer-checked:bg-red-600",
                className
              )}
            />
            <div
              className={cn(
                switchThumbVariants({ size }),
                "absolute left-0 top-1/2 -translate-y-1/2 rounded-full bg-white transition-transform peer-checked:translate-x-full"
              )}
            />
          </label>
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                "text-sm font-medium cursor-pointer",
                error ? "text-red-600" : "text-gray-700"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p
            id={`${switchId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };


