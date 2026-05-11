'use client';

import React from 'react';
import { Package, Clock, FileText, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingFlowState } from '../../constants/bookingStates';

interface StepPlaceholderProps {
  flowState: BookingFlowState;
}

const STEP_INFO: Record<string, { icon: React.ElementType; title: string; description: string }> = {
  SELECTING_PACKAGE: {
    icon: Package,
    title: 'Chọn dịch vụ',
    description: 'Chọn gói mentoring phù hợp với nhu cầu của bạn.',
  },
  SELECTING_SLOT: {
    icon: Clock,
    title: 'Chọn lịch hẹn',
    description: 'Chọn ngày và khung giờ phù hợp.',
  },
  FILLING_DETAILS: {
    icon: FileText,
    title: 'Chi tiết buổi hẹn',
    description: 'Chia sẻ mục tiêu và câu hỏi của bạn.',
  },
};

/**
 * Placeholder step — hiển thị khi chưa build step thật.
 * Sẽ thay bằng component thật ở Phase B & C.
 */
export function StepPlaceholder({ flowState }: StepPlaceholderProps) {
  const info = STEP_INFO[flowState];

  if (!info) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={48} className="text-green-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Hoàn tất!</h3>
        <p className="text-sm text-gray-500 mt-1">Đặt lịch thành công.</p>
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-6">
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center mb-5',
          'bg-primary/5 border border-primary/10',
        )}
      >
        <Icon size={28} className="text-primary" />
      </div>
      <h3 className="text-lg font-bold text-gray-900">{info.title}</h3>
      <p className="text-sm text-gray-500 mt-1.5 max-w-xs">{info.description}</p>
      <div className="mt-6 px-4 py-2 rounded-lg bg-amber-50 border border-amber-100">
        <p className="text-xs text-amber-600 font-medium">
          🚧 Đang phát triển — sẽ có ở Phase B/C
        </p>
      </div>
    </div>
  );
}
