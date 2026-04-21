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
      PROJECTS: { path: '/dashboard/projects', label: 'Dự án của tôi', roles: [ROLES.USER], sidebar: true },
      PROJECT_NEW: { path: '/dashboard/projects/new', label: 'Tạo dự án mới', roles: [ROLES.USER] },
      PROJECT_PROGRESS: { path: '/dashboard/projects/progress', label: 'Tiến độ dự án', roles: [ROLES.USER] },
      SESSIONS: { path: '/dashboard/sessions', label: 'Buổi học', roles: [ROLES.USER], sidebar: true },
      MENTOR_APPLICATION: { path: '/dashboard/mentor-application', label: 'Đơn apply Mentor', roles: [ROLES.USER], sidebar: true, icon: 'graduation-cap' },
    },
    // ---- MENTOR ROUTES ----
    MENTOR: {
      PACKAGES: { path: '/dashboard/packages', label: 'Gói dịch vụ', roles: [ROLES.MENTOR], sidebar: true },
      SCHEDULE: { path: '/dashboard/schedule', label: 'Lịch dạy', roles: [ROLES.MENTOR], sidebar: true },
      MENTEES: { path: '/dashboard/mentees', label: 'Học viên', roles: [ROLES.MENTOR], sidebar: true },
      ORDERS: { path: '/dashboard/orders', label: 'Đơn hàng', roles: [ROLES.MENTOR], sidebar: true },
      REPORTS: { path: '/dashboard/reports', label: 'Chấm báo cáo', roles: [ROLES.MENTOR], sidebar: true },
      OPPORTUNITIES: { path: '/dashboard/opportunities', label: 'Cơ hội dự án', roles: [ROLES.MENTOR], sidebar: true },
    },
    // ---- ADMIN ROUTES ----
    ADMIN: {
      OVERVIEW: { path: '/dashboard', label: 'Thống kê', roles: [ROLES.ADMIN], sidebar: true },
      USERS: { path: '/dashboard/users', label: 'Người dùng', roles: [ROLES.ADMIN], sidebar: true },
      MENTORS: { path: '/dashboard/mentors', label: 'Quản lý Mentor', roles: [ROLES.ADMIN], sidebar: true },
      MENTOR_REQUESTS: { path: '/dashboard/mentors/requests', label: 'Duyệt Mentor', roles: [ROLES.ADMIN], sidebar: true },
      PRODUCT_REQUESTS: { path: '/dashboard/product-requests', label: 'Duyệt Sản phẩm', roles: [ROLES.ADMIN], sidebar: true },
      BOOKINGS: { path: '/dashboard/bookings', label: 'Giao dịch / Booking', roles: [ROLES.ADMIN], sidebar: true },
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
