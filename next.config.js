const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,  // PERFORMANCE FIX: Re-enable to catch issues
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Image optimization - PERFORMANCE FIX: Enable for better performance
  images: {
    unoptimized: false,  // Enable Next.js image optimization
    formats: ['image/avif', 'image/webp'],  // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,  // Cache optimized images for 60 seconds
  },
  
  // Logging configuration
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  
  // Experimental features for better performance
  experimental: {
    // Server actions configuration
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  
  // Optimize for production
  productionBrowserSourceMaps: false,
  
  // Webpack configuration for better builds
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
