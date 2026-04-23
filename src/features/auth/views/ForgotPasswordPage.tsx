'use client';

import Link from 'next/link';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { MarketingHeroSection } from '@/components/marketing';
import { useForgotPasswordPage } from '@/features/auth/hooks';

export function ForgotPasswordPage() {
  const { email, setEmail, submitting, error, successMessage, onSubmit } = useForgotPasswordPage();

  return (
    <MarketingHeroSection as="main" variant="soft" className="flex min-h-screen items-center justify-center p-4 border-b-0">
      <div className="w-full max-w-lg rounded-[8px] border border-border bg-white p-6 md:p-8">
        <h1 className="text-2xl font-semibold text-dark">Forgot password</h1>
        <p className="mt-2 text-sm text-gray">Enter your account email to receive a reset link.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray" size={18} aria-hidden />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@university.edu.vn" required className="w-full rounded-md border border-gray-200 py-2 pl-10 pr-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" />
            </div>
          </label>

          {error ? <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"><div className="flex items-center gap-2 font-medium"><AlertCircle size={16} aria-hidden />{error}</div></div> : null}
          {successMessage ? <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><div className="flex items-center gap-2 font-medium"><CheckCircle2 size={16} aria-hidden />{successMessage}</div></div> : null}

          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">{submitting ? 'Sending...' : 'Send reset link'}</button>
        </form>

        <p className="mt-6 text-sm text-gray">Remember password? <Link href="/login" className="font-semibold text-primary hover:underline">Back to login</Link></p>
      </div>
    </MarketingHeroSection>
  );
}
