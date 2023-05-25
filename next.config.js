const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias['~'] = path.join(__dirname, 'src');
    config.resolve.alias['#'] = path.join(__dirname, "src/foundations")
    config.resolve.alias['$'] = path.join(__dirname, 'src/foundations/styles');
    config.resolve.alias['@'] = path.join(__dirname, 'src/features');
    return config;
  },
}

module.exports = nextConfig
