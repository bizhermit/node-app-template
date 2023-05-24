const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias['@'] = path.join(__dirname, 'src');
    config.resolve.alias['$'] = path.join(__dirname, 'src/styles');
    return config;
  },
}

module.exports = nextConfig
