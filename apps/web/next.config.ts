import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  outputFileTracingRoot: path.join(__dirname, "../../"),
};

export default nextConfig;

