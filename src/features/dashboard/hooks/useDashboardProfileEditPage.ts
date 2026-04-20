import { useCallback, useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import type { User } from '@/types';

const emptyExp: NonNullable<User['experience']>[number] = {
  company: '',
  role: '',
  duration: '',
  description: '',
};

const emptyProj: NonNullable<User['researchProjects']>[number] = {
  title: '',
  role: '',
  year: '',
  description: '',
};

export function useDashboardProfileEditPage() {
  const { profile, loading, error: ctxError, updateProfile, refreshProfile } = useUser();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [university, setUniversity] = useState('');
  const [major, setMajor] = useState('');
  const [year, setYear] = useState('');
  const [gpa, setGpa] = useState('');
  const [skillsText, setSkillsText] = useState('');
  const [certsText, setCertsText] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');
  const [experiences, setExperiences] = useState([{ ...emptyExp }]);
  const [projects, setProjects] = useState([{ ...emptyProj }]);

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    if (!profile) return;
    setName(profile.name ?? '');
    setBio(profile.bio ?? '');
    setHeadline(profile.mentorInfo?.headline ?? '');
    setUniversity(profile.university ?? '');
    setMajor(profile.major ?? '');
    setYear(profile.year != null ? String(profile.year) : '');
    setGpa(profile.gpa != null ? String(profile.gpa) : '');
    setSkillsText((profile.skills ?? []).join(', '));
    setCertsText((profile.achievements ?? []).join('\n'));
    setGithub(profile.socialLinks?.github ?? '');
    setLinkedin(profile.socialLinks?.linkedin ?? '');
    setWebsite(profile.socialLinks?.website ?? '');
    setExperiences(
      profile.experience && profile.experience.length > 0
        ? profile.experience.map((e) => ({ ...e }))
        : [{ ...emptyExp }],
    );
    setProjects(
      profile.researchProjects && profile.researchProjects.length > 0
        ? profile.researchProjects.map((p) => ({ ...p }))
        : [{ ...emptyProj }],
    );
  }, [profile]);

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setSaveError(null);
      setSaving(true);
      try {
        const skills = skillsText
          .split(/[,;\n]/)
          .map((s) => s.trim())
          .filter(Boolean);
        const achievements = certsText
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        const expClean = experiences
          .filter((x) => x.company.trim() || x.role.trim() || x.description.trim())
          .map((x) => ({
            company: x.company.trim(),
            role: x.role.trim(),
            duration: x.duration.trim(),
            description: x.description.trim(),
          }));
        const projClean = projects
          .filter((x) => x.title.trim() || x.description.trim())
          .map((x) => ({
            title: x.title.trim(),
            role: x.role.trim(),
            year: x.year.trim(),
            description: x.description.trim(),
          }));

        const yearNum = year.trim() ? parseInt(year, 10) : undefined;
        const gpaNum = gpa.trim() ? parseFloat(gpa) : undefined;

        const payload: Partial<User> = {
          name: name.trim(),
          bio: bio.trim() || undefined,
          university: university.trim() || undefined,
          major: major.trim() || undefined,
          year: Number.isFinite(yearNum) ? yearNum : undefined,
          gpa: Number.isFinite(gpaNum) ? gpaNum : undefined,
          skills: skills.length ? skills : undefined,
          achievements: achievements.length ? achievements : undefined,
          experience: expClean.length ? expClean : undefined,
          researchProjects: projClean.length ? projClean : undefined,
          socialLinks: {
            github: github.trim() || undefined,
            linkedin: linkedin.trim() || undefined,
            website: website.trim() || undefined,
          },
        };

        if (profile?.mentorInfo) {
          payload.mentorInfo = {
            ...profile.mentorInfo,
            headline: headline.trim() || profile.mentorInfo.headline,
          };
        } else if (headline.trim()) {
          payload.mentorInfo = {
            headline: headline.trim(),
            expertise: [],
            price: 0,
            rating: 0,
            sessionsCompleted: 0,
            verificationStatus: 'pending',
          };
        }

        await updateProfile(payload);
        setSavedAt(Date.now());
        await refreshProfile();
      } catch (err) {
        setSaveError(err instanceof Error ? err.message : 'Không thể lưu. Thử lại sau.');
      } finally {
        setSaving(false);
      }
    },
    [
      name,
      bio,
      headline,
      university,
      major,
      year,
      gpa,
      skillsText,
      certsText,
      github,
      linkedin,
      website,
      experiences,
      projects,
      profile?.mentorInfo,
      updateProfile,
      refreshProfile,
    ],
  );

  const addExperienceRow = useCallback(() => {
    setExperiences((prev) => [...prev, { ...emptyExp }]);
  }, []);

  const addProjectRow = useCallback(() => {
    setProjects((prev) => [...prev, { ...emptyProj }]);
  }, []);

  return {
    profile,
    loading,
    ctxError,
    name,
    setName,
    bio,
    setBio,
    headline,
    setHeadline,
    university,
    setUniversity,
    major,
    setMajor,
    year,
    setYear,
    gpa,
    setGpa,
    skillsText,
    setSkillsText,
    certsText,
    setCertsText,
    github,
    setGithub,
    linkedin,
    setLinkedin,
    website,
    setWebsite,
    experiences,
    setExperiences,
    projects,
    setProjects,
    saving,
    saveError,
    savedAt,
    onSubmit,
    addExperienceRow,
    addProjectRow,
  };
}
