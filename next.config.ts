import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors 'self' https://ownerofjk.com https://www.ownerofjk.com http://localhost:3000",
          },
        ],
      },
    ];
  },
};

export default nextConfig;