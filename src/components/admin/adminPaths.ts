/** Route quản trị dưới `/dashboard` (nhóm `(admin)` — không còn segment `admin`). */
export const ADMIN_PATHS = {
  stats: '/dashboard/stats',
  mentorRequests: '/dashboard/mentor-requests',
  productRequests: '/dashboard/product-requests',
  updateRequests: '/dashboard/update-requests',
  users: '/dashboard/users',
} as const;

export const ADMIN_PAGE_TITLES: Record<string, string> = {
  [ADMIN_PATHS.stats]: 'Thống kê',
  [ADMIN_PATHS.mentorRequests]: 'Yêu cầu mentor',
  [ADMIN_PATHS.productRequests]: 'Đăng tài liệu',
  [ADMIN_PATHS.updateRequests]: 'Cập nhật tài liệu',
  [ADMIN_PATHS.users]: 'Người dùng',
};

/** Sidebar / shell: coi là đang trong khu quản trị khi khớp một trong các route trên. */
export function isAdminDashboardPath(pathname: string): boolean {
  const n = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  return (Object.values(ADMIN_PATHS) as string[]).some((p) => n === p || n.startsWith(`${p}/`));
}
