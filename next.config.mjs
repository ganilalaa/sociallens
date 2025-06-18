import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  eslint: {
    ignoreDuringBuilds: true, // ✅ S'ndalon build-in për lint errors
  },

  webpack: (config) => {
    config.resolve.alias["@rc-component/util"] = path.resolve("node_modules/rc-util");
    return config;
  },
};

export default nextConfig;