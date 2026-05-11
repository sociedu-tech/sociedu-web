'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface CloseConfirmDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Xác nhận đóng booking modal khi có thay đổi chưa lưu (#5).
 */
export function CloseConfirmDialog({ open, onConfirm, onCancel }: CloseConfirmDialogProps) {
  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[110] animate-in fade-in duration-200"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[111] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm p-6 space-y-4 animate-in zoom-in-95 fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">
                Hủy đặt lịch?
              </h3>
              <p className="text-sm text-gray-500 mt-0.5">
                Thông tin bạn đã chọn sẽ không được lưu.
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              Tiếp tục đặt
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 transition-colors"
            >
              Hủy bỏ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
