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
  'http://localhost:9999';

type ApiEnvelope<T = unknown> = {
  code?: number;
  message?: string;
  data?: T;
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

  const result: ApiEnvelope = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Có lỗi xác ra, vui lòng thử lại.');
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
  const result: ApiEnvelope = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Upload thất bại.');
  }
  return result;
}
