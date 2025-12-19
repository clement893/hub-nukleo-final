import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
};

export default nextConfig;

