'use client';

import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { UserProvider } from '@/context/UserContext';
import { WebSocketProvider } from '@/context/WebSocketContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <UserProvider>
        <WebSocketProvider>
          <CartProvider>{children}</CartProvider>
        </WebSocketProvider>
      </UserProvider>
    </AuthProvider>
  );
}
