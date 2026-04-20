import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { User } from '@/types';
import { userService } from '@/services/userService';

export function useEditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getMe();
        setUser(data);
      } catch (err: unknown) {
        const m = err as { message?: string };
        setError(m?.message ?? 'Lỗi tải');
      } finally {
        setLoading(false);
      }
    };
    void fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    setSaveSuccess(false);
    try {
      await userService.updateProfile(user.id, user);
      setSaveSuccess(true);
      setTimeout(() => router.push(`/profile/${user.id}`), 1500);
    } catch (err: unknown) {
      const m = err as { message?: string };
      setError(m?.message ?? 'Lỗi lưu');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof User, value: unknown) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const updateMentorField = (field: string, value: unknown) => {
    if (!user || !user.mentorInfo) return;
    setUser({
      ...user,
      mentorInfo: { ...user.mentorInfo, [field]: value },
    });
  };

  const addExperience = () => {
    if (!user) return;
    const newExp = { company: '', role: '', duration: '', description: '' };
    setUser({ ...user, experience: [...(user.experience || []), newExp] });
  };

  const removeExperience = (index: number) => {
    if (!user || !user.experience) return;
    const newExp = [...user.experience];
    newExp.splice(index, 1);
    setUser({ ...user, experience: newExp });
  };

  return {
    router,
    loading,
    saving,
    saveSuccess,
    error,
    user,
    handleSave,
    updateField,
    updateMentorField,
    addExperience,
    removeExperience,
  };
}
