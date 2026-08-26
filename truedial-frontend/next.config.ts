import type { NextConfig } from "next";

// Target VPS Backend URL (default: https://findmyinterior.com)
const VPS_BACKEND = process.env.VPS_BACKEND_URL || "https://findmyinterior.com";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // For requests that already include /api/v1 after /api-proxy
        source: "/api-proxy/api/v1/:path*",
        destination: `${VPS_BACKEND}/api/v1/:path*`,
      },
      {
        // For requests that use /api-proxy directly
        source: "/api-proxy/:path*",
        destination: `${VPS_BACKEND}/api/v1/:path*`,
      },
      {
        // For image and storage asset proxies
        source: "/storage/:path*",
        destination: `${VPS_BACKEND}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
