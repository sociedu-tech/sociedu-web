import { ROLES, AppRole } from './roles';

export interface AppRoute {
  path: string;
  label: string;
  roles: readonly AppRole[];
  sidebar?: boolean; // Hiển thị trên sidebar hay không
  icon?: string;
}

export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    MENTORS: '/mentors',
    PRODUCTS: '/products',
    APPLY_MENTOR: '/apply-mentor',
  },
  DASHBOARD: {
    // ---- SHARED ROUTES ----
    SHARED: {
      HOME: { path: '/dashboard', label: 'Tổng quan', roles: [ROLES.USER, ROLES.MENTOR, ROLES.ADMIN], sidebar: true },
      PROFILE_EDIT: { path: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', roles: [ROLES.USER, ROLES.MENTOR, ROLES.ADMIN] },
      CHAT: { path: '/dashboard/chat', label: 'Tin nhắn', roles: [ROLES.USER, ROLES.MENTOR, ROLES.ADMIN], sidebar: true, icon: 'message-circle' },
      SECURITY: { path: '/dashboard/security', label: 'Bảo mật tài khoản', roles: [ROLES.USER, ROLES.MENTOR, ROLES.ADMIN] },
    },
    // ---- USER ROUTES ----
    USER: {
      MENTORING: { path: '/dashboard/mentoring', label: 'Mentoring', roles: [ROLES.USER], sidebar: true },
      MY_ORDERS: { path: '/dashboard/my-orders', label: 'Đơn hàng', roles: [ROLES.USER], sidebar: true },
      FIND_MENTORS: { path: '/dashboard/find-mentors', label: 'Tìm mentor', roles: [ROLES.USER], sidebar: true },
    },
    // ---- MENTOR ROUTES ----
    MENTOR: {
      PACKAGES: { path: '/dashboard/packages', label: 'Gói dịch vụ', roles: [ROLES.MENTOR], sidebar: true },
      MENTORING: { path: '/dashboard/mentoring', label: 'Mentoring', roles: [ROLES.MENTOR], sidebar: true },
      MENTEES: { path: '/dashboard/mentees', label: 'Học viên', roles: [ROLES.MENTOR], sidebar: true },
      ORDERS: { path: '/dashboard/orders', label: 'Đơn hàng', roles: [ROLES.MENTOR], sidebar: true },
    },
    // ---- ADMIN ROUTES ----
    ADMIN: {
      OVERVIEW: { path: '/dashboard', label: 'Thống kê', roles: [ROLES.ADMIN], sidebar: true },
      USERS: { path: '/dashboard/users', label: 'Quản lý người dùng', roles: [ROLES.ADMIN], sidebar: true },
      MENTORS: { path: '/dashboard/mentors', label: 'Quản lý mentor', roles: [ROLES.ADMIN], sidebar: false },
      PRODUCT_REQUESTS: { path: '/dashboard/product-requests', label: 'Duyệt Sản phẩm', roles: [ROLES.ADMIN], sidebar: true },
      MENTORING: { path: '/dashboard/mentoring', label: 'Mentoring', roles: [ROLES.ADMIN], sidebar: true },
      BOOKINGS: { path: '/dashboard/bookings', label: 'Quản lý đặt lịch', roles: [ROLES.ADMIN], sidebar: true },
      REPORTS: { path: '/dashboard/moderation', label: 'Báo cáo & tranh chấp', roles: [ROLES.ADMIN], sidebar: true },
    }
  }
} as const;

export const getSidebarRoutes = (userRole: AppRole): AppRoute[] => {
  const routes: AppRoute[] = [];
  
  // Combine all route blocks
  const blocks = [
    Object.values(ROUTES.DASHBOARD.SHARED),
    Object.values(ROUTES.DASHBOARD.USER),
    Object.values(ROUTES.DASHBOARD.MENTOR),
    Object.values(ROUTES.DASHBOARD.ADMIN),
  ];

  blocks.forEach((block) => {
    block.forEach((route) => {
      const isRouteObject = typeof route === 'object' && route !== null && 'path' in route && 'roles' in route;
      if (isRouteObject && (route as AppRoute).sidebar && (route as AppRoute).roles.includes(userRole)) {
        routes.push(route as AppRoute);
      }
    });
  });

  return routes;
};
