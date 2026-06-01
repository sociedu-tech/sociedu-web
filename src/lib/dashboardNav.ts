import type { LucideIcon } from 'lucide-react';
import {
  Users,
  ShoppingBag,
  Search,
  Home,
  Package,
  BookOpen,
  MessageCircle,
  UserCog,
  UserCircle,
  Flag,
  ShieldCheck,
} from 'lucide-react';
import { ROLES, normalizeRole } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import { MENTORING_NAV, MENTORING_PATH } from '@/features/dashboard/lib/programLabels';

export type ShellNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  exact?: boolean;
  group?: string;
  children?: { href: string; label: string; exact?: boolean }[];
};

const ACCOUNT_NAV_ITEMS: ShellNavItem[] = [
  {
    href: ROUTES.DASHBOARD.SHARED.PROFILE_EDIT.path,
    label: 'Cập nhật hồ sơ',
    icon: UserCircle,
    exact: true,
    group: 'Tài khoản',
  },
  {
    href: ROUTES.DASHBOARD.SHARED.SECURITY.path,
    label: 'Bảo mật tài khoản',
    icon: ShieldCheck,
    exact: true,
    group: 'Tài khoản',
  },
];

export function getShellNavItems(role: string, _userId?: string | number): ShellNavItem[] {
  const r = normalizeRole(role);

  if (r === ROLES.ADMIN) {
    return [
      { href: ROUTES.DASHBOARD.ADMIN.OVERVIEW.path, label: 'Trang chủ', icon: Home, exact: true, group: 'Chính' },
      { href: ROUTES.DASHBOARD.SHARED.CHAT.path, label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Chính' },
      {
        href: ROUTES.DASHBOARD.ADMIN.MENTORS.path,
        label: 'Quản lý Mentor',
        icon: UserCog,
        group: 'Quản trị',
        children: [{ href: ROUTES.DASHBOARD.ADMIN.MENTORS.path, label: 'Danh mục', exact: true }],
      },
      { href: ROUTES.DASHBOARD.ADMIN.USERS.path, label: 'Người dùng', icon: Users, group: 'Quản trị' },
      { href: MENTORING_PATH, label: MENTORING_NAV, icon: BookOpen, group: 'Quản trị' },
      {
        href: ROUTES.DASHBOARD.ADMIN.REPORTS.path,
        label: 'Báo cáo & tranh chấp',
        icon: Flag,
        group: 'Quản trị',
        children: [
          { href: ROUTES.DASHBOARD.ADMIN.REPORTS.path, label: 'Tất cả', exact: true },
          { href: `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/people`, label: 'Người dùng & mentor' },
          { href: `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/reviews`, label: 'Đánh giá' },
          { href: `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/sessions`, label: MENTORING_NAV },
        ],
      },
      ...ACCOUNT_NAV_ITEMS,
    ];
  }

  if (r === ROLES.MENTOR) {
    return [
      { href: '/dashboard', label: 'Trang chủ', icon: Home, exact: true, group: 'Chính' },
      { href: '/dashboard/chat', label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Chính' },
      { href: '/dashboard/packages', label: 'Dịch vụ', icon: Package, group: 'Công việc' },
      { href: MENTORING_PATH, label: MENTORING_NAV, icon: BookOpen, group: 'Công việc' },
      { href: '/dashboard/mentees', label: 'Học viên', icon: Users, group: 'Công việc' },
      { href: '/dashboard/orders', label: 'Đơn hàng', icon: ShoppingBag, group: 'Công việc' },
      ...ACCOUNT_NAV_ITEMS,
    ];
  }

  return [
    { href: '/dashboard', label: 'Trang chủ', icon: Home, exact: true, group: 'Chính' },
    { href: '/dashboard/chat', label: 'Tin nhắn', icon: MessageCircle, exact: true, group: 'Chính' },
    { href: MENTORING_PATH, label: MENTORING_NAV, icon: BookOpen, group: 'Học tập' },
    { href: '/dashboard/my-orders', label: 'Đơn hàng', icon: ShoppingBag, group: 'Học tập' },
    { href: '/dashboard/find-mentors', label: 'Tìm Mentor', icon: Search, group: 'Học tập' },
    ...ACCOUNT_NAV_ITEMS,
  ];
}

const SHELL_GROUP_ORDER = ['Chính', 'Quản trị', 'Công việc', 'Học tập', 'Liên hệ', 'Tài khoản'] as const;

export type ShellNavGroup = { title: string; items: ShellNavItem[] };

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
  return n === item.href || n.startsWith(`${item.href}/`);
}

const TITLE_ENTRIES: [string, string][] = [
  [ROUTES.DASHBOARD.ADMIN.MENTORS.path, 'Quản lý Mentor'],
  [ROUTES.DASHBOARD.ADMIN.USERS.path, 'Người dùng'],
  [MENTORING_PATH, MENTORING_NAV],
  [ROUTES.DASHBOARD.ADMIN.REPORTS.path, 'Báo cáo & khiếu nại'],
  ['/dashboard/mentors/', 'Chi tiết Mentor'],
  ['/dashboard/mentors/[mentorId]/packages', 'Gói dịch vụ Mentor'],
  ['/dashboard/mentors/[mentorId]/mentees', 'Học viên của Mentor'],
  ['/dashboard/packages', 'Gói dịch vụ'],
  ['/dashboard/mentees', 'Học viên'],
  ['/dashboard/orders', 'Đơn hàng'],
];

export function getDashboardTitle(pathname: string): string {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  if (normalized === '/dashboard') return 'Trang chủ';
  if (normalized === '/dashboard/profile/edit') return 'Cập nhật hồ sơ';
  if (normalized === '/dashboard/security') return 'Bảo mật tài khoản';
  if (normalized === '/dashboard/chat') return 'Tin nhắn';
  if (/^\/dashboard\/mentoring\/[^/]+\/report$/.test(normalized)) return 'Gửi báo cáo';
  if (/^\/dashboard\/mentoring\/[^/]+$/.test(normalized)) return 'Chi tiết';
  if (normalized === MENTORING_PATH) return MENTORING_NAV;
  if (/^\/dashboard\/my-orders\/[^/]+$/.test(normalized)) return 'Chi tiết đơn hàng';
  if (normalized === '/dashboard/my-orders') return 'Đơn hàng của tôi';
  if (/^\/dashboard\/orders\/[^/]+$/.test(normalized)) return 'Chi tiết đơn hàng';
  if (normalized === '/dashboard/find-mentors') return 'Tìm mentor';
  if (normalized === ROUTES.DASHBOARD.ADMIN.REPORTS.path) return 'Báo cáo — Tất cả';
  if (normalized === `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/people`) return 'Báo cáo — Người dùng & mentor';
  if (normalized === `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/reviews`) return 'Báo cáo — Đánh giá';
  if (normalized === `${ROUTES.DASHBOARD.ADMIN.REPORTS.path}/sessions`) return `Báo cáo — ${MENTORING_NAV}`;
  if (/^\/dashboard\/moderation\/(all|people|reviews|sessions)\/[^/]+$/.test(normalized)) {
    return 'Chi tiết báo cáo';
  }
  {
    const m = normalized.match(/^\/dashboard\/moderation\/([^/]+)$/);
    if (m && !['people', 'reviews', 'sessions', 'all'].includes(m[1])) {
      return 'Chi tiết báo cáo';
    }
  }
  for (const [prefix, title] of TITLE_ENTRIES) {
    if (normalized === prefix || normalized.startsWith(`${prefix}/`)) {
      return title;
    }
  }
  return 'Trang chủ';
}

export function getDashboardBreadcrumb(pathname: string): { label: string; href?: string }[] {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const title = getDashboardTitle(pathname);
  if (normalized === '/dashboard') {
    return [{ label: 'Trang chủ' }];
  }
  if (/^\/dashboard\/mentoring\/([^/]+)\/report$/.test(normalized)) {
    const bookingId = normalized.match(/^\/dashboard\/mentoring\/([^/]+)\/report$/)?.[1];
    return [
      { label: MENTORING_NAV, href: MENTORING_PATH },
      { label: 'Chi tiết', href: bookingId ? `${MENTORING_PATH}/${bookingId}` : undefined },
      { label: 'Gửi báo cáo' },
    ];
  }
  if (/^\/dashboard\/mentoring\/[^/]+$/.test(normalized)) {
    return [
      { label: MENTORING_NAV, href: MENTORING_PATH },
      { label: 'Chi tiết' },
    ];
  }
  if (/^\/dashboard\/my-orders\/[^/]+$/.test(normalized)) {
    return [
      { label: 'Đơn hàng', href: '/dashboard/my-orders' },
      { label: 'Chi tiết đơn hàng' },
    ];
  }
  if (/^\/dashboard\/orders\/[^/]+$/.test(normalized)) {
    return [
      { label: 'Đơn hàng', href: '/dashboard/orders' },
      { label: 'Chi tiết đơn hàng' },
    ];
  }
  return [{ label: title }];
}
