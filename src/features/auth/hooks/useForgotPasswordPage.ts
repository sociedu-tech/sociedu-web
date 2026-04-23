import { useState } from 'react';
import { authService } from '@/services/authService';

export function useForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const message = await authService.forgotPassword(email.trim());
      setSuccessMessage(message || 'If email exists, reset link was sent.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Cannot send request now.');
    } finally {
      setSubmitting(false);
    }
  };

  return { email, setEmail, submitting, error, successMessage, onSubmit };
}
