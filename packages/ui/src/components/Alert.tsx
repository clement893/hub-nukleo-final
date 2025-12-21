import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        destructive: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const alertIconVariants = cva("flex-shrink-0", {
  variants: {
    variant: {
      default: "text-gray-500 dark:text-gray-400",
      destructive: "text-red-600 dark:text-red-400",
      success: "text-green-600 dark:text-green-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      error: "text-red-600 dark:text-red-400",
      info: "text-blue-600 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const AlertIcon = ({ variant = "default" }: { variant?: VariantProps<typeof alertVariants>["variant"] }) => {
  const iconClass = alertIconVariants({ variant });
  
  switch (variant) {
    case "success":
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "warning":
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "error":
    case "destructive":
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "info":
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  showIcon?: boolean;
  title?: string;
  description?: string;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, showIcon = false, title, description, children, ...props }, ref) => {
    const hasContent = title || description || children;
    
    return (
      <div
        ref={ref}
        role="alert"
        className={cn(alertVariants({ variant }), className)}
        {...props}
      >
        <div className="flex gap-3">
          {showIcon && (
            <div className="flex-shrink-0">
              <AlertIcon variant={variant} />
            </div>
          )}
          {hasContent && (
            <div className="flex-1">
              {title && <AlertTitle>{title}</AlertTitle>}
              {description && <AlertDescription>{description}</AlertDescription>}
              {children && !title && !description && <AlertDescription>{children}</AlertDescription>}
              {children && (title || description) && <div className="mt-2">{children}</div>}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
AlertTitle.displayName = "AlertTitle";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed opacity-90", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

// Composants pré-configurés pour faciliter l'utilisation
const SuccessAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, "variant">>(
  ({ title = "Success", description = "Your action has been completed successfully.", ...props }, ref) => (
    <Alert ref={ref} variant="success" showIcon title={title} description={description} {...props} />
  )
);
SuccessAlert.displayName = "SuccessAlert";

const WarningAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, "variant">>(
  ({ title = "Warning", description = "Please review this warning before proceeding.", ...props }, ref) => (
    <Alert ref={ref} variant="warning" showIcon title={title} description={description} {...props} />
  )
);
WarningAlert.displayName = "WarningAlert";

const ErrorAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, "variant">>(
  ({ title = "Error", description = "An error occurred. Please try again later.", ...props }, ref) => (
    <Alert ref={ref} variant="error" showIcon title={title} description={description} {...props} />
  )
);
ErrorAlert.displayName = "ErrorAlert";

const InfoAlert = React.forwardRef<HTMLDivElement, Omit<AlertProps, "variant">>(
  ({ title = "Info", description, ...props }, ref) => (
    <Alert ref={ref} variant="info" showIcon title={title} description={description} {...props} />
  )
);
InfoAlert.displayName = "InfoAlert";

export { Alert, AlertTitle, AlertDescription, SuccessAlert, WarningAlert, ErrorAlert, InfoAlert };


