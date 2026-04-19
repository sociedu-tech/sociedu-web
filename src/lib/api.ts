/**
 * HTTP client for Spring Boot `ApiResponse`: { code, message, data }.
 * Uses Bearer token from localStorage (client-only).
 */

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

export const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
};

export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  'http://localhost:9992';

export type ApiEnvelope<T = unknown> = {
  code?: number;
  isSuccess?: boolean;
  message?: string;
  data?: T;
  errors?: {
    type?: string;
    fields?: Record<string, string>;
    details?: string;
  };
};

export class ApiClientError extends Error {
  status: number;
  code?: number;
  errorType?: string;
  fieldErrors?: Record<string, string>;
  details?: string;

  constructor(
    message: string,
    options: {
      status: number;
      code?: number;
      errorType?: string;
      fieldErrors?: Record<string, string>;
      details?: string;
    },
  ) {
    super(message);
    this.name = 'ApiClientError';
    this.status = options.status;
    this.code = options.code;
    this.errorType = options.errorType;
    this.fieldErrors = options.fieldErrors;
    this.details = options.details;
  }
}

export const isApiClientError = (error: unknown): error is ApiClientError =>
  error instanceof ApiClientError;

const DEFAULT_ERROR_MESSAGE = 'Có lỗi xảy ra, vui lòng thử lại.';

const parseApiEnvelope = async (response: Response): Promise<ApiEnvelope> => {
  const rawText = await response.text();
  if (!rawText) {
    return {};
  }

  try {
    return JSON.parse(rawText) as ApiEnvelope;
  } catch {
    return { message: rawText };
  }
};

const request = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, { ...options, headers });
  const result = await parseApiEnvelope(response);

  if (!response.ok) {
    throw new ApiClientError(result.message || DEFAULT_ERROR_MESSAGE, {
      status: response.status,
      code: result.code,
      errorType: result.errors?.type,
      fieldErrors: result.errors?.fields,
      details: result.errors?.details,
    });
  }

  return result;
};

export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: unknown) =>
    request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body: unknown) =>
    request(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url: string, body: unknown) =>
    request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: 'DELETE' }),
};

/** multipart/form-data (no JSON Content-Type) */
export async function postMultipart(url: string, formData: FormData) {
  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, { method: 'POST', body: formData, headers });
  const result = await parseApiEnvelope(response);
  if (!response.ok) {
    throw new ApiClientError(result.message || 'Upload thất bại.', {
      status: response.status,
      code: result.code,
      errorType: result.errors?.type,
      fieldErrors: result.errors?.fields,
      details: result.errors?.details,
    });
  }
  return result;
}
