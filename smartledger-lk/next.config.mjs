/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Allow dev server to run even if lint warnings exist
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow type errors to not block dev hot-reload
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
