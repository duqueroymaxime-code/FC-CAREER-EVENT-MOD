/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['vercel.app'], // Si tu utilises des images externes
  },
  // Pour éviter les problèmes avec localStorage en SSR
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;