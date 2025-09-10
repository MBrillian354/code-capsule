import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Reduce bundle size by optimizing package imports for MUI
    optimizePackageImports: [
      "@mui/material",
      "@mui/icons-material",
    ],
  },
};

export default nextConfig;
