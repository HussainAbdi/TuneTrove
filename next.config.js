/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8888/:path*"
      }
    ]
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: true,
      },
    ]
  },
  compiler: {
    styledComponents: {
      displayName: true,
      ssr: true
    }
  },
  reactStrictMode: false
}

module.exports = nextConfig;
