/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.vercel.app' },
    ],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
