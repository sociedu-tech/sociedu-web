/**
 * Role chính từ API / JWT (luôn so khớp dạng lowercase).
 * `USER` khớp field `buyer` trong domain User — học viên / người dùng thường.
 */
export const ROLES = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  /** Học viên (API thường trả `buyer`) */
  USER: 'user',
  /** Chưa đăng nhập hoặc không có role */
  GUEST: 'guest',
} as const;

export type AppRole = (typeof ROLES)[keyof typeof ROLES];

export function normalizeRole(role: string | undefined | null): string {
  return (role ?? '').toLowerCase();
}

export function hasRole(userRole: string, ...allowed: string[]): boolean {
  const r = normalizeRole(userRole);
  return allowed.some((a) => normalizeRole(a) === r);
}
