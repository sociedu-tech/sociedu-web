/**
 * Booking flow configuration: timeouts, limits, defaults.
 */

export const STEP_LABELS = [
  'Chon dich vu',
  'Chi tiet',
  'Thanh toan',
] as const;

export const TOTAL_STEPS = STEP_LABELS.length;

export const DRAFT_HOLD_TIMEOUT_MS = 15 * 60 * 1000;

export const PAYMENT_POLL_INTERVAL_MS = 3_000;

export const AVAILABILITY_REFRESH_MS = 60_000;

export const AVAILABILITY_STALE_MS = 30_000;

export const FIELD_LIMITS = {
  GOALS_MIN: 10,
  GOALS_MAX: 1000,
  QUESTIONS_MAX: 2000,
  PORTFOLIO_URL_MAX: 500,
} as const;
