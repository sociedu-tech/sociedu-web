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
    <main className="min-h-screen bg-[#F3F2EF] flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
        {loading ? (
          <div className="text-center">
            <div className="mx-auto w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-airbnb-gray font-medium">Dang xac minh email...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="mx-auto text-red-500" size={28} />
            <h1 className="mt-3 text-xl font-bold text-airbnb-dark">Xac minh khong thanh cong</h1>
            <p className="mt-2 text-red-600">{error}</p>
            <div className="mt-6 flex justify-center gap-3">
              <Link href="/register" className="px-4 py-2 rounded-lg border border-gray-300 font-semibold">
                Dang ky lai
              </Link>
              <Link href="/login" className="px-4 py-2 rounded-lg bg-airbnb-dark text-white font-semibold">
                Di toi dang nhap
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-green-600" size={28} />
            <h1 className="mt-3 text-xl font-bold text-airbnb-dark">Xac minh thanh cong</h1>
            <p className="mt-2 text-airbnb-gray">Dang chuyen vao he thong...</p>
          </div>
        )}
      </div>
    </main>
  );
}