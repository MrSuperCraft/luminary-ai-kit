import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qk59rzzn0mwwxp1v.public.blob.vercel-storage.com"
      }
    ]
  }
};

export default nextConfig;
