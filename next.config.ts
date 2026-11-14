import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,
  images: {
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // 7 days cache
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ]
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      '@radix-ui/react-icons',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-label',
      '@radix-ui/react-select'
    ]
  }
};

export default nextConfig;
