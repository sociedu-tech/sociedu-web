/** Route quản trị dưới `/dashboard` (nhóm `(admin)`). */
export const ADMIN_PATHS = {
  mentorRequests: '/dashboard/mentor-requests',
  users: '/dashboard/users',
  bookings: '/dashboard/bookings',
  moderation: '/dashboard/moderation',
} as const;

export const ADMIN_PAGE_TITLES: Record<string, string> = {
  '/dashboard/mentor-requests': 'Yêu cầu mentor',
  '/dashboard/users': 'Người dùng',
  '/dashboard/bookings': 'Đặt lịch',
  '/dashboard/moderation': 'Báo cáo & khiếu nại',
};

/** Đường dẫn thuộc khu quản trị (sidebar / shell). */
export function isAdminDashboardPath(pathname: string): boolean {
  const n = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const paths = [
    '/dashboard/mentor-requests',
    '/dashboard/users',
    '/dashboard/bookings',
    '/dashboard/moderation',
  ] as const;
  return paths.some((p) => n === p || n.startsWith(`${p}/`));
}
