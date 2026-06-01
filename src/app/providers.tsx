'use client';

import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { ToastProvider } from '@/context/ToastContext';
import { StompProvider } from '@/context/StompProvider';
import { NotificationToastContainer } from '@/components/dashboard/NotificationToast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <StompProvider>
          <UserProvider>{children}</UserProvider>
          <NotificationToastContainer />
        </StompProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
