const webpack = require('webpack');
const path = require('path');

module.exports = function override(config) {
  // Add fallbacks for Node.js core modules
  const fallback = {
    "crypto": require.resolve("crypto-browserify"),
    "stream": require.resolve("stream-browserify"),
    "buffer": require.resolve("buffer"),
    "http": require.resolve("stream-http"),
    "https": require.resolve("https-browserify"),
    "util": require.resolve("util"),
    "process": require.resolve("process/browser"),
    "path": require.resolve("path-browserify"),
    "os": require.resolve("os-browserify/browser"),
    "zlib": require.resolve("browserify-zlib"),
    "querystring": require.resolve("querystring-es3"),
    "url": require.resolve("url"),
    "assert": require.resolve("assert"),
    "fs": false,
    "net": false,
    "tls": false
  };

  config.resolve.fallback = {
    ...config.resolve.fallback,
    ...fallback
  };

  // Add providers for Buffer and process
  config.plugins = [
    ...config.plugins,
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process'
    })
  ];

  // Exclude server-specific modules and files from the frontend bundle
  config.module.rules.push({
    test: /\.(js|ts)$/,
    include: [
      // Node modules to exclude
      path.resolve(__dirname, 'node_modules/express'),
      path.resolve(__dirname, 'node_modules/body-parser'),
      path.resolve(__dirname, 'node_modules/twilio'),
      path.resolve(__dirname, 'node_modules/cors'),
      
      // Server-side files to exclude
      path.resolve(__dirname, 'src/index.ts'),
      path.resolve(__dirname, 'src/routes.ts'),
      path.resolve(__dirname, 'src/controllers')
    ],
    use: 'null-loader'
  });
  
  // Make sure index.tsx is the entry point, not index.ts
  const entries = Array.isArray(config.entry) ? config.entry : [config.entry];
  config.entry = entries.map(entry => {
    if (typeof entry === 'string' && entry.includes('index.ts')) {
      return entry.replace('index.ts', 'index.tsx');
    }
    return entry;
  });

  return config;
};