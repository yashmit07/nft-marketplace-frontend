/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      net: false,
      tls: false
    };
    return config;
  },
  // Add transpilePackages for compatibility
  transpilePackages: ['@rainbow-me/rainbowkit'],
};

module.exports = nextConfig; 