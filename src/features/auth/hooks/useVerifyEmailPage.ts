import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authService } from '@/services/authService';
import { getAuthToken } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const VERIFY_OK_PREFIX = 'mentoree:email-verify-ok:';

function resolveVerificationToken(queryToken: string | null): string {
  if (typeof window !== 'undefined') {
    const fromLocation = new URLSearchParams(window.location.search).get('token');
    if (fromLocation?.trim()) return fromLocation.trim();
  }
  return (queryToken ?? '').trim();
}

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

export function useVerifyEmailPage() {
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

  return { loading, error };
}
