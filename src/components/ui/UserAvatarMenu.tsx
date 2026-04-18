'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type UserAvatarMenuUser = {
  fullName?: string;
  avatarUrl?: string;
  id?: string | number;
};

export type UserAvatarMenuProps = {
  user: UserAvatarMenuUser | null;
  onLogout: () => void;
  /** Hồ sơ công khai, ví dụ `/profile/:id` */
  profileHref: string;
  /**
   * `site` — navbar landing (viền góc 8px, giống Mentoree).
   * `dashboard` — header bảng điều khiển (avatar tròn, tên + chevron từ lg).
   */
  variant?: 'site' | 'dashboard';
  className?: string;
};

export function UserAvatarMenu({
  user,
  onLogout,
  profileHref,
  variant = 'site',
  className,
}: UserAvatarMenuProps) {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inDashboard = pathname.startsWith('/dashboard');

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const displayName = user?.fullName || 'Tài khoản';

  const menuPanel = (
    <div
      role="menu"
      className={cn(
        'absolute right-0 top-full z-200 min-w-[240px] overflow-hidden rounded-2xl border border-gray-200/80 bg-white py-2',
        variant === 'site' ? 'mt-3' : 'mt-2',
      )}
    >
      {!inDashboard ? (
        <Link
          role="menuitem"
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
          onClick={() => setOpen(false)}
        >
          <LayoutDashboard className="size-[18px] shrink-0 text-neutral-500" strokeWidth={2} />
          Bảng điều khiển
        </Link>
      ) : null}

      <Link
        role="menuitem"
        href={profileHref}
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
        onClick={() => setOpen(false)}
      >
        <User className="size-[18px] shrink-0 text-neutral-500" strokeWidth={2} />
        Hồ sơ công khai
      </Link>

      <Link
        role="menuitem"
        href="/dashboard/profile/edit"
        className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:bg-neutral-50"
        onClick={() => setOpen(false)}
      >
        <UserCircle className="size-[18px] shrink-0 text-neutral-500" strokeWidth={2} />
        Cập nhật hồ sơ
      </Link>

      <div className="my-1 border-t border-gray-100" />

      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50"
        onClick={() => {
          setOpen(false);
          onLogout();
        }}
      >
        <LogOut className="size-[18px] shrink-0 text-neutral-500" strokeWidth={2} />
        Đăng xuất
      </button>
    </div>
  );

  return (
    <div className={cn('relative', className)} ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          variant === 'dashboard'
            ? 'flex items-center gap-2 rounded-full p-0.5 pr-2 text-left transition-colors hover:bg-gray-100 sm:pr-3'
            : 'group flex items-center gap-2 rounded-full border border-neutral-200/90 bg-white py-1 pl-1 pr-1 transition md:pr-2',
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={displayName ? `Menu tài khoản: ${displayName}` : 'Menu tài khoản'}
      >
        <span
          className={cn(
            'flex shrink-0 items-center justify-center overflow-hidden',
            variant === 'dashboard'
              ? 'size-9 rounded-full border border-gray-200 bg-gray-50'
              : 'size-8 rounded-full border border-neutral-200/80 bg-neutral-100 text-neutral-600 md:size-9',
          )}
        >
          {user?.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={40}
              height={40}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <User className={variant === 'dashboard' ? 'size-[18px] text-gray-400' : 'size-[18px]'} strokeWidth={2} />
          )}
        </span>

        {variant === 'site' ? (
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-neutral-700"
            aria-hidden
          >
            <Menu className="size-[18px]" strokeWidth={2} />
          </span>
        ) : (
          <ChevronDown
            className={cn(
              'hidden size-4 shrink-0 text-gray-400 transition-transform lg:block',
              open && 'rotate-180',
            )}
            strokeWidth={2}
          />
        )}
      </button>

      {open ? menuPanel : null}
    </div>
  );
}
