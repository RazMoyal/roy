import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets phones on the home network (http://192.168.x.x:3000) load the dev
  // server's scripts; without it the page shows but nothing is clickable.
  allowedDevOrigins: ["192.168.*.*"],
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
