'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STEP_LABELS } from '../constants/bookingConfig';
import { getStepFromState, type BookingFlowState } from '../constants/bookingStates';

interface BookingStepperProps {
  flowState: BookingFlowState;
}

export function BookingStepper({ flowState }: BookingStepperProps) {
  const currentStep = getStepFromState(flowState);

  return (
    <nav aria-label="Booking progress" className="w-full px-2">
      <ol className="flex items-center w-full">
        {STEP_LABELS.map((label, idx) => {
          const stepNum = idx + 1;
          const isCompleted = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          const isLast = stepNum === STEP_LABELS.length;

          return (
            <li
              key={label}
              className={cn(
                'flex items-center',
                !isLast && 'flex-1',
              )}
            >
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5 min-w-0">
                <div
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 border-2 shrink-0',
                    isCompleted &&
                      'bg-primary border-primary text-white',
                    isCurrent &&
                      'border-primary text-primary bg-white',
                    !isCompleted &&
                      !isCurrent &&
                      'border-gray-200 text-gray-400 bg-white',
                  )}
                >
                  {isCompleted ? (
                    <Check size={14} strokeWidth={3} />
                  ) : (
                    stepNum
                  )}
                </div>
                <span
                  className={cn(
                    'text-[11px] font-semibold tracking-tight text-center leading-tight whitespace-nowrap',
                    isCurrent && 'text-primary',
                    isCompleted && 'text-gray-600',
                    !isCurrent && !isCompleted && 'text-gray-400',
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-2 mt-[-18px]">
                  <div
                    className={cn(
                      'h-[2px] rounded-full transition-all duration-500',
                      isCompleted ? 'bg-primary' : 'bg-gray-200',
                    )}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
