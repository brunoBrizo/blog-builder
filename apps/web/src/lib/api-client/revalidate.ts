import 'server-only';

import { revalidatePath } from 'next/cache';

import { ApiError, parseApiErrorBody } from './api-error';

const ALLOWED_PREFIXES = ['/blog/', '/draft/'] as const;

function assertAllowedPath(path: string): void {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  const ok = ALLOWED_PREFIXES.some((p) => normalized.startsWith(p));
  if (!ok) {
    throw new Error(
      `path must start with one of: ${ALLOWED_PREFIXES.join(', ')}`,
    );
  }
}

function apiBaseUrl(): string {
  const base = process.env['NEXT_PUBLIC_API_BASE_URL'];
  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set (e.g. http://localhost:3001/api)',
    );
  }
  return base.replace(/\/$/, '');
}

/**
 * Authorizes revalidation with the Nest API, then refreshes the Next.js cache
 * for `path`. Server-only; do not import from client components.
 */
export async function revalidateOnServer(path: string): Promise<void> {
  assertAllowedPath(path);

  const secret = process.env['REVALIDATE_SHARED_SECRET'];
  if (!secret) {
    throw new Error('REVALIDATE_SHARED_SECRET is not set on the server');
  }

  const url = `${apiBaseUrl()}/revalidate`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-revalidate-secret': secret,
    },
    body: JSON.stringify({ path }),
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

  await revalidatePath(path);
}
