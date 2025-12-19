import * as React from "react";
import { cn } from "../utils/cn";

export interface BreadcrumbItemType {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItemType[];
  separator?: React.ReactNode;
  className?: string;
}

const Breadcrumb = React.forwardRef<HTMLNavElement, BreadcrumbProps>(
  ({ items, separator = "/", className }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn("flex items-center space-x-2", className)}
        aria-label="Breadcrumb"
      >
        <ol className="flex items-center space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <span className="mx-2 text-gray-400" aria-hidden="true">
                    {separator}
                  </span>
                )}
                {isLast ? (
                  <span
                    className="text-sm font-medium text-gray-900"
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="text-sm text-gray-500">{item.label}</span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn("flex flex-wrap items-center gap-1.5 break-words text-sm", className)}
    {...props}
  />
));

BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
));

BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn("transition-colors hover:text-gray-900", className)}
    {...props}
  />
));

BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = React.forwardRef<
  HTMLLIElement,
  React.LiHTMLAttributes<HTMLLIElement> & { children?: React.ReactNode }
>(({ className, children = "/", ...props }, ref) => (
  <li
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children}
  </li>
));

BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator };

