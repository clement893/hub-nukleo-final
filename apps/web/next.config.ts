import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@nukleo/ui", "@nukleo/db", "@nukleo/commercial"],
  // Ensure Next.js listens on all interfaces and respects PORT env var
  serverOptions: {
    port: parseInt(process.env.PORT || "3000", 10),
    hostname: "0.0.0.0",
  },
};

export default nextConfig;

