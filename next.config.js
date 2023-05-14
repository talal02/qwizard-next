/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://qwizard-front.vercel.app/',
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
