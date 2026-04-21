/**
 * Public site origin for canonical URLs and JSON-LD.
 */
export function getSiteUrl(): string {
  const fromEnv = process.env['NEXT_PUBLIC_SITE_URL'];
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  const vercel = process.env['VERCEL_URL'];
  if (vercel && vercel.length > 0) {
    return `https://${vercel.replace(/\/$/, '')}`;
  }
  return 'http://localhost:3000';
}
