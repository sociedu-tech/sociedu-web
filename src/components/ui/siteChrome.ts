import { cn } from '@/lib/utils';

/** Link “Đăng nhập” ở header (text, không nền). */
export const siteHeaderAuthLinkClassName = 'text-[15px] text-dark hover:text-primary transition-colors px-2';

/** Mục nav desktop: text nhỏ xám / primary khi active. */
export function siteNavDesktopItemClassName(active: boolean) {
  return cn(
    'text-[12px] font-medium transition-colors hover:text-primary',
    active ? 'text-primary' : 'text-gray',
  );
}

/** Nút hash trên nav desktop (Cách hoạt động, FAQ) — trùng kiểu chữ với link route. */
export function siteNavDesktopHashButtonClassName() {
  return 'text-[12px] font-medium transition-colors hover:text-primary text-gray';
}
