import type { NextConfig } from "next";
import path from "path";

const config: NextConfig = {
  transpilePackages: [
    "@daracademy/ui",
    "@daracademy/animations",
    "@daracademy/noah-engine",
    "@daracademy/analytics",
  ],
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
    outputFileTracingRoot: path.join(__dirname, "../../"),
  },
};

export default config;
