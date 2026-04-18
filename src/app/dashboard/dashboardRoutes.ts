import { ROLES } from '@/constants/roles';

/** Định nghĩa tập trung: URL dashboard + role được phép (để đối chiếu với guard / menu). */
export const DASHBOARD_ROUTES = {
  home: {
    path: '/dashboard',
    label: 'Tổng quan',
    roles: [ROLES.ADMIN, ROLES.MENTOR, ROLES.USER] as const,
  },
  projects: {
    path: '/dashboard/projects',
    label: 'Dự án',
    roles: [ROLES.ADMIN, ROLES.MENTOR, ROLES.USER] as const,
  },
  projectDetail: {
    path: '/dashboard/projects/[id]',
    label: 'Chi tiết dự án',
    roles: [ROLES.ADMIN, ROLES.MENTOR, ROLES.USER] as const,
  },
  sessions: {
    path: '/dashboard/sessions',
    label: 'Buổi học',
    roles: [ROLES.ADMIN, ROLES.MENTOR, ROLES.USER] as const,
  },
  admin: {
    path: '/dashboard/admin',
    label: 'Quản trị hệ thống',
    roles: [ROLES.ADMIN] as const,
  },
  packages: {
    path: '/dashboard/packages',
    label: 'Gói dịch vụ',
    roles: [ROLES.MENTOR] as const,
  },
  schedule: {
    path: '/dashboard/schedule',
    label: 'Lịch dạy',
    roles: [ROLES.MENTOR] as const,
  },
  mentees: {
    path: '/dashboard/mentees',
    label: 'Học viên',
    roles: [ROLES.MENTOR] as const,
  },
  revenue: {
    path: '/dashboard/revenue',
    label: 'Doanh thu',
    roles: [ROLES.MENTOR] as const,
  },
  orders: {
    path: '/dashboard/orders',
    label: 'Đơn hàng',
    roles: [ROLES.MENTOR] as const,
  },
  reports: {
    path: '/dashboard/reports',
    label: 'Chấm báo cáo',
    roles: [ROLES.MENTOR] as const,
  },
} as const;

export type DashboardRouteKey = keyof typeof DASHBOARD_ROUTES;
