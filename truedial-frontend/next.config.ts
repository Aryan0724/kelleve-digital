import type { NextConfig } from "next";

// Target VPS Backend URL (default: http://187.127.164.142:8000)
const VPS_BACKEND = process.env.VPS_BACKEND_URL || "http://187.127.164.142:8000";

const nextConfig: NextConfig = {
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
