import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Genera una carpeta /out que puede alojarse en cualquier hosting estático.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
