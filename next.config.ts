import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com", // 👈 للسماح بصور بروفايل GitHub
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com", // 👈 للسماح بصور بروفايل Google
      },
      {
        protocol: "https",
        hostname: "images.pexels.com", // 👈 للسماح بصور Pexels
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  }
};

export default nextConfig;
