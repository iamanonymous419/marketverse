/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/detq2bzhh/**', // Match your Cloudinary URL pattern
      },
    ],
  },
  reactStrictMode: true,
  eslint: {
    // Warning: This disables ESLint during builds in production!
    // ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
