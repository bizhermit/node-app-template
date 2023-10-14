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
    trailingSlash: true,
  } : {}),
  ...(mode === "renderer" ? {
    output: "export",
    distDir: ".renderer",
  } : {}),
  webpack(config) {
    config.resolve.alias['#'] = path.join(__dirname, 'foundations');
    config.resolve.alias['$'] = path.join(__dirname, 'features');
    config.resolve.alias['~'] = path.join(__dirname, 'pages');
    config.resolve.alias['@'] = path.join(__dirname, 'app');
    return config;
  },
}

module.exports = nextConfig
