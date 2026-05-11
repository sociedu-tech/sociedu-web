'use client';

import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { ToastProvider } from '@/context/ToastContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        const status = error?.status;
        if ([400, 401, 403, 404, 409, 422].includes(status)) return false;
        return failureCount < 2;
      },
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthProvider>
          <UserProvider>
            <WebSocketProvider>
              {children}
            </WebSocketProvider>
          </UserProvider>
        </AuthProvider>
      </ToastProvider>
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
