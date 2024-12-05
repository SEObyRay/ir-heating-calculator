/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Remove basePath for clean URLs
  // basePath: '/ir-heating-calculator-github'
}

module.exports = nextConfig
