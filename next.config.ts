import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Temporarily disabled to prevent double mount in dev mode
  async rewrites() {
    return [
      {
        source: "/api/ask",
        destination: "http://localhost:3001/ask",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/api/ask",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "POST, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
