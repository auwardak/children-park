// next.config.js
module.exports = {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback = {
          fs: false,
          path: false,
          util: false
        }
      }
      return config
    }
  }