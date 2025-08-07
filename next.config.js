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
  // Using pages directory for this POC
}

module.exports = nextConfig 