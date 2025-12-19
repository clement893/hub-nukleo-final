import * as React from "react";
import { createContext } from "react";
import { cn } from "../utils/cn";

const TabsContext = createContext<{
  value: string;
  onValueChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
}>({
  value: "",
  onValueChange: () => {},
});

export interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  orientation?: "horizontal" | "vertical";
  children: React.ReactNode;
  className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({ value, onValueChange, orientation = "horizontal", className, children }, ref) => {
    return (
      <TabsContext.Provider value={{ value, onValueChange, orientation }}>
        <div
          ref={ref}
          className={cn(
            orientation === "vertical" ? "flex flex-row" : "flex flex-col",
            className
          )}
          role="tablist"
        >
          {children}
        </div>
      </TabsContext.Provider>
    );
  }
);

Tabs.displayName = "Tabs";

const TabsList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-gray-100 p-1",
        context.orientation === "vertical" && "flex-col",
        className
      )}
      role="tablist"
      {...props}
    />
  );
});

TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:bg-gray-200",
        className
      )}
      role="tab"
      aria-selected={isActive}
      onClick={() => context.onValueChange(value)}
      {...props}
    />
  );
});

TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(TabsContext);
  const isActive = context.value === value;

  if (!isActive) return null;

  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2",
        className
      )}
      role="tabpanel"
      {...props}
    />
  );
});

TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };

