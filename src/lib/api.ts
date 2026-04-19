/**
 * HTTP client for Spring Boot `ApiResponse`: { code, message, data }.
 * Uses Bearer token from localStorage (client-only).
 */

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  // Fallback to localStorage if cookie is somehow missing but local storage is there
  const matches = document.cookie.match(new RegExp('(^| )access_token=([^;]+)'));
  return matches ? decodeURIComponent(matches[2]) : localStorage.getItem('token');
};

export const setAuthToken = (token: string) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('token', token);
  document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; samesite=lax`;
};

export const removeAuthToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
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

import { authService, getRefreshToken } from '@/services/authService';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

const request = async (url: string, options: RequestInit = {}): Promise<ApiEnvelope> => {
  let token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  let response = await fetch(fullUrl, { ...options, headers });
  
  if (response.status === 401) {
    const refreshTokenRecord = getRefreshToken();
    if (refreshTokenRecord) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const payload = await authService.refresh(refreshTokenRecord);
          token = payload.accessToken ?? '';
          setAuthToken(token);
          onRefreshed(token);
        } catch (error) {
          refreshSubscribers = [];
          authService.logout();
          throw new ApiClientError('Phiên đăng nhập hết hạn, vui lòng đăng nhập lại.', { status: 401 });
        } finally {
          isRefreshing = false;
        }
      } else {
        await new Promise<string>((resolve) => {
          subscribeTokenRefresh((newToken) => resolve(newToken));
        });
        token = getAuthToken();
      }

      // Retry request with new token
      const newHeaders = new Headers(options.headers || {});
      if (token) {
        newHeaders.set('Authorization', `Bearer ${token}`);
      }
      if (!newHeaders.has('Content-Type') && !(options.body instanceof FormData)) {
        newHeaders.set('Content-Type', 'application/json');
      }
      response = await fetch(fullUrl, { ...options, headers: newHeaders });
    }
  }

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
