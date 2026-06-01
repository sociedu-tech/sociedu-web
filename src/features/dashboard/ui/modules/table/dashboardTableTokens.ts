/** Class áp dụng cho `<tr>` tiêu đề bảng dashboard. */
export const dashboardTableHeadClass =
  'border-b border-slate-100 bg-slate-50/90 text-[10px] font-semibold uppercase tracking-wider text-slate-500';

/** Ô tiêu đề — một dòng, không xuống dòng trừ khi viewport quá hẹp (scroll ngang). */
export const dashboardTableHeadCell = 'px-4 py-3 whitespace-nowrap align-middle';

/** Hàng dữ liệu. */
export const dashboardTableRowClass = 'bg-white hover:bg-slate-50/80';

/** Ô dữ liệu mặc định — một dòng. */
export const dashboardTableCell = 'px-4 py-3 whitespace-nowrap align-middle text-sm text-slate-800';

/** Ô text dài — vẫn một dòng, cắt ellipsis + tooltip qua title. */
export const dashboardTableCellTruncate =
  'px-4 py-3 max-w-[1px] overflow-hidden text-ellipsis whitespace-nowrap align-middle text-sm text-slate-800';

/** Nút/link thao tác trong bảng. */
export const dashboardTableActionLink =
  'inline-flex items-center whitespace-nowrap text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline';

export const dashboardTableActionMuted = 'text-xs text-slate-400 whitespace-nowrap';
