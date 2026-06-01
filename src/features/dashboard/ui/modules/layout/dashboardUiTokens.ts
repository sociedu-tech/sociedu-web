/** Class names dùng chung cho dashboard — giữ UI đồng bộ giữa các trang. */
export const dashboardBtnPrimary =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover disabled:pointer-events-none disabled:opacity-60';

export const dashboardBtnSecondary =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-dashboard-border bg-dashboard-surface px-5 py-2.5 text-sm font-semibold text-dashboard-ink-secondary transition-colors hover:bg-dashboard-canvas disabled:opacity-60';

export const dashboardInput =
  'w-full rounded-xl border border-dashboard-border bg-dashboard-canvas/80 px-3.5 py-2.5 text-sm text-dashboard-ink outline-none transition-colors placeholder:text-dashboard-subtle focus:border-primary focus:bg-dashboard-surface focus:ring-2 focus:ring-primary/15';

export const dashboardLabel =
  'mb-1.5 block text-xs font-semibold tracking-wide text-dashboard-muted';

export const dashboardTableHead =
  'border-b border-dashboard-border bg-dashboard-canvas/90 text-left text-xs font-semibold tracking-wide text-dashboard-muted';

export const dashboardTableHeadCell = 'px-5 py-3.5 whitespace-nowrap align-middle';

export const dashboardTableRow =
  'border-b border-dashboard-border-subtle transition-colors last:border-0 hover:bg-dashboard-canvas/70';

export const dashboardTableCell =
  'px-5 py-4 text-sm text-dashboard-ink-secondary whitespace-nowrap align-middle';
