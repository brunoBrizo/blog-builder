import { ApiError, parseApiErrorBody } from './api-error';

function getBaseUrl(): string {
  const base = process.env['NEXT_PUBLIC_API_BASE_URL'];
  if (!base) {
    throw new Error(
      'NEXT_PUBLIC_API_BASE_URL is not set (e.g. http://localhost:3001/api)',
    );
  }
  return base.replace(/\/$/, '');
}

export type ApiFetchOptions = Omit<RequestInit, 'body'> & {
  /** Path under the API base URL, e.g. `health` or `revalidate`. */
  path: string;
  body?: BodyInit | null;
};

export async function apiFetch<T = unknown>(
  options: ApiFetchOptions,
): Promise<T> {
  const { path, headers, body, ...rest } = options;
  const url = `${getBaseUrl()}/${path.replace(/^\//, '')}`;
  const init: RequestInit = {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };
  if (body !== undefined) {
    init.body = body;
  }
  const res = await fetch(url, init);

  const contentType = res.headers.get('content-type') ?? '';
  const isJson = contentType.includes('application/json');
  const parsed = isJson ? await res.json().catch(() => null) : await res.text();

  if (!res.ok) {
    if (typeof parsed === 'object' && parsed !== null) {
      const { message, code } = parseApiErrorBody(parsed, res.statusText);
      throw new ApiError(message, res.status, parsed, code);
    }
    throw new ApiError(res.statusText, res.status, parsed);
  }

  return parsed as T;
}
