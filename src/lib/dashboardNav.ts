import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  Users,
  Wallet,
  ShoppingBag,
  FileText,
  Shield,
  Search,
  UserCircle,
  Home,
  Package,
  FolderKanban,
  Video,
} from 'lucide-react';
import { ROLES, normalizeRole } from '@/constants/roles';

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Khi true, chỉ active đúng pathname === href */
  exact?: boolean;
};

export function getShellNavItems(role: string, _userId?: string | number): ShellNavItem[] {
  const r = normalizeRole(role);

  if (r === ROLES.ADMIN) {
    return [
      { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true },
      { href: '/dashboard/admin', label: 'Quản trị hệ thống', icon: Shield },
      { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle },
    ];
  }

  if (r === ROLES.MENTOR) {
    return [
      { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true },
      { href: '/dashboard/packages', label: 'Dịch vụ', icon: Package },
      { href: '/dashboard/schedule', label: 'Lịch dạy', icon: Calendar },
      { href: '/dashboard/mentees', label: 'Học viên', icon: Users },
      { href: '/dashboard/revenue', label: 'Doanh thu', icon: Wallet },
      { href: '/dashboard/orders', label: 'Đơn hàng', icon: ShoppingBag },
      { href: '/dashboard/reports', label: 'Chấm báo cáo', icon: FileText },
      { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle },
    ];
  }

  return [
    { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true },
    { href: '/dashboard/projects', label: 'Dự án', icon: FolderKanban },
    { href: '/dashboard/sessions', label: 'Buổi học', icon: Video },
    { href: '/mentors', label: 'Tìm Mentor', icon: Search },
    { href: '/my-reports', label: 'Báo cáo của tôi', icon: FileText },
    { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle },
  ];
}

export function isNavActive(pathname: string, item: ShellNavItem): boolean {
  if (item.exact) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

const TITLE_ENTRIES: [string, string][] = [
  ['/dashboard/admin', 'Quản trị hệ thống'],
  ['/dashboard/packages', 'Gói dịch vụ'],
  ['/dashboard/schedule', 'Lịch dạy'],
  ['/dashboard/mentees', 'Học viên'],
  ['/dashboard/revenue', 'Doanh thu'],
  ['/dashboard/orders', 'Đơn hàng'],
  ['/dashboard/reports', 'Chấm báo cáo'],
];

export function getDashboardTitle(pathname: string): string {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (normalized === '/dashboard') return 'Tổng quan';
  if (normalized === '/dashboard/profile/edit') return 'Cập nhật hồ sơ';
  if (normalized === '/dashboard/projects') return 'Dự án';
  if (normalized.startsWith('/dashboard/projects/')) return 'Chi tiết dự án';
  if (normalized === '/dashboard/sessions') return 'Buổi học';
  for (const [prefix, title] of TITLE_ENTRIES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return title;
    }
  }
  return 'Tổng quan';
}

/**
 * Phần breadcrumb sau mục "Bảng điều khiển" (đã render riêng trong top bar).
 * Ví dụ: /dashboard → [{ Tổng quan }], /dashboard/projects → [{ Dự án }].
 */
export function getDashboardBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const title = getDashboardTitle(pathname);
  if (normalized === '/dashboard') {
    return [{ label: 'Tổng quan' }];
  }
  return [{ label: title }];
}
