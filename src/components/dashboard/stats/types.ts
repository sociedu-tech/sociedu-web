/** Khoảng thời gian preset cho bộ lọc thống kê dashboard (dùng chung admin / mentor / user). */
export type StatsTimeRange = '7d' | '30d' | '90d' | '365d';

/** Điểm dữ liệu chuỗi { label trục X, value } cho biểu đồ line/area/bar. */
export type StatsSeriesPoint = { label: string; value: number };
