import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // output: "standalone", // Disabled to allow next start to work properly
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "**.googleapis.com",
      },
    ],
  },

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Experimental features
  experimental: {
    optimizePackageImports: ["@nukleo/ui", "@nukleo/db"],
  },
  
  // Turbopack configuration (empty to allow Sentry webpack config)
  // Sentry doesn't fully support Turbopack yet, so we use webpack for builds
  turbopack: {},
};

// Conditionally wrap with Sentry only if DSN is provided
// This allows builds to work without Sentry configured
const configWithBundleAnalyzer = withBundleAnalyzer(nextConfig);

// Only wrap with Sentry if DSN is configured
const finalConfig = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(configWithBundleAnalyzer, {
      // For all available options, see:
      // https://github.com/getsentry/sentry-webpack-plugin#options

      // Suppresses source map uploading logs during build
      silent: true,
      
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      
      // Only upload source maps in production
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    })
  : configWithBundleAnalyzer;

export default finalConfig;
