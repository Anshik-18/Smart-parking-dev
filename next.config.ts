import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ This disables ESLint during build
  },
  /* other config options here if you have them */
};

export default nextConfig;
