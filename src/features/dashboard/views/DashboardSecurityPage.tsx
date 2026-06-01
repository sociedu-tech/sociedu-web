'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2, Shield } from 'lucide-react';
import { authService } from '@/services/authService';
import {
  DashboardPage,
  DashboardSurface,
  DashboardViewHeader,
  dashboardBtnPrimary,
  dashboardInput,
  dashboardLabel,
} from '@/features/dashboard/ui/DashboardPrimitives';

export function DashboardSecurityPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = String(formData.get('currentPassword') ?? '');
    const newPassword = String(formData.get('newPassword') ?? '');
    const confirmPassword = String(formData.get('confirmPassword') ?? '');

    if (newPassword.length < 8) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Xác nhận mật khẩu không khớp.');
      return;
    }

    setSubmitting(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      setSuccessMessage('Đã đổi mật khẩu thành công.');
      e.currentTarget.reset();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể đổi mật khẩu lúc này. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Tài khoản"
        title="Bảo mật tài khoản"
        description="Đổi mật khẩu đăng nhập. Phiên làm việc hiện tại sẽ được giữ nguyên."
      />

      <DashboardSurface className="p-5 sm:p-6">
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="size-5" strokeWidth={2} aria-hidden />
          </div>
          <p className="text-sm leading-relaxed text-slate-600">
            Dùng mật khẩu mạnh, tối thiểu 8 ký tự, kết hợp chữ hoa, chữ thường và số.
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className={dashboardLabel}>Mật khẩu hiện tại</span>
            <input
              type="password"
              name="currentPassword"
              required
              autoComplete="current-password"
              className={dashboardInput}
            />
          </label>
          <label className="block">
            <span className={dashboardLabel}>Mật khẩu mới</span>
            <input
              type="password"
              name="newPassword"
              minLength={8}
              required
              autoComplete="new-password"
              className={dashboardInput}
            />
          </label>
          <label className="block">
            <span className={dashboardLabel}>Xác nhận mật khẩu mới</span>
            <input
              type="password"
              name="confirmPassword"
              minLength={8}
              required
              autoComplete="new-password"
              className={dashboardInput}
            />
          </label>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <div className="flex items-center gap-2 font-medium">
                <AlertCircle size={16} aria-hidden />
                {error}
              </div>
            </div>
          ) : null}
          {successMessage ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
              <div className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} aria-hidden />
                {successMessage}
              </div>
            </div>
          ) : null}

          <button type="submit" disabled={submitting} className={dashboardBtnPrimary}>
            {submitting ? 'Đang cập nhật…' : 'Đổi mật khẩu'}
          </button>
        </form>
      </DashboardSurface>
    </DashboardPage>
  );
}
