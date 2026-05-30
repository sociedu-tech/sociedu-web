'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminDataBannerVariant } from '@/features/admin/hooks';

type Props = {
  variant: Exclude<AdminDataBannerVariant, null>;
  onRetry?: () => void;
  className?: string;
};

export function AdminFallbackBanner({ onRetry, className }: Props) {
  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 rounded-xl border border-amber-200/90 bg-amber-50/90 px-4 py-3 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between',
        className,
      )}
      role="status"
    >
      <p className="leading-relaxed">
        Không tải được dữ liệu từ máy chủ. Kiểm tra API backend và đăng nhập lại với tài khoản admin.
      </p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg border border-amber-300/80 bg-white px-3 py-1.5 text-xs font-semibold text-amber-950 shadow-sm transition hover:bg-amber-50"
        >
          <RefreshCw className="size-3.5" aria-hidden />
          Thử lại
        </button>
      ) : null}
    </div>
  );
}
