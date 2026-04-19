'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AdminDataBannerVariant } from '@/hooks/useAdminData';

type Props = {
  variant: Exclude<AdminDataBannerVariant, null>;
  onRetry?: () => void;
  className?: string;
};

export function AdminFallbackBanner({ variant, onRetry, className }: Props) {
  const isPreview = variant === 'preview';

  return (
    <div
      className={cn(
        'mb-6 flex flex-col gap-3 rounded-xl px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between',
        isPreview
          ? 'border border-sky-200/90 bg-sky-50/90 text-sky-950'
          : 'border border-amber-200/90 bg-amber-50/90 text-amber-950',
        className,
      )}
      role="status"
    >
      <p className="leading-relaxed">
        {isPreview ? (
          <>
            Đang hiển thị <strong>dữ liệu mẫu</strong> để xem trước giao diện. Đặt{' '}
            <code className="rounded bg-white/80 px-1.5 py-0.5 font-mono text-[11px]">
              NEXT_PUBLIC_ADMIN_PREVIEW_DATA=false
            </code>{' '}
            khi nối API thật.
          </>
        ) : (
          <>
            Không tải được dữ liệu từ máy chủ. Đang hiển thị dữ liệu mẫu để bạn vẫn xem được giao diện.
          </>
        )}
      </p>
      {!isPreview && onRetry ? (
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
