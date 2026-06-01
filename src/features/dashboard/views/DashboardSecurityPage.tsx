'use client';

import { useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { authService } from '@/services/authService';

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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Bảo mật tài khoản</h1>
        <p className="mt-1 text-sm text-gray-500">
          Đổi mật khẩu đăng nhập. Phiên làm việc hiện tại sẽ được giữ nguyên.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu hiện tại</span>
          <input
            type="password"
            name="currentPassword"
            required
            autoComplete="current-password"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Mật khẩu mới</span>
          <input
            type="password"
            name="newPassword"
            minLength={8}
            required
            autoComplete="new-password"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</span>
          <input
            type="password"
            name="confirmPassword"
            minLength={8}
            required
            autoComplete="new-password"
            className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
        </label>

        {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><div className="flex items-center gap-2 font-medium"><AlertCircle size={16} aria-hidden />{error}</div></div> : null}
        {successMessage ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><div className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} aria-hidden />{successMessage}</div></div> : null}

        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? 'Đang cập nhật…' : 'Đổi mật khẩu'}
        </button>
      </form>
    </div>
  );
}
