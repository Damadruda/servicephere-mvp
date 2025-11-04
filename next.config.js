const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  
  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Image optimization
  images: { 
    unoptimized: true 
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
