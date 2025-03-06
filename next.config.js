module.exports = {
  experimental: {
    serverActions: {}, // Using an object enables server actions
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
