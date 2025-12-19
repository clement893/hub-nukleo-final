import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@nukleo/ui";
import { cn } from "@nukleo/ui";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

/**
 * GlassCard - A reusable card component with glassmorphism effect
 * Automatically applies glass styling and dark mode support
 */
export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <Card
      className={cn(
        "glass card-shadow hover:card-shadow-hover transition-all duration-300 animate-fade-in",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

interface GlassCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardHeader({ children, className, ...props }: GlassCardHeaderProps) {
  return (
    <CardHeader className={cn(className)} {...props}>
      {children}
    </CardHeader>
  );
}

interface GlassCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function GlassCardTitle({ children, className, ...props }: GlassCardTitleProps) {
  return (
    <CardTitle className={cn("text-gray-900 dark:text-white", className)} {...props}>
      {children}
    </CardTitle>
  );
}

interface GlassCardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
}

export function GlassCardDescription({ children, className, ...props }: GlassCardDescriptionProps) {
  return (
    <CardDescription className={cn("text-gray-600 dark:text-gray-400", className)} {...props}>
      {children}
    </CardDescription>
  );
}

interface GlassCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardContent({ children, className, ...props }: GlassCardContentProps) {
  return (
    <CardContent className={cn(className)} {...props}>
      {children}
    </CardContent>
  );
}

interface GlassCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function GlassCardFooter({ children, className, ...props }: GlassCardFooterProps) {
  return (
    <CardFooter className={cn(className)} {...props}>
      {children}
    </CardFooter>
  );
}

