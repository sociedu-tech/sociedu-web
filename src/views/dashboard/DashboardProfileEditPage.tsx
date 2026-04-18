'use client';

import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  BookOpen,
  Briefcase,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Plus,
  Trash2,
  User,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import type { User } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

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

export function DashboardProfileEditPage() {
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

  if (loading && !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Đang tải hồ sơ…" />
      </div>
    );
  }

  if (ctxError && !profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {ctxError}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">Cập nhật hồ sơ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Thông tin hiển thị với mentor và trên hồ sơ công khai (nếu có).
          </p>
        </div>
        <Link
          href={profile?.id ? `/profile/${profile.id}` : '/profile'}
          className="text-sm font-medium text-primary hover:underline"
        >
          Xem hồ sơ công khai →
        </Link>
      </div>

      {savedAt ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          Đã lưu thay đổi.
        </p>
      ) : null}
      {saveError ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-800">{saveError}</p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <User className="size-4" strokeWidth={2} />
            Thông tin cơ bản
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Họ và tên</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Nguyễn Văn A"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Email</span>
              <input
                value={profile?.email ?? ''}
                readOnly
                className="w-full cursor-not-allowed rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Giới thiệu ngắn (bio)</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Mục tiêu học tập, sở thích kỹ thuật, hướng nghiệp…"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">
                Tiêu đề mentor (nếu bạn là mentor)
              </span>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Ví dụ: Full-stack · React & Spring Boot"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <GraduationCap className="size-4" strokeWidth={2} />
            Học vấn
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">Trường / Đại học</span>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Đại học Bách Khoa Hà Nội"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Chuyên ngành</span>
              <input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="Công nghệ thông tin"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm font-medium text-gray-700">Năm tốt nghiệp (dự kiến)</span>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                min={1990}
                max={2040}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="2026"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1 block text-sm font-medium text-gray-700">GPA (thang 4.0 hoặc hệ trường)</span>
              <input
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                inputMode="decimal"
                className="w-full max-w-xs rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="3.45"
              />
            </label>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Briefcase className="size-4" strokeWidth={2} />
            Kinh nghiệm & công việc
          </h2>
          <div className="space-y-4">
            {experiences.map((row, i) => (
              <div
                key={i}
                className="relative rounded-md border border-gray-100 bg-gray-50/80 p-4"
              >
                <div className="mb-3 flex justify-end">
                  {experiences.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setExperiences((prev) => prev.filter((_, j) => j !== i))}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5" />
                      Xóa
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Công ty / Tổ chức</span>
                    <input
                      value={row.company}
                      onChange={(e) => {
                        const v = e.target.value;
                        setExperiences((prev) => prev.map((r, j) => (j === i ? { ...r, company: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Vai trò</span>
                    <input
                      value={row.role}
                      onChange={(e) => {
                        const v = e.target.value;
                        setExperiences((prev) => prev.map((r, j) => (j === i ? { ...r, role: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Thời gian</span>
                    <input
                      value={row.duration}
                      onChange={(e) => {
                        const v = e.target.value;
                        setExperiences((prev) => prev.map((r, j) => (j === i ? { ...r, duration: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="2023 — 2024"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Mô tả</span>
                    <textarea
                      value={row.description}
                      onChange={(e) => {
                        const v = e.target.value;
                        setExperiences((prev) => prev.map((r, j) => (j === i ? { ...r, description: v } : r)));
                      }}
                      rows={3}
                      className="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setExperiences((prev) => [...prev, { ...emptyExp }])}
              className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              Thêm kinh nghiệm
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <BookOpen className="size-4" strokeWidth={2} />
            Dự án & nghiên cứu
          </h2>
          <div className="space-y-4">
            {projects.map((row, i) => (
              <div key={i} className="relative rounded-md border border-gray-100 bg-gray-50/80 p-4">
                <div className="mb-3 flex justify-end">
                  {projects.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => setProjects((prev) => prev.filter((_, j) => j !== i))}
                      className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5" />
                      Xóa
                    </button>
                  ) : null}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Tên đề tài / dự án</span>
                    <input
                      value={row.title}
                      onChange={(e) => {
                        const v = e.target.value;
                        setProjects((prev) => prev.map((r, j) => (j === i ? { ...r, title: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Vai trò</span>
                    <input
                      value={row.role}
                      onChange={(e) => {
                        const v = e.target.value;
                        setProjects((prev) => prev.map((r, j) => (j === i ? { ...r, role: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Năm</span>
                    <input
                      value={row.year}
                      onChange={(e) => {
                        const v = e.target.value;
                        setProjects((prev) => prev.map((r, j) => (j === i ? { ...r, year: v } : r)));
                      }}
                      className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="2025"
                    />
                  </label>
                  <label className="block sm:col-span-2">
                    <span className="mb-1 block text-xs font-medium text-gray-600">Mô tả</span>
                    <textarea
                      value={row.description}
                      onChange={(e) => {
                        const v = e.target.value;
                        setProjects((prev) => prev.map((r, j) => (j === i ? { ...r, description: v } : r)));
                      }}
                      rows={3}
                      className="w-full resize-y rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />
                  </label>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setProjects((prev) => [...prev, { ...emptyProj }])}
              className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              Thêm dự án
            </button>
          </div>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Award className="size-4" strokeWidth={2} />
            Kỹ năng & chứng chỉ
          </h2>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Kỹ năng (phân cách bằng dấu phẩy)
            </span>
            <input
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="TypeScript, React, Tiếng Anh B2, …"
            />
          </label>
          <label className="mt-4 block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Chứng chỉ & giải thưởng (mỗi dòng một mục)
            </span>
            <textarea
              value={certsText}
              onChange={(e) => setCertsText(e.target.value)}
              rows={5}
              className="w-full resize-y rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder={'AWS Cloud Practitioner\nICPC Regional — Honorable\n…'}
            />
          </label>
        </section>

        <section className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
            <Globe className="size-4" strokeWidth={2} />
            Liên kết
          </h2>
          <div className="grid gap-4 sm:grid-cols-1">
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Github className="size-4 text-gray-400" />
                GitHub
              </span>
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="https://github.com/username"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Linkedin className="size-4 text-gray-400" />
                LinkedIn
              </span>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="https://linkedin.com/in/…"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe className="size-4 text-gray-400" />
                Website / Portfolio
              </span>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="https://…"
              />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap items-center gap-3 pb-8">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary min-w-[140px] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
          <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
            ← Quay lại tổng quan
          </Link>
        </div>
      </form>
    </div>
  );
}
