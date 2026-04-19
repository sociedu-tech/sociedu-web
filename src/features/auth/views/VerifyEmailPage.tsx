'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { authService } from '@/services/authService';
import { getAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const VERIFY_OK_PREFIX = 'mentoree:email-verify-ok:';

/** Ưu tiên `window.location` để tránh flash lỗi khi query chưa đồng bộ với `useSearchParams`. */
function resolveVerificationToken(queryToken: string | null): string {
  if (typeof window !== 'undefined') {
    const fromLocation = new URLSearchParams(window.location.search).get('token');
    if (fromLocation?.trim()) return fromLocation.trim();
  }
  return (queryToken ?? '').trim();
}

/** Backend báo token/OTP đã dùng — thường do gọi API hai lần (React Strict Mode) hoặc mở link lặp lại. */
function isTokenAlreadyConsumedError(err: unknown): boolean {
  const msg = (err instanceof Error ? err.message : '').toLowerCase();
  if (!msg) return false;
  const hints = [
    'đã sử dụng',
    'da su dung',
    'already been used',
    'already used',
    'token has already',
    'invalid or used',
    'no longer valid',
    'expired or used',
  ];
  return hints.some((h) => msg.includes(h));
}

export function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token');
  const router = useRouter();
  const { applyAuthPayload, reloadSession } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (!cancelled) setLoading(false);
    };

    const run = async () => {
      const token = resolveVerificationToken(tokenFromQuery);

      if (!token) {
        setError('Liên kết xác minh không hợp lệ hoặc thiếu mã.');
        finish();
        return;
      }

      const storageKey = `${VERIFY_OK_PREFIX}${token}`;

      if (typeof window !== 'undefined' && sessionStorage.getItem(storageKey) === '1') {
        if (!cancelled) router.replace('/dashboard');
        finish();
        return;
      }

      try {
        const payload = await authService.verifyEmail(token);
        if (cancelled) return;
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(storageKey, '1');
        }
        await applyAuthPayload(payload);
        if (!cancelled) router.replace('/dashboard');
      } catch (err: unknown) {
        if (cancelled) return;

        if (isTokenAlreadyConsumedError(err)) {
          const hasSession = Boolean(getAuthToken());
          if (hasSession) {
            if (typeof window !== 'undefined') {
              sessionStorage.setItem(storageKey, '1');
            }
            try {
              await reloadSession();
            } catch {
              /* ignore */
            }
            if (!cancelled) router.replace('/dashboard');
            return;
          }

          setError(
            'Liên kết xác minh đã được sử dụng hoặc không còn hiệu lực. Nếu bạn đã xác minh email trước đó, hãy đăng nhập.',
          );
          return;
        }

        setError(err instanceof Error ? err.message : 'Không thể xác minh email.');
      } finally {
        finish();
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [applyAuthPayload, reloadSession, router, tokenFromQuery]);

  return (
    <main className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-lg w-full bg-white rounded-[8px] border border-border p-6">
        {loading ? (
          <div className="text-center">
            <div className="mx-auto w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray font-medium">Đang xác minh email...</p>
            <p className="mt-2 text-sm text-gray/80">Vui lòng không đóng trang này.</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <AlertCircle className="mx-auto text-secondary-red" size={28} aria-hidden />
            <h1 className="mt-3 text-lg font-semibold text-dark">Xác minh không thành công</h1>
            <p className="mt-2 text-secondary-red text-sm leading-relaxed">{error}</p>
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
