import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  transpilePackages: [
    "@daracademy/ui",
    "@daracademy/animations",
    "@daracademy/noah-engine",
    "@daracademy/analytics",
  ],
  outputFileTracingRoot: path.join(__dirname, "../../"),
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default config;
