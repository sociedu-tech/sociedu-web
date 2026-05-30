'use client';

import { cn } from '@/lib/utils';

export type ProfileTabId = 'about' | 'experience' | 'reviews';

type Tab = { id: ProfileTabId; label: string };

type Props = {
  tabs: Tab[];
  activeTab: ProfileTabId;
  onChange: (id: ProfileTabId) => void;
  className?: string;
};

export function ProfileTabNav({ tabs, activeTab, onChange, className }: Props) {
  return (
    <nav
      className={cn(
        'flex gap-1 overflow-x-auto rounded-2xl border border-marketing-border bg-white p-1.5 shadow-sm',
        'scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        className,
      )}
      aria-label="Mục hồ sơ"
    >
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition',
              active
                ? 'bg-marketing-chrome text-white shadow-sm'
                : 'text-marketing-fg-muted hover:bg-marketing-canvas hover:text-marketing-fg',
            )}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </button>
        );
      })}
    </nav>
  );
}
