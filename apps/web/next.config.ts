import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  /* config options here */
};

export default nextConfig;

