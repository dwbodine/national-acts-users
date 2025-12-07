/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { unoptimized: true },
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: false,
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
