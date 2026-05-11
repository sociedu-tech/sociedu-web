/**
 * Booking flow state machine.
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

export const STEP_STATE_MAP: Record<number, BookingFlowState> = {
  1: 'SELECTING_PACKAGE',
  2: 'FILLING_DETAILS',
  3: 'PAYMENT_PENDING',
};

export const STATE_STEP_MAP: Partial<Record<BookingFlowState, number>> = {
  SELECTING_PACKAGE: 1,
  SELECTING_SLOT: 1,
  FILLING_DETAILS: 2,
  SUBMITTING: 2,
  PAYMENT_PENDING: 3,
  PAYMENT_SUCCESS: 3,
  PAYMENT_FAILED: 3,
  EXPIRED: 3,
  ERROR: 3,
};

const TRANSITIONS: Record<BookingFlowState, BookingFlowState[]> = {
  IDLE: ['SELECTING_PACKAGE'],
  SELECTING_PACKAGE: ['FILLING_DETAILS', 'SELECTING_SLOT', 'IDLE'],
  SELECTING_SLOT: ['FILLING_DETAILS', 'SELECTING_PACKAGE', 'IDLE'],
  FILLING_DETAILS: ['SUBMITTING', 'SELECTING_PACKAGE', 'SELECTING_SLOT', 'IDLE'],
  SUBMITTING: ['PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'ERROR', 'FILLING_DETAILS'],
  PAYMENT_PENDING: ['PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'EXPIRED'],
  PAYMENT_SUCCESS: ['IDLE'],
  PAYMENT_FAILED: ['FILLING_DETAILS', 'SELECTING_PACKAGE', 'IDLE'],
  EXPIRED: ['SELECTING_PACKAGE', 'IDLE'],
  ERROR: ['FILLING_DETAILS', 'SELECTING_SLOT', 'SELECTING_PACKAGE', 'IDLE'],
};

export function canTransition(from: BookingFlowState, to: BookingFlowState): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isTerminalState(state: BookingFlowState): boolean {
  return state === 'PAYMENT_SUCCESS' || state === 'IDLE';
}

export function getStepFromState(state: BookingFlowState): number {
  return STATE_STEP_MAP[state] ?? 1;
}
