'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { useAuth } from '@/context/AuthContext';

export function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { applyAuthPayload } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = useMemo(() => searchParams.get('token') ?? '', [searchParams]);

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setError('Liên kết xác minh không hợp lệ.');
        setLoading(false);
        return;
      }

      try {
        const payload = await authService.verifyEmail(token);
        await applyAuthPayload(payload);
        router.replace('/');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Không thể xác minh email.');
      } finally {
        setLoading(false);
      }
    };

    void verify();
  }, [applyAuthPayload, router, token]);

  return (
    <main className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-[8px] border border-border shadow-glass p-6">
        {loading ? (
          <div className="text-center">
            <div className="mx-auto w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray font-medium">Đang xác minh email...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="mx-auto text-secondary-red" size={28} aria-hidden />
            <h1 className="mt-3 text-lg font-semibold text-dark">Xác minh không thành công</h1>
            <p className="mt-2 text-secondary-red">{error}</p>
            <div className="mt-6 flex justify-center gap-3 flex-wrap">
              <Link
                href="/register"
                className="px-4 py-2 rounded-[4px] border border-border font-medium hover:bg-surface-muted transition-colors"
              >
                Đăng ký lại
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-[4px] bg-primary text-white font-medium hover:bg-primary-hover transition-colors">
                Đi tới đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-secondary-green" size={28} aria-hidden />
            <h1 className="mt-3 text-lg font-semibold text-dark">Xác minh thành công</h1>
            <p className="mt-2 text-gray">Đang chuyển vào hệ thống...</p>
          </div>
        )}
      </div>
    </main>
  );
}
