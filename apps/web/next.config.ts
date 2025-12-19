import type { NextConfig } from "next";

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
  
  // Server configuration
  serverRuntimeConfig: {
    // Allow Railway to set PORT dynamically
  },
};

export default withBundleAnalyzer(nextConfig);
