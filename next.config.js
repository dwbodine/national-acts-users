/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { unoptimized: true },
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
