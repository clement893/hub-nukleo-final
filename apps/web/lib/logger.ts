/**
 * Centralized logging service
 * Handles error logging with proper error tracking in production
 */

type LogLevel = "error" | "warn" | "info" | "debug";

interface LogContext {
  [key: string]: unknown;
}

class Logger {
  private isProduction = process.env.NODE_ENV === "production";

  private log(level: LogLevel, message: string, error?: Error, context?: LogContext) {
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

    if (this.isProduction) {
      // In production, send to error tracking service (Sentry, LogRocket, etc.)
      // Example: Sentry.captureException(error, { extra: logData });
      // For now, we'll still log to console but could integrate Sentry later
      if (level === "error") {
        console.error(`[${level.toUpperCase()}] ${message}`, logData);
      } else {
        console.log(`[${level.toUpperCase()}] ${message}`, logData);
      }
    } else {
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
    }
  }

  error(message: string, error?: Error, context?: LogContext) {
    this.log("error", message, error, context);
  }

  warn(message: string, context?: LogContext) {
    this.log("warn", message, undefined, context);
  }

  info(message: string, context?: LogContext) {
    this.log("info", message, undefined, context);
  }

  debug(message: string, context?: LogContext) {
    this.log("debug", message, undefined, context);
  }
}

export const logger = new Logger();

