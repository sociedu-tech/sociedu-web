import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type IconButtonProps = {
  children: ReactNode;
  /** Nút icon-only bắt buộc có nhãn trợ năng */
  'aria-label': string;
  variant?: 'ghost' | 'muted';
  size?: 'sm' | 'md';
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'aria-label'>;

const variantClass: Record<NonNullable<IconButtonProps['variant']>, string> = {
  ghost: 'rounded-[4px] hover:bg-surface-muted text-dark',
  muted: 'rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-50',
};

const sizeClass: Record<NonNullable<IconButtonProps['size']>, string> = {
  sm: 'min-h-8 min-w-8 p-1',
  md: 'min-h-10 min-w-10 p-2',
};

/**
 * Nút chỉ icon — dùng cho menu mobile, đóng dialog, v.v.
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center transition-colors',
        variantClass[variant],
        sizeClass[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
