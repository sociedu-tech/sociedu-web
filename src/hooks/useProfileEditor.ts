'use client';

import { useCallback, useEffect, useState } from 'react';
import { userService } from '@/services/userService';
import type {
  RawEducation,
  RawLanguage,
  RawExperience,
  RawCertificate,
} from '@/services/userService';

// ─── Types re-exported for consumers ─────────────────────────────────────────

export type { RawEducation, RawLanguage, RawExperience, RawCertificate };

export interface ProfileBasicForm {
  firstName: string;
  lastName: string;
  bio: string;
  headline: string;
  /** Used for display only (read-only) */
  email: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useProfileEditor() {
  // ── Basic profile ────────────────────────────────────────────────────────────
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSavedAt, setProfileSavedAt] = useState<number | null>(null);

  // ── Educations ───────────────────────────────────────────────────────────────
  const [educations, setEducations] = useState<RawEducation[]>([]);
  const [educationsLoading, setEducationsLoading] = useState(false);
  const [educationsError, setEducationsError] = useState<string | null>(null);

  // ── Languages ────────────────────────────────────────────────────────────────
  const [languages, setLanguages] = useState<RawLanguage[]>([]);
  const [languagesLoading, setLanguagesLoading] = useState(false);
  const [languagesError, setLanguagesError] = useState<string | null>(null);

  // ── Experiences ──────────────────────────────────────────────────────────────
  const [experiences, setExperiences] = useState<RawExperience[]>([]);
  const [experiencesLoading, setExperiencesLoading] = useState(false);
  const [experiencesError, setExperiencesError] = useState<string | null>(null);

  // ── Certificates ─────────────────────────────────────────────────────────────
  const [certificates, setCertificates] = useState<RawCertificate[]>([]);
  const [certificatesLoading, setCertificatesLoading] = useState(false);
  const [certificatesError, setCertificatesError] = useState<string | null>(null);

  // ─── Load all on mount ────────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    setEducationsLoading(true);
    setLanguagesLoading(true);
    setExperiencesLoading(true);
    setCertificatesLoading(true);

    const [edu, lang, exp, cert] = await Promise.allSettled([
      userService.getEducations(),
      userService.getLanguages(),
      userService.getExperiences(),
      userService.getCertificates(),
    ]);

    if (edu.status === 'fulfilled') setEducations(edu.value);
    else setEducationsError('Không thể tải học vấn.');

    if (lang.status === 'fulfilled') setLanguages(lang.value);
    else setLanguagesError('Không thể tải ngôn ngữ.');

    if (exp.status === 'fulfilled') setExperiences(exp.value);
    else setExperiencesError('Không thể tải kinh nghiệm.');

    if (cert.status === 'fulfilled') setCertificates(cert.value);
    else setCertificatesError('Không thể tải chứng chỉ.');

    setEducationsLoading(false);
    setLanguagesLoading(false);
    setExperiencesLoading(false);
    setCertificatesLoading(false);
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  // ─── Basic profile ───────────────────────────────────────────────────────────

  const saveProfile = useCallback(async (data: Record<string, unknown>) => {
    setProfileSaving(true);
    setProfileError(null);
    try {
      await userService.updateProfile('', data);
      setProfileSavedAt(Date.now());
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu hồ sơ.';
      setProfileError(msg);
      throw err;
    } finally {
      setProfileSaving(false);
    }
  }, []);

  // ─── Education CRUD ──────────────────────────────────────────────────────────

  const addEducation = useCallback(async (data: Omit<RawEducation, 'id'>) => {
    setEducationsError(null);
    const created = await userService.addEducation(data);
    setEducations((prev) => [...prev, created]);
    return created;
  }, []);

  const updateEducation = useCallback(async (id: number | string, data: Partial<RawEducation>) => {
    setEducationsError(null);
    const updated = await userService.updateEducation(id, data);
    setEducations((prev) => prev.map((e) => (e.id === id ? { ...e, ...updated } : e)));
    return updated;
  }, []);

  const deleteEducation = useCallback(async (id: number | string) => {
    setEducationsError(null);
    await userService.deleteEducation(id);
    setEducations((prev) => prev.filter((e) => e.id !== id));
  }, []);

  // ─── Language CRUD ───────────────────────────────────────────────────────────

  const addLanguage = useCallback(async (data: Omit<RawLanguage, 'id'>) => {
    setLanguagesError(null);
    const created = await userService.addLanguage(data);
    setLanguages((prev) => [...prev, created]);
    return created;
  }, []);

  const updateLanguage = useCallback(async (id: number | string, data: Partial<RawLanguage>) => {
    setLanguagesError(null);
    const updated = await userService.updateLanguage(id, data);
    setLanguages((prev) => prev.map((l) => (l.id === id ? { ...l, ...updated } : l)));
    return updated;
  }, []);

  const deleteLanguage = useCallback(async (id: number | string) => {
    setLanguagesError(null);
    await userService.deleteLanguage(id);
    setLanguages((prev) => prev.filter((l) => l.id !== id));
  }, []);

  // ─── Experience CRUD ─────────────────────────────────────────────────────────

  const addExperience = useCallback(async (data: Omit<RawExperience, 'id'>) => {
    setExperiencesError(null);
    const created = await userService.addExperience(data);
    setExperiences((prev) => [...prev, created]);
    return created;
  }, []);

  const updateExperience = useCallback(async (id: number | string, data: Partial<RawExperience>) => {
    setExperiencesError(null);
    const updated = await userService.updateExperience(id, data);
    setExperiences((prev) => prev.map((ex) => (ex.id === id ? { ...ex, ...updated } : ex)));
    return updated;
  }, []);

  const deleteExperience = useCallback(async (id: number | string) => {
    setExperiencesError(null);
    await userService.deleteExperience(id);
    setExperiences((prev) => prev.filter((ex) => ex.id !== id));
  }, []);

  // ─── Certificate CRUD ────────────────────────────────────────────────────────

  const addCertificate = useCallback(async (data: Omit<RawCertificate, 'id'>) => {
    setCertificatesError(null);
    const created = await userService.addCertificate(data);
    setCertificates((prev) => [...prev, created]);
    return created;
  }, []);

  const updateCertificate = useCallback(async (id: number | string, data: Partial<RawCertificate>) => {
    setCertificatesError(null);
    const updated = await userService.updateCertificate(id, data);
    setCertificates((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    return updated;
  }, []);

  const deleteCertificate = useCallback(async (id: number | string) => {
    setCertificatesError(null);
    await userService.deleteCertificate(id);
    setCertificates((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    // Profile basic
    profileSaving,
    profileError,
    profileSavedAt,
    saveProfile,

    // Education
    educations,
    educationsLoading,
    educationsError,
    addEducation,
    updateEducation,
    deleteEducation,

    // Language
    languages,
    languagesLoading,
    languagesError,
    addLanguage,
    updateLanguage,
    deleteLanguage,

    // Experience
    experiences,
    experiencesLoading,
    experiencesError,
    addExperience,
    updateExperience,
    deleteExperience,

    // Certificate
    certificates,
    certificatesLoading,
    certificatesError,
    addCertificate,
    updateCertificate,
    deleteCertificate,

    // Reload everything
    reload: loadAll,
  };
}
