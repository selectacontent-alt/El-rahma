import type { NextConfig } from "next";

const nextConfig = {
  allowedDevOrigins: [
    "localhost:3000",
    "localhost",
    "192.168.1.63:3000",
    "192.168.1.63",
    "*.192.168.1.63",
    "192.168.1.27:3333",
    "192.168.1.27",
    "*.192.168.1.27"
  ],
} as any;

export default nextConfig;
