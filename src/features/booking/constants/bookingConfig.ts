/**
 * Booking flow configuration — timeouts, limits, defaults.
 */

/** Tên các bước hiển thị trên stepper */
export const STEP_LABELS = [
  'Chọn dịch vụ',
  'Chọn lịch',
  'Chi tiết',
  'Hoàn tất',
] as const;

/** Tổng số bước trong booking flow */
export const TOTAL_STEPS = STEP_LABELS.length;

/** Thời gian tối đa hold slot draft booking (ms) */
export const DRAFT_HOLD_TIMEOUT_MS = 15 * 60 * 1000; // 15 phút

/** Interval polling payment status (ms) */
export const PAYMENT_POLL_INTERVAL_MS = 3_000; // 3 giây

/** Availability auto-refresh interval (ms) */
export const AVAILABILITY_REFRESH_MS = 60_000; // 60 giây

/** Availability stale time (ms) */
export const AVAILABILITY_STALE_MS = 30_000; // 30 giây

/** Form field limits */
export const FIELD_LIMITS = {
  GOALS_MIN: 10,
  GOALS_MAX: 1000,
  QUESTIONS_MAX: 2000,
  PORTFOLIO_URL_MAX: 500,
} as const;
