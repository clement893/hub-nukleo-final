import * as React from "react";
import { cn } from "../utils/cn";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  indeterminate?: boolean;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, indeterminate, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    const checkboxRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => checkboxRef.current!);

    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    return (
      <div className="w-full">
        <div className="flex items-start space-x-2">
          <input
            type="checkbox"
            id={checkboxId}
            ref={checkboxRef}
            className={cn(
              "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${checkboxId}-error` : undefined}
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error ? "text-red-600" : "text-gray-700"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p
            id={`${checkboxId}-error`}
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

Checkbox.displayName = "Checkbox";

export { Checkbox };


