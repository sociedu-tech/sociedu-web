'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { userService } from '@/services/userService';
import { useAuth } from '@/context/AuthContext';
import type { User } from '@/types';

interface UserContextType {
  profile: User | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (payload: Partial<User>) => Promise<void>;
  clearProfile: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearProfile = useCallback(() => {
    setProfile(null);
    setError(null);
    setLoading(false);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (!isAuthenticated) {
      clearProfile();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = (await userService.getMe()) as User;
      setProfile(data ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể tải hồ sơ người dùng.');
    } finally {
      setLoading(false);
    }
  }, [clearProfile, isAuthenticated]);

  const updateProfile = useCallback(
    async (payload: Partial<User>) => {
      setLoading(true);
      setError(null);

      try {
        const updated = (await userService.updateProfile(profile?.id ?? '', payload)) as User;
        setProfile(updated);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Không thể cập nhật hồ sơ.');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [profile?.id],
  );

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  const value = useMemo(
    () => ({
      profile,
      loading,
      error,
      refreshProfile,
      updateProfile,
      clearProfile,
    }),
    [clearProfile, error, loading, profile, refreshProfile, updateProfile],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }

  return context;
};
