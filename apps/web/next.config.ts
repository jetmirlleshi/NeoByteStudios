import type { NextConfig } from "next";
import path from "path";

// import.meta.dirname è ESM-native (Node.js 21+) e funziona correttamente
// in next.config.ts (ES module). __dirname non è disponibile in ESM.
const appDir = import.meta.dirname;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
    ],
  },
  env: {
    BLOG_CONTENT_DIR: path.join(appDir, "content", "blog"),
  },
  experimental: {
    optimizePackageImports: ["framer-motion"],
  },
  turbopack: {
    root: path.join(appDir, "../.."),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
