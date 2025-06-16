import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias["@rc-component/util"] = path.resolve("node_modules/rc-util");
    return config;
  },
};

export default nextConfig;