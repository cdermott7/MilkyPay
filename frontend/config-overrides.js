const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "util": require.resolve("util"),
    "process": require.resolve("process/browser")
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    ...fallback
  };

  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process'
    })
  ];

  return config;
};