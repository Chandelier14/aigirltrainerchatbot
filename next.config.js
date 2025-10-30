/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/aigirltrainerchatbot',
  assetPrefix: '/aigirltrainerchatbot/',
  trailingSlash: true,
}

module.exports = nextConfig