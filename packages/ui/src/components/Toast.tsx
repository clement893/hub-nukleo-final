import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-6 shadow-lg transition-all dark:shadow-xl",
  {
    variants: {
      variant: {
        success: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100",
        error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100",
        warning: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100",
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  }
);

const toastIconVariants = cva("flex-shrink-0", {
  variants: {
    variant: {
      success: "text-green-600 dark:text-green-400",
      error: "text-red-600 dark:text-red-400",
      warning: "text-yellow-600 dark:text-yellow-400",
      info: "text-blue-600 dark:text-blue-400",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

const ToastIcon = ({ variant = "info" }: { variant?: VariantProps<typeof toastVariants>["variant"] }) => {
  const iconClass = toastIconVariants({ variant });
  
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
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "info":
    default:
      return (
        <svg className={cn("h-5 w-5", iconClass)} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
  }
};

export interface ToastProps
  extends VariantProps<typeof toastVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  onClose?: () => void;
  duration?: number;
  showIcon?: boolean;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, action, onClose, showIcon = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <div className="flex items-start gap-3 flex-1">
          {showIcon && (
            <div className="flex-shrink-0 mt-0.5">
              <ToastIcon variant={variant} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {title && <div className="font-semibold">{title}</div>}
            {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
          </div>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute right-2 top-2 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2"
            aria-label="Close"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = "Toast";

// Composants pré-configurés pour faciliter l'utilisation
const SuccessToast = React.forwardRef<HTMLDivElement, Omit<ToastProps, "variant">>(
  ({ title = "Success", description = "Your action has been completed successfully.", showIcon = true, ...props }, ref) => (
    <Toast ref={ref} variant="success" showIcon={showIcon} title={title} description={description} {...props} />
  )
);
SuccessToast.displayName = "SuccessToast";

const WarningToast = React.forwardRef<HTMLDivElement, Omit<ToastProps, "variant">>(
  ({ title = "Warning", description = "Please review this warning before proceeding.", showIcon = true, ...props }, ref) => (
    <Toast ref={ref} variant="warning" showIcon={showIcon} title={title} description={description} {...props} />
  )
);
WarningToast.displayName = "WarningToast";

const ErrorToast = React.forwardRef<HTMLDivElement, Omit<ToastProps, "variant">>(
  ({ title = "Error", description = "An error occurred. Please try again later.", showIcon = true, ...props }, ref) => (
    <Toast ref={ref} variant="error" showIcon={showIcon} title={title} description={description} {...props} />
  )
);
ErrorToast.displayName = "ErrorToast";

const InfoToast = React.forwardRef<HTMLDivElement, Omit<ToastProps, "variant">>(
  ({ title = "Info", description, showIcon = true, ...props }, ref) => (
    <Toast ref={ref} variant="info" showIcon={showIcon} title={title} description={description} {...props} />
  )
);
InfoToast.displayName = "InfoToast";

export { Toast, SuccessToast, WarningToast, ErrorToast, InfoToast };


