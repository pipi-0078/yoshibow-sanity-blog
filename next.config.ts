import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["cdn.sanity.io"],
    formats: ["image/webp", "image/avif"],
  },
  experimental: {
    optimizePackageImports: ["@sanity/image-url"],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
