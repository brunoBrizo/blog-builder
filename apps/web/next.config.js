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
const createNextIntlPlugin = require('next-intl/plugin');
const path = require('path');

/** Relative path required for next-intl with Turbopack (no absolute paths). */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

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
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'placeholder.invalid',
      },
    ],
  },
};

module.exports = composePlugins(withNx, withNextIntl)(nextConfig);
