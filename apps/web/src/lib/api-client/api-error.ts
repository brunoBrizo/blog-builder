export class ApiError extends Error {
  readonly statusCode: number;
  readonly body: unknown;
  readonly code?: string;

  constructor(
    message: string,
    statusCode: number,
    body?: unknown,
    code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.body = body;
    if (code !== undefined) {
      this.code = code;
    }
  }
}

/** Parses Nest `HttpExceptionFilter` JSON error bodies. */
export function parseApiErrorBody(
  parsed: unknown,
  statusText: string,
): { message: string; code?: string } {
  if (typeof parsed === 'object' && parsed !== null && 'error' in parsed) {
    const err = (parsed as { error?: { message?: unknown; code?: unknown } })
      .error;
    if (err && typeof err === 'object') {
      const m = err.message;
      const message =
        typeof m === 'string'
          ? m
          : Array.isArray(m)
            ? m.join(', ')
            : statusText;
      const out: { message: string; code?: string } = { message };
      if (typeof err.code === 'string') {
        out.code = err.code;
      }
      return out;
    }
  }
  return { message: statusText };
}
