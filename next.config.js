/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: process.env.NODE_ENV === 'production' ? '/aigirltrainerchatbot' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/aigirltrainerchatbot/' : '',
  trailingSlash: true,
}

module.exports = nextConfig