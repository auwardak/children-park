// next.config.js
module.exports = {
  experimental: {
    serverActions: true, // ✅ Ensure this is enabled
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        path: false,
        util: false,
      };
    }
    return config;
  },
};
