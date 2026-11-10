import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuración de orígenes de imágenes permitidos para next/image
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co', // Imágenes subidas al bucket de Supabase
      },
    ],
  },
};

export default nextConfig;
