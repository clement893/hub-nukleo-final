import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

/**
 * Button component variants configuration
 * Defines the visual styles for different button types and sizes
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-dark shadow-sm hover:shadow",
        secondary:
          "bg-secondary text-secondary-foreground hover:opacity-90 shadow-sm hover:shadow",
        outline:
          "border-2 border-input bg-transparent hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive:
          "bg-destructive text-destructive-foreground hover:opacity-90 shadow-sm",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 py-2",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

/**
 * Button component props
 * 
 * @interface ButtonProps
 * @extends {React.ButtonHTMLAttributes<HTMLButtonElement>}
 * @extends {VariantProps<typeof buttonVariants>}
 * 
 * @property {boolean} [loading] - Shows a loading spinner and disables the button
 * @property {React.ReactNode} [leftIcon] - Icon displayed on the left side of the button text
 * @property {React.ReactNode} [rightIcon] - Icon displayed on the right side of the button text
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" onClick={handleClick}>
 *   Click me
 * </Button>
 * 
 * <Button variant="primary" loading={isLoading}>
 *   Submit
 * </Button>
 * 
 * <Button variant="outline" leftIcon={<Icon />}>
 *   With Icon
 * </Button>
 * ```
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a loading spinner and disables the button */
  loading?: boolean;
  /** Icon displayed on the left side of the button text */
  leftIcon?: React.ReactNode;
  /** Icon displayed on the right side of the button text */
  rightIcon?: React.ReactNode;
}

/**
 * Button component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Supports loading state, icons, and all standard HTML button attributes.
 * 
 * @component
 * @param {ButtonProps} props - The component props
 * @returns {JSX.Element} A button element
 * 
 * @example
 * ```tsx
 * // Primary button
 * <Button variant="primary">Click me</Button>
 * 
 * // Button with loading state
 * <Button variant="primary" loading={isSubmitting}>
 *   Submit
 * </Button>
 * 
 * // Button with icon
 * <Button variant="outline" leftIcon={<PlusIcon />}>
 *   Add Item
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon && <span className="mr-2">{leftIcon}</span>
        )}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
