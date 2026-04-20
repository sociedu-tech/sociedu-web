import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { isApiClientError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function useLoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUnverifiedEmail(null);
    setResendMessage(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      await login({ email, password });
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from') || '/dashboard';
      router.push(from);
    } catch (err: unknown) {
      if (isApiClientError(err) && err.errorType === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(email);
      }
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedEmail) return;
    setResendLoading(true);
    setError(null);
    setResendMessage(null);
    try {
      const message = await authService.resendVerification(unverifiedEmail);
      setResendMessage(message || 'Đã gửi lại email xác minh. Vui lòng kiểm tra hộp thư.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại email xác minh.');
    } finally {
      setResendLoading(false);
    }
  };

  return {
    loading,
    error,
    unverifiedEmail,
    resendLoading,
    resendMessage,
    isAuthenticated,
    handleSubmit,
    handleResendVerification,
  };
}
