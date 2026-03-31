export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999';

const request = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  // Prepend base URL if url is relative (doesn't start with http/https)
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
  const response = await fetch(fullUrl, { ...options, headers });
  
  // Spring Boot backend returns ApiResponse: { code, message, data }
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.message || 'Có lỗi xác ra, vui lòng thử lại.');
  }
  
  // Return the actual data payload if it exists
  return result;
};

export const api = {
  get: (url: string) => request(url),
  post: (url: string, body: any) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url: string, body: any) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  patch: (url: string, body: any) => request(url, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (url: string) => request(url, { method: 'DELETE' })
};
