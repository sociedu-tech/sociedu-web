'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookingStore } from '../store/useBookingStore';
import { BookingStepper } from './BookingStepper';
import { CloseConfirmDialog } from './CloseConfirmDialog';
import { OrderSummaryPanel } from './OrderSummaryPanel';
import { StepPlaceholder } from './steps/StepPlaceholder';
import { PackageSelectionStep } from './steps/PackageSelectionStep';
import { ScheduleSelectionStep } from './steps/ScheduleSelectionStep';
import { BookingDetailsStep } from './steps/BookingDetailsStep';
import { BookingResultStep } from './steps/BookingResultStep';
import {
  getStepFromState,
  canTransition,
  STEP_STATE_MAP,
} from '../constants/bookingStates';
import { TOTAL_STEPS } from '../constants/bookingConfig';
import { usePackagesForBooking } from '../hooks/usePackagesForBooking';
import { getSelectedPackageSummary } from '../services/slotService';

interface BookingFlowShellProps {
  mentorName?: string;
}

/**
 * BookingFlowShell — Responsive container (#4)
 * Desktop (≥768px): centered dialog overlay
 * Mobile  (<768px): full-screen bottom sheet
 */
export function BookingFlowShell({ mentorName }: BookingFlowShellProps) {
  const store = useBookingStore();
  const { isOpen, flowState, hasUnsavedChanges, mentorId, selectedPackageId, selectedVersionId } = store;
  const [showConfirm, setShowConfirm] = useState(false);
  const { data: packages } = usePackagesForBooking(mentorId);

  const currentStep = getStepFromState(flowState);
  const { selectedPackage, selectedVersion } = getSelectedPackageSummary(
    packages,
    selectedPackageId,
    selectedVersionId,
  );

  /* ------ Close logic (#5) ------ */

  const handleCloseAttempt = useCallback(() => {
    if (hasUnsavedChanges) {
      setShowConfirm(true);
    } else {
      store.forceClose();
    }
  }, [hasUnsavedChanges, store]);

  const handleConfirmClose = useCallback(() => {
    setShowConfirm(false);
    store.forceClose();
  }, [store]);

  /* ------ Navigation ------ */

  const handlePrev = useCallback(() => {
    const prevStep = currentStep - 1;
    if (prevStep < 1) return;
    const prevState = STEP_STATE_MAP[prevStep];
    if (prevState && canTransition(flowState, prevState)) {
      store.transitionTo(prevState);
    }
  }, [currentStep, flowState, store]);

  const handleNext = useCallback(() => {
    const nextStep = currentStep + 1;
    if (nextStep > TOTAL_STEPS) return;
    const nextState = STEP_STATE_MAP[nextStep];
    if (nextState && canTransition(flowState, nextState)) {
      store.transitionTo(nextState);
    }
  }, [currentStep, flowState, store]);

  /* ------ Keyboard: Escape to close ------ */

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseAttempt();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, handleCloseAttempt]);

  /* ------ Body scroll lock ------ */

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  /* ------ Don't render when closed ------ */

  if (!isOpen) return null;

  const isFirstStep = currentStep <= 1;
  const isLastStep = currentStep >= TOTAL_STEPS;
  const isResultStep = ['PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'PAYMENT_FAILED', 'EXPIRED'].includes(flowState);
  const usesStepOwnedNavigation = ['SELECTING_PACKAGE', 'SELECTING_SLOT', 'FILLING_DETAILS', 'SUBMITTING'].includes(flowState);

  const renderStep = () => {
    switch (flowState) {
      case 'SELECTING_PACKAGE':
        return <PackageSelectionStep />;
      case 'SELECTING_SLOT':
        return <ScheduleSelectionStep />;
      case 'FILLING_DETAILS':
      case 'SUBMITTING':
        return <BookingDetailsStep />;
      case 'PAYMENT_PENDING':
      case 'PAYMENT_SUCCESS':
      case 'PAYMENT_FAILED':
      case 'EXPIRED':
      case 'ERROR':
        return <BookingResultStep flowState={flowState} />;
      default:
        return <StepPlaceholder flowState={flowState} />;
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[100] animate-in fade-in duration-200"
        onClick={handleCloseAttempt}
      />

      {/* Shell container — responsive (#4) */}
      <div className="fixed inset-0 z-[101] flex items-end md:items-center justify-center">
        <div
          className={cn(
            'bg-white w-full flex flex-col',
            'animate-in duration-300',
            // Mobile: full-height bottom sheet
            'h-full rounded-none',
            // Desktop: centered dialog
            'md:h-auto md:max-h-[90vh] md:max-w-4xl md:rounded-3xl md:mx-4',
            'md:slide-in-from-bottom-4 slide-in-from-bottom-8',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ──── Header ──── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Đặt lịch mentoring
            </h2>
            <button
              type="button"
              onClick={handleCloseAttempt}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Đóng"
            >
              <X size={18} />
            </button>
          </div>

          {/* ──── Stepper ──── */}
          {!isResultStep && (
            <div className="px-5 py-4 border-b border-gray-50 shrink-0">
              <BookingStepper flowState={flowState} />
            </div>
          )}

          {/* ──── Body: Step content + Sidebar ──── */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="flex flex-col md:flex-row h-full">
              {/* Step content */}
              <div className="flex-1 min-w-0 px-5 py-5">
                {renderStep()}
              </div>

              {/* Order summary sidebar — desktop only (#14) */}
              {!isResultStep && (
                <div className="hidden md:block w-72 border-l border-gray-100 px-5 py-5 shrink-0">
                  <OrderSummaryPanel
                    mentorName={mentorName}
                    packageName={selectedPackage?.name}
                    duration={selectedVersion?.durationInMinutes}
                    price={selectedVersion?.price}
                  />
                </div>
              )}
            </div>

            {/* Order summary — mobile collapse (#14) */}
            {!isResultStep && (
              <div className="md:hidden px-5 pb-3">
                <OrderSummaryPanel
                  mentorName={mentorName}
                  packageName={selectedPackage?.name}
                  duration={selectedVersion?.durationInMinutes}
                  price={selectedVersion?.price}
                />
              </div>
            )}
          </div>

          {/* ──── Footer navigation ──── */}
          {!isResultStep && !usesStepOwnedNavigation && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 shrink-0 gap-3">
              <button
                type="button"
                onClick={handlePrev}
                disabled={isFirstStep}
                className={cn(
                  'inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold rounded-xl transition-colors',
                  isFirstStep
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100',
                )}
              >
                <ChevronLeft size={16} />
                Quay lại
              </button>

              <button
                type="button"
                onClick={handleNext}
                disabled={isLastStep}
                className={cn(
                  'inline-flex items-center gap-1.5 px-5 py-2.5 text-sm font-semibold rounded-xl transition-all',
                  isLastStep
                    ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                    : 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]',
                )}
              >
                Tiếp tục
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Close confirmation */}
      <CloseConfirmDialog
        open={showConfirm}
        onConfirm={handleConfirmClose}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
