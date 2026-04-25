import 'server-only';

import { revalidatePathAllowed } from '@blog-builder/shared-types';

import { ApiError, parseApiErrorBody } from './api-error';

function assertAllowedPath(path: string): void {
  if (!revalidatePathAllowed(path)) {
    throw new Error(
      'path must match blog/draft patterns (locale-prefixed or legacy /blog/, /draft/)',
    );
  }
}

/** Same-origin web base (no path) for POST /api/revalidate. */
function webOrigin(): string {
  const vercel = process.env['VERCEL_URL'];
  if (vercel && vercel.length > 0) {
    return `https://${vercel.replace(/\/$/, '')}`;
  }
  const site = process.env['NEXT_PUBLIC_SITE_URL'];
  if (site && site.length > 0) {
    return site.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

/**
 * Authorizes with shared secret and triggers ISR via this app’s
 * `POST /api/revalidate` route (server-only).
 */
export async function revalidateOnServer(path: string): Promise<void> {
  assertAllowedPath(path);

  const secret = process.env['REVALIDATE_SHARED_SECRET'];
  if (!secret) {
    throw new Error('REVALIDATE_SHARED_SECRET is not set on the server');
  }

  const url = `${webOrigin()}/api/revalidate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': secret,
    },
    body: JSON.stringify({ paths: [path] }),
  });

  const contentType = res.headers.get('content-type') ?? '';
  const parsed = contentType.includes('application/json')
    ? await res.json().catch(() => null)
    : await res.text();

  if (!res.ok) {
    if (typeof parsed === 'object' && parsed !== null) {
      const { message, code } = parseApiErrorBody(parsed, res.statusText);
      throw new ApiError(message, res.status, parsed, code);
    }
    throw new ApiError(String(parsed), res.status, parsed);
  }
}
