/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/login',
        permanent: false,
      },
    ]
  },
  images: {
    domains: [
      'lh3.googleusercontent.com',
    ]
  }
}

module.exports = nextConfig
