/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    unoptimized: true,
  },
  experimental: {
    forceSwcTransforms: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
