'use client';

/**
 * Root error boundary (Next.js). Must be a Client Component and include
 * `<html>` / `<body>` because it replaces the root layout for this route.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body data-error-digest={error.digest ?? ''}>
        <h2>Something went wrong</h2>
        <button type="button" onClick={() => reset()}>
          Try again
        </button>
      </body>
    </html>
  );
}
