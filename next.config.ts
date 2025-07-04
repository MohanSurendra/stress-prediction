/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true, // Required for static export on Render
  },
};

module.exports = nextConfig;
