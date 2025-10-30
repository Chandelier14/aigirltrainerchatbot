/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports
  images: {
    unoptimized: true, // Required for static export
  },
  // Ensure your static site can be deployed to any static hosting
  trailingSlash: true,
}

module.exports = nextConfig