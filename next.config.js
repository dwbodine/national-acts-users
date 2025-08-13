/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  images: { unoptimized: true },
  output: 'standalone',
  reactStrictMode: true,
  trailingSlash: true,
};

module.exports = nextConfig;
