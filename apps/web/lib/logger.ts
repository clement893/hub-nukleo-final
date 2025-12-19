/**
 * Centralized logging service
 * 
 * Handles error logging with proper error tracking in production using Sentry.
 * Provides a unified interface for logging across the application with different log levels.
 * 
 * @example
 * ```typescript
 * import { logger } from "@/lib/logger";
 * 
 * // Log an error
 * logger.error("Failed to fetch user", error, { userId: "123" });
 * 
 * // Log a warning
 * logger.warn("Rate limit approaching", { requests: 95, limit: 100 });
 * 
 * // Log info
 * logger.info("User logged in", { userId: "123" });
 * 
 * // Log debug (only in development)
 * logger.debug("Processing request", { path: "/api/users" });
 * ```
 * 
 * @module logger
 */

import * as Sentry from "@sentry/nextjs";

/**
 * Log levels available in the logger
 */
type LogLevel = "error" | "warn" | "info" | "debug";

/**
 * Additional context data to include with log entries
 */
interface LogContext {
  [key: string]: unknown;
}

/**
 * Centralized Logger class
 * 
 * Provides structured logging with automatic error tracking in production.
 * In development, logs are formatted with emojis for better readability.
 * In production, errors are automatically sent to Sentry for tracking.
 */
class Logger {
  private readonly isProduction = process.env.NODE_ENV === "production";
  private readonly isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Internal logging method that handles all log levels
   * 
   * @param level - The log level (error, warn, info, debug)
   * @param message - The log message
   * @param error - Optional error object to log
   * @param context - Optional additional context data
   * @private
   */
  private log(level: LogLevel, message: string, error?: Error, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logData = {
      timestamp,
      level,
      message,
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
        },
      }),
      ...context,
    };

    // In production, send errors to Sentry
    if (this.isProduction && level === "error" && error) {
      Sentry.captureException(error, {
        level: "error",
        tags: {
          logLevel: level,
        },
        extra: {
          message,
          context,
          timestamp,
        },
      });
    }

    // Always log to console for immediate visibility
    if (this.isDevelopment) {
      // In development, use console with better formatting
      const emoji = {
        error: "❌",
        warn: "⚠️",
        info: "ℹ️",
        debug: "🔍",
      }[level];

      if (level === "error") {
        console.error(`${emoji} [${level.toUpperCase()}] ${message}`, error || logData);
      } else {
        console.log(`${emoji} [${level.toUpperCase()}] ${message}`, logData);
      }
    } else {
      // In production, use structured logging
      if (level === "error") {
        console.error(`[${level.toUpperCase()}] ${message}`, logData);
      } else {
        console.log(`[${level.toUpperCase()}] ${message}`, logData);
      }
    }
  }

  /**
   * Log an error
   * 
   * Errors are automatically sent to Sentry in production.
   * 
   * @param message - Error message describing what went wrong
   * @param error - Optional Error object
   * @param context - Optional additional context (e.g., userId, requestId)
   * 
   * @example
   * ```typescript
   * try {
   *   await fetchUser(userId);
   * } catch (error) {
   *   logger.error("Failed to fetch user", error, { userId });
   * }
   * ```
   */
  error(message: string, error?: Error, context?: LogContext): void {
    this.log("error", message, error, context);
  }

  /**
   * Log a warning
   * 
   * Use for situations that are not errors but should be noted.
   * 
   * @param message - Warning message
   * @param context - Optional additional context
   * 
   * @example
   * ```typescript
   * if (requests > 90) {
   *   logger.warn("Rate limit approaching", { requests, limit: 100 });
   * }
   * ```
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, undefined, context);
  }

  /**
   * Log informational messages
   * 
   * Use for general information about application flow.
   * 
   * @param message - Info message
   * @param context - Optional additional context
   * 
   * @example
   * ```typescript
   * logger.info("User logged in", { userId, timestamp });
   * ```
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, undefined, context);
  }

  /**
   * Log debug messages
   * 
   * Debug logs are primarily useful during development.
   * They provide detailed information about application state.
   * 
   * @param message - Debug message
   * @param context - Optional additional context
   * 
   * @example
   * ```typescript
   * logger.debug("Processing request", { path, method, headers });
   * ```
   */
  debug(message: string, context?: LogContext): void {
    this.log("debug", message, undefined, context);
  }
}

/**
 * Singleton logger instance
 * 
 * Use this instance throughout the application for consistent logging.
 * 
 * @example
 * ```typescript
 * import { logger } from "@/lib/logger";
 * logger.error("Something went wrong", error);
 * ```
 */
export const logger = new Logger();

