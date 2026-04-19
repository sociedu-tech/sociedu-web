import { useState, useCallback } from 'react';
import { useToast } from '@/context/ToastContext';
import { parseErrorMessage } from '@/lib/handleError';

interface AsyncActionOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error | unknown) => void;
  successMessage?: string;
  errorMessage?: string; // Fallback title
}

export function useAsyncAction<TArgs extends any[], TRet>() {
  const [isLoading, setIsLoading] = useState(false);
  const { success, error: showError } = useToast();

  const execute = useCallback(
    async (
      action: (...args: TArgs) => Promise<TRet>,
      options?: AsyncActionOptions<TRet>,
      ...args: TArgs
    ): Promise<TRet | undefined> => {
      setIsLoading(true);
      try {
        const result = await action(...args);
        if (options?.successMessage) {
          success(options.successMessage);
        }
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        showError(parseErrorMessage(err), options?.errorMessage || 'Lỗi');
        options?.onError?.(err);
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [success, showError]
  );

  return { execute, isLoading };
}
