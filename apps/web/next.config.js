//@ts-check

/**
 * Next prerender can fail with `useContext` on null when NODE_ENV is not `production`
 * (e.g. a shell preset `NODE_ENV=test`). The Nx executor uses `NODE_ENV ||= 'production'`
 * and does not override an existing non-production value.
 */
if (process.argv.includes('build')) {
  Reflect.set(process.env, 'NODE_ENV', 'production');
}

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
  /** Monorepo root for `next dev` / Turbopack. Production build uses webpack (see `web` project `webpack: true`). */
  turbopack: {
    root: path.join(__dirname, '..', '..'),
  },
};

const plugins = [withNx];

module.exports = composePlugins(...plugins)(nextConfig);
