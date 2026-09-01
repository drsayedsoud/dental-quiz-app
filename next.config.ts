import type { NextConfig } from "next";

const nextConfig: NextConfig = {\n  eslint: {\n    ignoreDuringBuilds: true,\n  },\n  typescript: {\n    ignoreBuildErrors: true,\n  },
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
