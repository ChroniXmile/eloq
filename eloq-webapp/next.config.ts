import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Enable experimental features if needed
  experimental: {
    // Enable Turbopack for faster builds
    turbo: {
      rules: {
        "*.svg": {
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
      },
    },
  },
  // Configure TypeScript
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Configure eslint
  eslint: {
    // Ignore eslint errors during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;