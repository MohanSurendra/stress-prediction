/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // optional: if you get image optimization errors
  },
  // ❌ Do NOT use `output: 'export'` here
};

export default nextConfig;
