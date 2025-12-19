/**
 * Sentry server-side configuration
 * This file configures Sentry for server-side error tracking
 */

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  
  // Filter out sensitive data
  beforeSend(event, _hint) {
    // Don't send events in development unless explicitly enabled
    if (process.env.NODE_ENV === "development" && !process.env.SENTRY_ENABLE_DEV) {
      return null;
    }
    
    // Remove sensitive data from event
    if (event.request) {
      // Remove cookies and headers that might contain sensitive info
      if (event.request.cookies) {
        delete event.request.cookies;
      }
      if (event.request.headers) {
        // Keep only safe headers
        const safeHeaders = ["user-agent", "accept", "accept-language"];
        event.request.headers = Object.fromEntries(
          Object.entries(event.request.headers).filter(([key]) =>
            safeHeaders.includes(key.toLowerCase())
          )
        );
      }
    }
    
    return event;
  },
});

