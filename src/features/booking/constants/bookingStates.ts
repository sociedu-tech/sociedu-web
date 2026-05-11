/**
 * Booking Flow State Machine
 * Define tất cả trạng thái và transitions hợp lệ.
 */

export type BookingFlowState =
  | 'IDLE'
  | 'SELECTING_PACKAGE'
  | 'SELECTING_SLOT'
  | 'FILLING_DETAILS'
  | 'SUBMITTING'
  | 'PAYMENT_PENDING'
  | 'PAYMENT_SUCCESS'
  | 'PAYMENT_FAILED'
  | 'EXPIRED'
  | 'ERROR';

/** Map step number (1-based) ↔ state cho stepper UI */
export const STEP_STATE_MAP: Record<number, BookingFlowState> = {
  1: 'SELECTING_PACKAGE',
  2: 'SELECTING_SLOT',
  3: 'FILLING_DETAILS',
  4: 'PAYMENT_PENDING', // covers PENDING / SUCCESS / FAILED
};

export const STATE_STEP_MAP: Partial<Record<BookingFlowState, number>> = {
  SELECTING_PACKAGE: 1,
  SELECTING_SLOT: 2,
  FILLING_DETAILS: 3,
  SUBMITTING: 3,
  PAYMENT_PENDING: 4,
  PAYMENT_SUCCESS: 4,
  PAYMENT_FAILED: 4,
};

/** Valid transitions — from → allowed targets */
const TRANSITIONS: Record<BookingFlowState, BookingFlowState[]> = {
  IDLE: ['SELECTING_PACKAGE'],
  SELECTING_PACKAGE: ['SELECTING_SLOT', 'IDLE'],
  SELECTING_SLOT: ['FILLING_DETAILS', 'SELECTING_PACKAGE', 'IDLE'],
  FILLING_DETAILS: ['SUBMITTING', 'SELECTING_SLOT', 'IDLE'],
  SUBMITTING: ['PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'ERROR', 'FILLING_DETAILS'],
  PAYMENT_PENDING: ['PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'EXPIRED'],
  PAYMENT_SUCCESS: ['IDLE'],
  PAYMENT_FAILED: ['FILLING_DETAILS', 'SELECTING_SLOT', 'IDLE'],
  EXPIRED: ['SELECTING_SLOT', 'IDLE'],
  ERROR: ['FILLING_DETAILS', 'SELECTING_SLOT', 'SELECTING_PACKAGE', 'IDLE'],
};

export function canTransition(from: BookingFlowState, to: BookingFlowState): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

/** Kiểm tra state hiện tại có phải "terminal" (kết thúc flow) không */
export function isTerminalState(state: BookingFlowState): boolean {
  return state === 'PAYMENT_SUCCESS' || state === 'IDLE';
}

/** Lấy step number từ flow state (cho stepper UI) */
export function getStepFromState(state: BookingFlowState): number {
  return STATE_STEP_MAP[state] ?? 1;
}
