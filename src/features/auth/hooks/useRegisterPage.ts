import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { isApiClientError } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export function useRegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});
    setResendMessage(null);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/);
    const firstName = nameParts.pop() ?? '';
    const lastName = nameParts.join(' ') || firstName;

    try {
      await authService.register({
        email,
        password,
        firstName,
        lastName,
      });
      setSuccess(true);
      setRegisteredEmail(email);
    } catch (err: unknown) {
      if (isApiClientError(err) && err.errorType === 'VALIDATION_ERROR' && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!registeredEmail) return;
    setResendLoading(true);
    setResendMessage(null);
    setError(null);
    try {
      const message = await authService.resendVerification(registeredEmail);
      setResendMessage(message || 'Đã gửi lại email. Kiểm tra hộp thư (và thư mục Spam) trong vài phút tới.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Không thể gửi lại email xác minh.');
    } finally {
      setResendLoading(false);
    }
  };

  const resetRegistration = () => {
    setSuccess(false);
    setRegisteredEmail('');
    setResendMessage(null);
    setError(null);
  };

  return {
    loading,
    error,
    success,
    registeredEmail,
    resendLoading,
    resendMessage,
    fieldErrors,
    isAuthenticated,
    handleSubmit,
    handleResendVerification,
    goToLogin: () => router.push('/login'),
    resetRegistration,
  };
}
