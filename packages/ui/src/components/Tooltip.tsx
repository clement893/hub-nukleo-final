import * as React from "react";
import { cn } from "../utils/cn";

export type TooltipPosition = "top" | "bottom" | "left" | "right";

export interface TooltipProps {
  content: React.ReactNode;
  position?: TooltipPosition;
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, position = "top", delay = 200, children, className }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const timeoutRef = React.useRef<NodeJS.Timeout>();

    const showTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
    };

    const hideTooltip = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsVisible(false);
    };

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    const positionClasses = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrowClasses = {
      top: "top-full left-1/2 -translate-x-1/2 border-t-gray-900",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-gray-900",
      left: "left-full top-1/2 -translate-y-1/2 border-l-gray-900",
      right: "right-full top-1/2 -translate-y-1/2 border-r-gray-900",
    };

    return (
      <div
        ref={ref}
        className={cn("relative inline-block", className)}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
        {isVisible && (
          <div
            className={cn(
              "absolute z-50 rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white shadow-lg",
              positionClasses[position]
            )}
            role="tooltip"
          >
            {content}
            <div
              className={cn(
                "absolute h-0 w-0 border-4 border-transparent",
                arrowClasses[position]
              )}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };

