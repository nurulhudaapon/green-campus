import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      {
        hostname: "studentportal.green.edu.bd",
      },
    ],
  },
};

export default nextConfig;
