"use client";

import * as React from "react";
import { createContext } from "react";
import { cn } from "../utils/cn";

export interface RadioGroupContextValue {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  error?: string;
  disabled?: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue>({});

export interface RadioGroupProps {
  value?: string;
  onChange?: (value: string) => void;
  name?: string;
  error?: string;
  disabled?: boolean;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  className?: string;
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  (
    {
      value,
      onChange,
      name,
      error,
      disabled,
      orientation = "vertical",
      className,
      children,
    },
    ref
  ) => {
    const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <RadioGroupContext.Provider
        value={{ value, onChange, name: groupName, error, disabled }}
      >
        <div
          ref={ref}
          className={cn(
            "flex",
            orientation === "horizontal" ? "flex-row space-x-4" : "flex-col space-y-2",
            className
          )}
          role="radiogroup"
          aria-invalid={!!error}
        >
          {children}
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </RadioGroupContext.Provider>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "name"> {
  label?: string;
  value: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, value, id, ...props }, ref) => {
    const context = React.useContext(RadioGroupContext);
    const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;
    const isChecked = context.value === value;
    const isDisabled = context.disabled || props.disabled;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (context.onChange) {
        context.onChange(value);
      }
      props.onChange?.(e);
    };

    return (
      <div className="flex items-center space-x-2">
        <input
          type="radio"
          id={radioId}
          ref={ref}
          name={context.name}
          value={value}
          checked={isChecked}
          disabled={isDisabled}
          onChange={handleChange}
          className={cn(
            "h-4 w-4 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            context.error && "border-red-500",
            className
          )}
          aria-invalid={!!context.error}
          {...props}
        />
        {label && (
          <label
            htmlFor={radioId}
            className={cn(
              "text-sm font-medium leading-none cursor-pointer",
              context.error ? "text-red-600" : "text-gray-700",
              isDisabled && "cursor-not-allowed opacity-70"
            )}
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = "Radio";

export { RadioGroup, Radio };

