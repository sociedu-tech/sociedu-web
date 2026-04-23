'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { MarketingHeroSection } from '@/components/marketing';
import { useResetPasswordPage } from '@/features/auth/hooks';

export function ResetPasswordPage() {
  const { token, submitting, error, success, onSubmit, goLogin } = useResetPasswordPage();

  return (
    <MarketingHeroSection as="main" variant="soft" className="flex min-h-screen items-center justify-center p-4 border-b-0">
      <div className="w-full max-w-lg rounded-[8px] border border-border bg-white p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-dark">Reset password</h1>
        {!token ? <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">Invalid or expired reset link.</div> : null}

        {success ? (
          <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <div className="flex items-center gap-2 font-semibold"><CheckCircle2 size={18} aria-hidden />Password reset successful.</div>
            <button type="button" onClick={goLogin} className="mt-3 btn-primary">Go to login</button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">New password</span><input type="password" name="newPassword" minLength={8} required autoComplete="new-password" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
            <label className="block"><span className="mb-1 block text-sm font-medium text-gray-700">Confirm new password</span><input type="password" name="confirmPassword" minLength={8} required autoComplete="new-password" className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" /></label>
            {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><div className="flex items-center gap-2 font-medium"><AlertCircle size={16} aria-hidden />{error}</div></div> : null}
            <button type="submit" disabled={submitting || !token} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Updating...' : 'Update password'}</button>
          </form>
        )}

        <p className="mt-6 text-sm text-gray"><Link href="/login" className="font-semibold text-primary hover:underline">Back to login</Link></p>
      </div>
    </MarketingHeroSection>
  );
}
