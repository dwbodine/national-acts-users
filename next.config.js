/** @type {import('next').NextConfig} */
const nextConfig = {
  // ---------------------------------------------
  // Core Next.js Settings
  // ---------------------------------------------
  reactStrictMode: true,
  swcMinify: true,

  // ensures correct handling of ESM / NodeNext
  experimental: {
    esmExternals: true,
    serverActions: {
      allowedOrigins: ['*'],
    },
  },

  // ---------------------------------------------
  // Output (for production / Docker deployments)
  // ---------------------------------------------
  output: 'standalone',

  // ---------------------------------------------
  // Images (recommended modern setup)
  // ---------------------------------------------
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ---------------------------------------------
  // TypeScript Behavior
  // ---------------------------------------------
  typescript: {
    // Don’t block builds on type errors
    ignoreBuildErrors: false,
  },

  // ---------------------------------------------
  // ESLint Behavior
  // ---------------------------------------------
  eslint: {
    // Allow builds to continue even with lint issues (optional)
    ignoreDuringBuilds: false,
  },

  // ---------------------------------------------
  // App Router optimizations
  // ---------------------------------------------
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    styledComponents: true,
  },

  // ---------------------------------------------
  // Custom Webpack Configuration
  // ---------------------------------------------
  webpack: (config, { isServer }) => {
    // Fixes absolute imports @/*
    config.resolve.alias['@'] = require('path').resolve(__dirname, 'src');

    // Allow .mts/.cts in import resolution
    config.resolve.extensions.push('.mts', '.cts');

    // Optional: speed up server-side bundling
    if (isServer) {
      config.externals.push({
        sharp: 'commonjs sharp',
      });
    }

    return config;
  },
};

export default nextConfig;
