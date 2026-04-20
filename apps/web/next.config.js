//@ts-check

const { composePlugins, withNx } = require('@nx/next');
const path = require('path');

/**
 * @type {import('@nx/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
  nx: {},
  reactStrictMode: true,
  poweredByHeader: false,
  reactCompiler: true,
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
