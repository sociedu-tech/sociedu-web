import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Nền hero marketing (canvas + glow) — cùng “họ” với landing, biến thể theo trang để không lặp lại nhàm chán.
 */
const HERO_BACKDROP = {
  /** Giống landing: primary trái, tím phải, wash dọc */
  default: {
    a: 'absolute -left-[18%] -top-[20%] h-[min(560px,90vh)] w-[min(72vw,640px)] rounded-full bg-primary/[0.14] blur-[120px]',
    b: 'absolute -right-[12%] top-[30%] h-[380px] w-[min(56vw,520px)] rounded-full bg-secondary-purple/11 blur-[100px]',
    wash: 'absolute inset-0 bg-linear-to-b from-page via-transparent to-marketing-canvas/90',
  },
  /** Mentors: đổi trục glow, nhấn xanh brand + tím nhẹ */
  mentor: {
    a: 'absolute -right-[16%] -top-[18%] h-[min(520px,88vh)] w-[min(70vw,600px)] rounded-full bg-secondary-purple/10 blur-[105px]',
    b: 'absolute -left-[12%] top-[26%] h-[360px] w-[min(58vw,540px)] rounded-full bg-primary/[0.13] blur-[100px]',
    wash: 'absolute inset-0 bg-linear-to-b from-page via-blue-light/35 to-marketing-canvas/88',
  },
  /** Auth / form: glow nhỏ hơn, gần trung tâm — không “gắt” như marketing full */
  soft: {
    a: 'absolute left-[8%] -top-[22%] h-[min(360px,52vh)] w-[min(62vw,440px)] rounded-full bg-primary/[0.09] blur-[88px]',
    b: 'absolute -right-[4%] bottom-[12%] h-[260px] w-[min(48vw,400px)] rounded-full bg-secondary-purple/[0.07] blur-[80px]',
    wash: 'absolute inset-0 bg-linear-to-b from-page/95 via-marketing-canvas/45 to-marketing-canvas/95',
  },
  /** Đăng ký: tone ấm (cam) + primary — tách nhịp với login soft */
  dawn: {
    a: 'absolute -left-[10%] top-[5%] h-[min(420px,68vh)] w-[min(60vw,500px)] rounded-full bg-secondary-orange/10 blur-[96px]',
    b: 'absolute right-[-6%] top-[38%] h-[300px] w-[min(52vw,440px)] rounded-full bg-primary/[0.11] blur-[92px]',
    wash: 'absolute inset-0 bg-linear-to-b from-page via-peach/20 to-marketing-canvas/90',
  },
} as const;

export type MarketingHeroVariant = keyof typeof HERO_BACKDROP;

type MarketingHeroSectionProps = {
  variant?: MarketingHeroVariant;
  /** Bọc ngoài nội dung (vd. `Container`) — mặc định không thêm lớp */
  contentClassName?: string;
  children: ReactNode;
  /** `main` khi trang chỉ có một landmark nội dung (vd. xác minh email) */
  as?: 'section' | 'main';
} & Omit<ComponentPropsWithoutRef<'section'>, 'children'>;

export function MarketingHeroSection({
  variant = 'default',
  className,
  contentClassName,
  children,
  as: As = 'section',
  ...sectionProps
}: MarketingHeroSectionProps) {
  const v = HERO_BACKDROP[variant];

  return (
    <As className={cn('relative overflow-hidden border-b border-border bg-marketing-canvas', className)} {...sectionProps}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className={v.a} />
        <div className={v.b} />
        <div className={v.wash} />
      </div>
      <div className={cn('relative z-10', contentClassName)}>{children}</div>
    </As>
  );
}
