import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const avatarVariants = cva(
  "relative flex shrink-0 overflow-hidden rounded-full",
  {
    variants: {
      size: {
        sm: "h-8 w-8",
        md: "h-10 w-10",
        lg: "h-12 w-12",
        xl: "h-16 w-16",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const avatarImageVariants = cva("aspect-square h-full w-full");

const avatarFallbackVariants = cva(
  "flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
        xl: "text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface AvatarProps
  extends VariantProps<typeof avatarVariants>,
    React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  status?: "online" | "offline" | "away" | "busy";
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, alt, fallback, status, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);
    const showFallback = !src || imageError;

    const getInitials = (name: string) => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        {...props}
      >
        {!showFallback ? (
          <img
            src={src}
            alt={alt}
            className={cn(avatarImageVariants({ size }))}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={cn(avatarFallbackVariants({ size }))}>
            {fallback ? getInitials(fallback) : "?"}
          </div>
        )}
        {status && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              {
                "bg-green-500": status === "online",
                "bg-gray-400": status === "offline",
                "bg-yellow-500": status === "away",
                "bg-red-500": status === "busy",
              }
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };

