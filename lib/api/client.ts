import { tokenStorage } from '@/lib/auth/tokenStorage';

export type FieldErrors = Record<string, string[]>;

export type ApiError = {
  status: number;
  message: string;
  errors?: FieldErrors;
};

function joinUrl(baseUrl: string, endpoint: string) {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${normalizedBase}${normalizedEndpoint}`;
}

function getApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1/api/client';
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  skipAuth?: boolean;
  token?: string | null;
};

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const url = joinUrl(getApiBaseUrl(), endpoint);

  const headers = new Headers(options.headers);
  if (!headers.has('Accept')) headers.set('Accept', 'application/json');
  if (options.body !== undefined && !headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (!options.skipAuth) {
    // Use provided token or retrieve from storage
    const token = options.token !== undefined ? options.token : tokenStorage.getToken();
    if (token) headers.set('Authorization', `Bearer ${token}`);
  }

  const body = options.body instanceof FormData
    ? options.body
    : (options.body === undefined ? undefined : JSON.stringify(options.body));

  const response = await fetch(url, {
    ...options,
    headers,
    body,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');

  const payload = isJson ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload && typeof (payload as any).message === 'string'
        ? (payload as any).message
        : response.statusText || 'Request failed';

    const errors =
      typeof payload === 'object' && payload && 'errors' in payload && typeof (payload as any).errors === 'object'
        ? ((payload as any).errors as FieldErrors)
        : undefined;

    const err: ApiError = { status: response.status, message, errors };
    throw err;
  }

  return payload as T;
}

export function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    typeof (error as any).status === 'number' &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}
