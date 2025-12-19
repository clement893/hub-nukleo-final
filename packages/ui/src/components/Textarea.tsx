import * as React from "react";
import { cn } from "../utils/cn";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  showCharacterCount?: boolean;
  maxLength?: number;
  autoResize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      required,
      showCharacterCount,
      maxLength,
      autoResize,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const currentLength = typeof value === "string" ? value.length : 0;

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (autoResize && ref && "current" in ref && ref.current) {
        ref.current.style.height = "auto";
        ref.current.style.height = `${ref.current.scrollHeight}px`;
      }
      onChange?.(e);
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            {label}
            {required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          ref={ref}
          value={value}
          onChange={handleChange}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={
            error
              ? `${textareaId}-error`
              : helperText
              ? `${textareaId}-helper`
              : undefined
          }
          {...props}
        />
        <div className="mt-1 flex items-center justify-between">
          <div>
            {error && (
              <p
                id={`${textareaId}-error`}
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p
                id={`${textareaId}-helper`}
                className="text-sm text-gray-500"
              >
                {helperText}
              </p>
            )}
          </div>
          {showCharacterCount && maxLength && (
            <p
              className={cn(
                "text-sm",
                currentLength > maxLength * 0.9
                  ? "text-orange-500"
                  : "text-gray-500"
              )}
            >
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

