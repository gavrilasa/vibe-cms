/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export', // Dihapus atau dikomentari
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;