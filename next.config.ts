import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|flac)$/i,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
