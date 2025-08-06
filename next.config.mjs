/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ["@prisma/client"],

  images: {
    domains: ["localhost", "stitchit.test"],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
