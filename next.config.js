/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['shop.axelerators.ai', 'localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shop.axelerators.ai',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/**',
      },
    ],
  },
  // App Router is now enabled by default in Next.js 14
}

module.exports = nextConfig 