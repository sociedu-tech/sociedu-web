'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type BookingFlowState,
  canTransition,
} from '../constants/bookingStates';
import type { PendingBookingIntent } from '../types';

/* ------------------------------------------------------------------ */
/*  Store shape                                                        */
/* ------------------------------------------------------------------ */

interface BookingStoreState {
  // --- UI ---
  isOpen: boolean;
  flowState: BookingFlowState;

  // --- Selections ---
  mentorId: string | undefined;
  selectedPackageId: string | undefined;
  selectedVersionId: string | undefined;
  selectedDate: string | undefined;       // ISO date  (YYYY-MM-DD)
  selectedTimeSlot: string | undefined;   // ISO datetime

  // --- Timezone (#20) ---
  timezone: string;

  // --- Draft & Payment (#9, #15) ---
  draftBookingId: string | undefined;
  paymentUrl: string | undefined;
  isSubmitting: boolean;

  // --- Form (#12) ---
  goals: string;
  questions: string;
  portfolioUrl: string;
  attachmentIds: string[];

  // --- Dirty tracking (#5) ---
  hasUnsavedChanges: boolean;

  // --- Auth resume (#6) ---
  pendingBookingIntent: PendingBookingIntent | undefined;
}

interface BookingStoreActions {
  open: (mentorId: string, packageId?: string) => void;
  close: () => void;
  forceClose: () => void;
  transitionTo: (next: BookingFlowState) => void;

  setPackage: (packageId: string, versionId?: string) => void;
  setSchedule: (date: string | undefined, slot: string | undefined) => void;
  setDraft: (draftId: string) => void;
  setPayment: (url: string) => void;
  setFormField: (field: 'goals' | 'questions' | 'portfolioUrl', value: string) => void;

  markDirty: () => void;
  setPendingIntent: (intent: PendingBookingIntent | undefined) => void;
  reset: () => void;
}

export type BookingStore = BookingStoreState & BookingStoreActions;

/* ------------------------------------------------------------------ */
/*  Initial / reset state                                              */
/* ------------------------------------------------------------------ */

const INITIAL_STATE: BookingStoreState = {
  isOpen: false,
  flowState: 'IDLE',
  mentorId: undefined,
  selectedPackageId: undefined,
  selectedVersionId: undefined,
  selectedDate: undefined,
  selectedTimeSlot: undefined,
  timezone:
    typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'Asia/Ho_Chi_Minh',
  draftBookingId: undefined,
  paymentUrl: undefined,
  isSubmitting: false,
  goals: '',
  questions: '',
  portfolioUrl: '',
  attachmentIds: [],
  hasUnsavedChanges: false,
  pendingBookingIntent: undefined,
};

/* ------------------------------------------------------------------ */
/*  Store                                                              */
/* ------------------------------------------------------------------ */

export const useBookingStore = create<BookingStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      /* ---------- Modal controls ---------- */

      open: (mentorId, packageId) =>
        set({
          isOpen: true,
          mentorId,
          selectedPackageId: packageId,
          flowState: 'SELECTING_PACKAGE',
          hasUnsavedChanges: false,
          pendingBookingIntent: undefined,
        }),

      /** Close — chỉ ẩn modal (state giữ nguyên cho recovery) */
      close: () => set({ isOpen: false }),

      /** Force close — reset toàn bộ state */
      forceClose: () => set({ ...INITIAL_STATE }),

      /* ---------- State machine ---------- */

      transitionTo: (next) => {
        const { flowState } = get();
        if (canTransition(flowState, next)) {
          set({
            flowState: next,
            isSubmitting: next === 'SUBMITTING',
          });
        } else {
          console.warn(
            `[BookingStore] Invalid transition: ${flowState} → ${next}`,
          );
        }
      },

      /* ---------- Selections ---------- */

      setPackage: (packageId, versionId) =>
        set({
          selectedPackageId: packageId,
          selectedVersionId: versionId,
          hasUnsavedChanges: true,
          // Reset downstream khi đổi package
          selectedDate: undefined,
          selectedTimeSlot: undefined,
          draftBookingId: undefined,
        }),

      setSchedule: (date, slot) =>
        set({
          selectedDate: date,
          selectedTimeSlot: slot,
          hasUnsavedChanges: true,
        }),

      setDraft: (draftId) => set({ draftBookingId: draftId }),

      setPayment: (url) => set({ paymentUrl: url }),

      setFormField: (field, value) =>
        set({ [field]: value, hasUnsavedChanges: true }),

      /* ---------- Misc ---------- */

      markDirty: () => set({ hasUnsavedChanges: true }),

      setPendingIntent: (intent) =>
        set({ pendingBookingIntent: intent }),

      reset: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'booking-flow',
      // Chỉ persist field cần thiết cho recovery (#3)
      partialize: (state) => ({
        mentorId: state.mentorId,
        selectedPackageId: state.selectedPackageId,
        selectedVersionId: state.selectedVersionId,
        selectedDate: state.selectedDate,
        selectedTimeSlot: state.selectedTimeSlot,
        draftBookingId: state.draftBookingId,
        flowState: state.flowState,
        timezone: state.timezone,
        pendingBookingIntent: state.pendingBookingIntent,
        goals: state.goals,
        questions: state.questions,
        portfolioUrl: state.portfolioUrl,
      }),
    },
  ),
);
