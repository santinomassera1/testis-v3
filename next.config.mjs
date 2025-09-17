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
  
  // Headers para mejorar cache y preload
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
