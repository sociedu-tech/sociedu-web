/** Route segments dưới `/dashboard/admin` — dùng cho nav, title, active state. */
export const ADMIN_PATHS = {
  stats: '/dashboard/admin/stats',
  mentorRequests: '/dashboard/admin/mentor-requests',
  productRequests: '/dashboard/admin/product-requests',
  updateRequests: '/dashboard/admin/update-requests',
  users: '/dashboard/admin/users',
} as const;

export const ADMIN_PAGE_TITLES: Record<string, string> = {
  [ADMIN_PATHS.stats]: 'Thống kê',
  [ADMIN_PATHS.mentorRequests]: 'Yêu cầu mentor',
  [ADMIN_PATHS.productRequests]: 'Đăng tài liệu',
  [ADMIN_PATHS.updateRequests]: 'Cập nhật tài liệu',
  [ADMIN_PATHS.users]: 'Người dùng',
};
