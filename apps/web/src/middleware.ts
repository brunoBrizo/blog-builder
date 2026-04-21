import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';

import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

const localeSet = new Set<string>(routing.locales);

function stripLocalePrefix(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (first && localeSet.has(first)) {
    const rest = segments.slice(1).join('/');
    return rest ? `/${rest}` : '/';
  }
  return pathname === ''
    ? '/'
    : pathname.startsWith('/')
      ? pathname
      : `/${pathname}`;
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const canonicalPath = stripLocalePrefix(pathname);

  // Propagate the locale-stripped path as a request header so Server Components
  // (via `headers()` in `next/headers`) can build canonical URLs without having
  // to reconstruct locale logic. Must be a request header – response headers
  // set here are not visible to RSC `headers()`.
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', canonicalPath);

  const response = intlMiddleware(request);

  // If next-intl rewrote/redirected, we still want downstream to see the
  // header. Wrap the rewrite URL via NextResponse.next when no
  // redirect/rewrite was issued. When it is a redirect we just forward.
  if (
    response.headers.get('location') ||
    response.headers.get('x-middleware-rewrite')
  ) {
    // Mirror the header on the outgoing response for visibility.
    response.headers.set('x-pathname', canonicalPath);
    return response;
  }

  // For plain `next()` responses, rebuild with the enriched request headers
  // so Server Components can read them.
  const forwarded = NextResponse.next({ request: { headers: requestHeaders } });
  // Copy any cookies / headers next-intl set on the original response.
  response.headers.forEach((value, key) => {
    if (key === 'content-type') return;
    forwarded.headers.set(key, value);
  });
  forwarded.headers.set('x-pathname', canonicalPath);
  return forwarded;
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
