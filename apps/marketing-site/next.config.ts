import type { NextConfig } from "next";

const config: NextConfig = {
  transpilePackages: [
    '@daracademy/ui',
    '@daracademy/animations',
    '@daracademy/noah-engine',
    '@daracademy/analytics',
  ],
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
  },
};

export default config;
