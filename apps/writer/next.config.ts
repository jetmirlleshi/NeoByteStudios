import type { NextConfig } from "next";
import { resolve } from "path";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  transpilePackages: [
    "@neobytestudios/db",
    "@neobytestudios/auth",
    "@neobytestudios/ui",
  ],
  turbopack: {
    root: resolve(__dirname, "../.."),
  },

  // Performance: ottimizza il tree-shaking per librerie pesanti
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@tiptap/react",
      "@tiptap/starter-kit",
    ],
  },

  // Header di sicurezza applicati a tutte le route
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // Ottimizzazione immagini remote
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.r2.cloudflarestorage.com" },
    ],
  },
};

export default nextConfig;
