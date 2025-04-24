import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["fastly.picsum.photos"],
    remotePatterns: [new URL("https://fastly.picsum.photos/**")],
  },
};

export default nextConfig;
