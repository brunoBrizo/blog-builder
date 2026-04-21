'use client';

import { fontMono, fontSans } from './fonts';

import './global.css';

/**
 * Root error boundary (Next.js). Must be a Client Component and include
 * `<html>` / `<body>` because it replaces the root layout on catastrophic
 * failures. It runs *outside* the `[locale]` segment and therefore cannot use
 * `next-intl`; copy is kept intentionally short, neutral and English-only.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${fontSans.variable} ${fontMono.variable}`.trim()}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground antialiased">
        <main
          id="main"
          className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-4 px-6 py-16"
        >
          <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            500
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Something went wrong
          </h1>
          <p className="text-base text-muted-foreground">
            An unexpected error occurred. Please try again.
          </p>
          {error.digest ? (
            <p className="text-xs text-muted-foreground">
              Reference:{' '}
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                {error.digest}
              </code>
            </p>
          ) : null}
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Try again
            </button>
            <a
              href="/"
              className="inline-flex h-10 items-center rounded-md border border-border bg-surface-elevated px-4 text-sm font-medium text-foreground hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Go home
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
