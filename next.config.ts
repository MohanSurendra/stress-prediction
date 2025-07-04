/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // if you're using `next export`
  images: {
    unoptimized: true, // <-- disable automatic image optimization
  },
};

export default nextConfig;
