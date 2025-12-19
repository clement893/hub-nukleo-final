import * as React from "react";
import { createContext } from "react";
import { cn } from "../utils/cn";

const AccordionContext = createContext<{
  value: string | string[];
  onValueChange: (value: string) => void;
  type: "single" | "multiple";
}>({
  value: [],
  onValueChange: () => {},
  type: "single",
});

export interface AccordionProps {
  type?: "single" | "multiple";
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  children: React.ReactNode;
  className?: string;
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ type = "single", value, onValueChange, className, children }, ref) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      value || (type === "single" ? "" : [])
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleValueChange = (itemValue: string) => {
      if (type === "single") {
        const newValue = currentValue === itemValue ? "" : itemValue;
        setInternalValue(newValue);
        onValueChange?.(newValue as string);
      } else {
        const currentArray = Array.isArray(currentValue) ? currentValue : [];
        const newValue = currentArray.includes(itemValue)
          ? currentArray.filter((v) => v !== itemValue)
          : [...currentArray, itemValue];
        setInternalValue(newValue);
        onValueChange?.(newValue);
      }
    };

    return (
      <AccordionContext.Provider
        value={{
          value: currentValue,
          onValueChange: handleValueChange,
          type,
        }}
      >
        <div ref={ref} className={cn("space-y-1", className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);

Accordion.displayName = "Accordion";

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("border-b border-gray-200", className)}
        {...props}
      />
    );
  }
);

AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const itemValue = (props as any).value || "";
  const isOpen =
    context.type === "single"
      ? context.value === itemValue
      : Array.isArray(context.value) && context.value.includes(itemValue);

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      onClick={() => context.onValueChange(itemValue)}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 shrink-0 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
});

AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const itemValue = (props as any).value || "";
  const isOpen =
    context.type === "single"
      ? context.value === itemValue
      : Array.isArray(context.value) && context.value.includes(itemValue);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
        className
      )}
      data-state={isOpen ? "open" : "closed"}
      {...props}
    >
      <div className="pb-4 pt-0">{children}</div>
    </div>
  );
});

AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };

