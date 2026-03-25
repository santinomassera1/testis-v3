/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "assets.aceternity.com" }],
  },

  // Optimizaciones para CSS y recursos
  experimental: {
    optimizePackageImports: ['@tabler/icons-react', 'framer-motion'],
  },

  // Configuración para optimizar la carga de recursos
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
