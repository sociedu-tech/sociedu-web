import type { LucideIcon } from 'lucide-react';
import {
  Calendar,
  Users,
  ShoppingBag,
  FileText,
  Shield,
  Search,
  UserCircle,
  Home,
  Package,
  FolderKanban,
  Video,
  MessageCircle,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { ROLES, normalizeRole } from '@/constants/roles';

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Khi true, chỉ active đúng pathname === href */
  exact?: boolean;
  /** Nhóm trong sidebar (tiêu đề phụ) */
  group?: string;
};

export function getShellNavItems(role: string, _userId?: string | number): ShellNavItem[] {
  const r = normalizeRole(role);

  if (r === ROLES.ADMIN) {
    return [
      { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true, group: 'Chính' },
      { href: '/dashboard/admin', label: 'Quản trị hệ thống', icon: Shield, group: 'Chính' },
      { href: '/dashboard/chat', label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Liên hệ' },
      { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle, group: 'Tài khoản' },
    ];
  }

  if (r === ROLES.MENTOR) {
    return [
      { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true, group: 'Chính' },
      { href: '/dashboard/packages', label: 'Dịch vụ', icon: Package, group: 'Công việc' },
      { href: '/dashboard/opportunities', label: 'Cơ hội dự án', icon: Sparkles, group: 'Công việc' },
      { href: '/dashboard/schedule', label: 'Lịch dạy', icon: Calendar, group: 'Công việc' },
      { href: '/dashboard/mentees', label: 'Học viên', icon: Users, group: 'Công việc' },
      { href: '/dashboard/orders', label: 'Đơn hàng', icon: ShoppingBag, group: 'Công việc' },
      { href: '/dashboard/reports', label: 'Chấm báo cáo', icon: FileText, group: 'Công việc' },
      { href: '/dashboard/projects/progress', label: 'Tiến độ dự án', icon: TrendingUp, group: 'Công việc' },
      { href: '/dashboard/chat', label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Liên hệ' },
      { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle, group: 'Tài khoản' },
    ];
  }

  return [
    { href: '/dashboard', label: 'Tổng quan', icon: Home, exact: true, group: 'Chính' },
    { href: '/dashboard/projects', label: 'Dự án', icon: FolderKanban, group: 'Học tập' },
    { href: '/dashboard/projects/progress', label: 'Tiến độ dự án', icon: TrendingUp, group: 'Học tập' },
    { href: '/dashboard/sessions', label: 'Buổi học', icon: Video, group: 'Học tập' },
    { href: '/mentors', label: 'Tìm Mentor', icon: Search, group: 'Học tập' },
    { href: '/my-reports', label: 'Báo cáo của tôi', icon: FileText, group: 'Học tập' },
    { href: '/dashboard/chat', label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Liên hệ' },
    { href: '/dashboard/profile/edit', label: 'Cập nhật hồ sơ', icon: UserCircle, group: 'Tài khoản' },
  ];
}

const SHELL_GROUP_ORDER = ['Chính', 'Công việc', 'Học tập', 'Liên hệ', 'Tài khoản'] as const;

export type ShellNavGroup = { title: string; items: ShellNavItem[] };

/** Gom mục theo `group` để hiển thị tiêu đề nhóm trong sidebar. */
export function groupShellNavItems(items: ShellNavItem[]): ShellNavGroup[] {
  const map = new Map<string, ShellNavItem[]>();
  for (const item of items) {
    const g = item.group ?? 'Chính';
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(item);
  }
  const result: ShellNavGroup[] = [];
  for (const title of SHELL_GROUP_ORDER) {
    const list = map.get(title);
    if (list?.length) {
      result.push({ title, items: list });
      map.delete(title);
    }
  }
  for (const [title, list] of map) {
    if (list.length) result.push({ title, items: list });
  }
  return result;
}

export function isNavActive(pathname: string, item: ShellNavItem): boolean {
  if (item.exact) {
    return pathname === item.href || pathname === `${item.href}/`;
  }
  const n = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (item.href === '/dashboard/projects') {
    return (
      n === '/dashboard/projects' ||
      (n.startsWith('/dashboard/projects/') && !n.startsWith('/dashboard/projects/progress'))
    );
  }
  return n === item.href || n.startsWith(`${item.href}/`);
}

const TITLE_ENTRIES: [string, string][] = [
  ['/dashboard/admin', 'Quản trị hệ thống'],
  ['/dashboard/packages', 'Gói dịch vụ'],
  ['/dashboard/schedule', 'Lịch dạy'],
  ['/dashboard/mentees', 'Học viên'],
  ['/dashboard/opportunities', 'Cơ hội dự án'],
  ['/dashboard/orders', 'Đơn hàng'],
  ['/dashboard/reports', 'Chấm báo cáo'],
];

export function getDashboardTitle(pathname: string): string {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (normalized === '/dashboard') return 'Tổng quan';
  if (normalized === '/dashboard/profile/edit') return 'Cập nhật hồ sơ';
  if (normalized === '/dashboard/chat') return 'Tin nhắn';
  if (normalized === '/dashboard/projects') return 'Dự án';
  if (normalized === '/dashboard/projects/new') return 'Tạo dự án mới';
  if (normalized === '/dashboard/projects/progress') return 'Tiến độ dự án';
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
  if (normalized === '/dashboard/projects/new') {
    return [
      { label: 'Dự án', href: '/dashboard/projects' },
      { label: 'Tạo dự án mới' },
    ];
  }
  return [{ label: title }];
}
