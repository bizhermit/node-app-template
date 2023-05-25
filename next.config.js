const path = require('path');

const mode = process.env.NEXT_OUTPUT;
process.stdout.write(`NEXT_OUTPUT: ${mode}\n\n`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  ...(mode === "dist" ? {
    output: "export",
    distDir: "dist/out",
  } : {}),
  ...(mode === "renderer" ? {
    output: "export",
    distDir: ".renderer",
  } : {}),
  experimental: {
    appDir: true,
  },
  webpack(config) {
    config.resolve.alias['$'] = path.join(__dirname, 'src/foundations/styles');
    config.resolve.alias['#'] = path.join(__dirname, "src/foundations")
    config.resolve.alias['@'] = path.join(__dirname, 'src/features');
    config.resolve.alias['~'] = path.join(__dirname, 'src/app');
    return config;
  },
}

module.exports = nextConfig
