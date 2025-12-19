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

// Wrap with Sentry configuration
const configWithSentry = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  {
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
  }
);

export default configWithSentry;
