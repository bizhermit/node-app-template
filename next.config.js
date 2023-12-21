const path = require('path');

const mode = process.env.NEXT_OUTPUT;
process.stdout.write(`NEXT_OUTPUT: ${mode}\n\n`);

const srcDir = path.join(__dirname, "src");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  typescript: {
    tsconfigPath: "./src/tsconfig.json",
  },
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
    config.resolve.alias['#'] = path.join(srcDir, 'foundations');
    config.resolve.alias['$'] = path.join(srcDir, 'features');
    config.resolve.alias['@'] = path.join(srcDir, 'app');
    return config;
  },
}

module.exports = nextConfig
