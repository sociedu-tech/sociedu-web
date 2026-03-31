import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { User as UserType } from '../types';

export const useUserProfile = (userId?: string) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getUserProfile(userId);
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return { user, loading, error, refetch: fetchUser };
};
