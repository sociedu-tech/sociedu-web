'use client';

import { AuthProvider } from '@/context/AuthContext';
import { UserProvider } from '@/context/UserContext';
import { WebSocketProvider } from '@/context/WebSocketContext';
import { ToastProvider } from '@/context/ToastContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <UserProvider>
          <WebSocketProvider>
            {children}
          </WebSocketProvider>
        </UserProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
