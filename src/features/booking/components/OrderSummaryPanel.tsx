'use client';

import React from 'react';
import { User, Package, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBookingStore } from '../store/useBookingStore';

interface OrderSummaryPanelProps {
  mentorName?: string;
  packageName?: string;
  duration?: number;       // minutes
  price?: number;
  className?: string;
}

/**
 * Global order summary — hiển thị ở mọi step (#14).
 * Desktop: sidebar bên phải.
 * Mobile: collapsible panel.
 */
export function OrderSummaryPanel({
  mentorName,
  packageName,
  duration,
  price,
  className,
}: OrderSummaryPanelProps) {
  const { selectedDate, selectedTimeSlot } = useBookingStore();

  const hasAnyData = mentorName || packageName || selectedDate;

  if (!hasAnyData) return null;

  const formatDate = (iso?: string) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString('vi-VN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const formatTime = (iso?: string) => {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  const formatPrice = (amount?: number) => {
    if (amount === undefined || amount === null) return null;
    if (amount === 0) return 'Miễn phí';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-gray-100 bg-gray-50/50 p-5 space-y-4',
        className,
      )}
    >
      <h3 className="text-sm font-bold text-gray-900 tracking-tight">
        Tóm tắt đặt lịch
      </h3>

      <div className="space-y-3">
        {/* Mentor */}
        {mentorName && (
          <SummaryRow icon={User} label="Mentor" value={mentorName} />
        )}

        {/* Package */}
        {packageName && (
          <SummaryRow
            icon={Package}
            label="Dịch vụ"
            value={`${packageName}${duration ? ` · ${duration} phút` : ''}`}
          />
        )}

        {/* Schedule */}
        {selectedDate && (
          <SummaryRow
            icon={Clock}
            label="Lịch hẹn"
            value={[formatDate(selectedDate), formatTime(selectedTimeSlot)]
              .filter(Boolean)
              .join(' — ')}
          />
        )}

        {/* Price */}
        {price !== undefined && (
          <SummaryRow
            icon={CreditCard}
            label="Chi phí"
            value={formatPrice(price) ?? '—'}
            highlight
          />
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Internal row component                                             */
/* ------------------------------------------------------------------ */

function SummaryRow({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center shrink-0 mt-0.5">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <p
          className={cn(
            'text-sm font-semibold leading-snug mt-0.5 break-words',
            highlight ? 'text-primary' : 'text-gray-800',
          )}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
