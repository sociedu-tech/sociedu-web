/** Class áp dụng cho `<tr>` tiêu đề bảng dashboard. */
export const dashboardTableHeadClass =
  'border-b border-dashboard-border bg-dashboard-canvas/90 text-[10px] font-semibold tracking-wider text-dashboard-muted';

/** Ô tiêu đề — một dòng, không xuống dòng trừ khi viewport quá hẹp (scroll ngang). */
export const dashboardTableHeadCell = 'px-4 py-3 whitespace-nowrap align-middle';

/** Hàng dữ liệu. */
export const dashboardTableRowClass = 'bg-dashboard-surface hover:bg-dashboard-canvas/80';

/** Ô dữ liệu mặc định — một dòng. */
export const dashboardTableCell = 'px-4 py-3 whitespace-nowrap align-middle text-sm text-dashboard-ink-secondary';

/** Ô text dài — vẫn một dòng, cắt ellipsis + tooltip qua title. */
export const dashboardTableCellTruncate =
  'px-4 py-3 max-w-[1px] overflow-hidden text-ellipsis whitespace-nowrap align-middle text-sm text-dashboard-ink-secondary';

/** Nút/link thao tác trong bảng. */
export const dashboardTableActionLink =
  'inline-flex items-center whitespace-nowrap text-xs font-semibold text-primary hover:text-primary-hover hover:underline';

export const dashboardTableActionMuted = 'text-xs text-dashboard-subtle whitespace-nowrap';
