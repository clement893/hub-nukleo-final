import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  experimental: {
    serverComponentsExternalPackages: ["@nukleo/ui"],
  },
  /* config options here */
};

export default nextConfig;

