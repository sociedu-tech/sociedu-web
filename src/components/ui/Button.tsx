import Link from 'next/link';
import type { LinkProps } from 'next/link';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghostOnDark';

export type ButtonSize = 'default' | 'pill' | 'compact' | 'cta';

type SharedButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export type AppButtonProps =
  | (SharedButtonProps & { href: string } & Omit<LinkProps, 'className' | 'children' | 'href'>)
  | (SharedButtonProps & { href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>);

const sizeClasses: Record<ButtonSize, string> = {
  /** Khớp `.btn-*` trong globals — bo góc nhỏ, padding chuẩn form */
  default: '',
  /** Cặp CTA landing (hai nút cùng chiều cao / bo tròn) */
  pill: 'min-h-[48px] rounded-full px-8 py-3 text-sm font-bold',
  /** Header / chỗ hẹp */
  compact: 'py-2 px-5 text-sm',
  /** Khối CTA cuối trang (bo lớn, min-width) */
  cta: 'min-w-[180px] justify-center rounded-lg px-8 py-3 text-sm font-bold',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghostOnDark:
    'inline-flex items-center justify-center border border-white/25 bg-white/10 text-sm font-bold text-white transition duration-200 hover:bg-white/20 active:scale-95',
};

export function buttonClassName(options: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const { variant = 'primary', size = 'default', className } = options;
  return cn(
    'inline-flex items-center justify-center gap-2 text-center',
    variantClasses[variant],
    size !== 'default' && sizeClasses[size],
    className
  );
}

/**
 * Nút / liên kết dạng nút dùng chung: variant khớp `.btn-*` trong `globals.css`,
 * `size="pill"` cho cặp CTA hero (cùng style với nhau).
 */
export function Button({ variant = 'primary', size = 'default', className, children, href, ...rest }: AppButtonProps) {
  const classes = buttonClassName({ variant, size, className });

  if (href !== undefined) {
    return (
      <Link href={href} className={classes} {...(rest as Omit<LinkProps, 'className' | 'children' | 'href'>)}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button type={buttonProps.type ?? 'button'} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
