import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  experimental: {
    outputFileTracingRoot: require("path").join(__dirname, "../../"),
  },
};

export default nextConfig;

