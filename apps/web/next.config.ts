import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  // output: "standalone", // Disabled to allow next start to work properly
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  
  // Webpack configuration for production builds
  // Turbopack is disabled for production builds via --webpack flag to avoid Windows symlink issues
  webpack: (config, { isServer, dev }) => {
    // Webpack configuration
    return config;
  },
  
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
      {
        protocol: "https",
        hostname: "**.s3.*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "**.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.*.amazonaws.com",
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
};

// Conditionally wrap with Sentry only if explicitly enabled and DSN is provided
// Sentry doesn't fully support Next.js 16/Turbopack yet, so we disable it during build
// It will still work at runtime via instrumentation.ts
const configWithBundleAnalyzer = withBundleAnalyzer(nextConfig);

// Only wrap with Sentry if explicitly enabled via env var
// This prevents build conflicts with Turbopack
let finalConfig = configWithBundleAnalyzer;

if (process.env.ENABLE_SENTRY_BUILD === "true" && (process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN)) {
  try {
    const { withSentryConfig } = require("@sentry/nextjs");
    finalConfig = withSentryConfig(configWithBundleAnalyzer, {
      silent: true,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
      automaticVercelMonitors: true,
    });
  } catch (error) {
    // Sentry not available, continue without it
    console.warn("Sentry build integration skipped:", error);
  }
}

export default finalConfig;
