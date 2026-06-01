'use client';

import React from 'react';
import Link from 'next/link';
import {
  Github,
  Globe,
  Linkedin,
  Plus,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageLoadingState } from '@/components/ui/PageLoadingState';
import { useDashboardProfileEditPage } from '@/features/dashboard/hooks';
import { DashboardPage, DashboardSurface, DashboardViewHeader, dashboardBtnPrimary, dashboardInput, dashboardLabel } from '@/features/dashboard/ui/DashboardPrimitives';

export function DashboardProfileEditPage() {
  const {
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
  } = useDashboardProfileEditPage();

  if (loading || !profile) {
    return <PageLoadingState label="Đang tải hồ sơ…" />;
  }

  if (ctxError && !profile) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {ctxError}
      </div>
    );
  }

  return (
    <DashboardPage>
      <DashboardViewHeader
        eyebrow="Tài khoản"
        title="Cập nhật hồ sơ"
        description="Thông tin hiển thị với mentor và trên hồ sơ công khai (nếu có)."
        action={
          <Link
            href={profile?.id ? `/profile/${profile.id}` : '/profile'}
            className="text-sm font-semibold text-primary hover:underline"
          >
            Xem hồ sơ công khai →
          </Link>
        }
      />

      {savedAt ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          Đã lưu thay đổi.
        </p>
      ) : null}
      {saveError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800">{saveError}</p>
      ) : null}

      <form onSubmit={onSubmit} className="space-y-6">
        <DashboardSurface className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>Họ và tên</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={dashboardInput}
                placeholder="Nguyễn Văn A"
                required
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>Email</span>
              <input
                value={profile?.email ?? ''}
                readOnly
                className="w-full cursor-not-allowed rounded-md border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-500"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>Giới thiệu ngắn</span>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className={cn(dashboardInput, 'resize-y')}
                placeholder="Mục tiêu học tập, sở thích kỹ thuật, hướng nghiệp…"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>
                Tiêu đề mentor (nếu bạn là mentor)
              </span>
              <input
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className={dashboardInput}
                placeholder="Ví dụ: Lập trình viên full-stack · React và Spring Boot"
              />
            </label>
          </div>
        </DashboardSurface>

        <DashboardSurface className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>Trường / Đại học</span>
              <input
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className={dashboardInput}
                placeholder="Đại học Bách Khoa Hà Nội"
              />
            </label>
            <label className="block">
              <span className={dashboardLabel}>Chuyên ngành</span>
              <input
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className={dashboardInput}
                placeholder="Công nghệ thông tin"
              />
            </label>
            <label className="block">
              <span className={dashboardLabel}>Năm tốt nghiệp (dự kiến)</span>
              <input
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                min={1990}
                max={2040}
                className={dashboardInput}
                placeholder="2026"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className={dashboardLabel}>Điểm trung bình (thang 4,0 hoặc hệ trường)</span>
              <input
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                inputMode="decimal"
                className="w-full max-w-xs rounded-md border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
                placeholder="3.45"
              />
            </label>
          </div>
        </DashboardSurface>

        <DashboardSurface className="p-5 sm:p-6">
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
                      className={dashboardInput}
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
                      className={dashboardInput}
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
                      className={dashboardInput}
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
              onClick={addExperienceRow}
              className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              Thêm kinh nghiệm
            </button>
          </div>
        </DashboardSurface>

        <DashboardSurface className="p-5 sm:p-6">
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
                      className={dashboardInput}
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
                      className={dashboardInput}
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
                      className={dashboardInput}
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
              onClick={addProjectRow}
              className="inline-flex items-center gap-2 rounded-md border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              <Plus className="size-4" />
              Thêm dự án
            </button>
          </div>
        </DashboardSurface>

        <DashboardSurface className="p-5 sm:p-6">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Kỹ năng (phân cách bằng dấu phẩy)
            </span>
            <input
              value={skillsText}
              onChange={(e) => setSkillsText(e.target.value)}
              className={dashboardInput}
              placeholder="JavaScript, React, Tiếng Anh B2, …"
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
              className={cn(dashboardInput, 'resize-y')}
              placeholder={'Chứng chỉ AWS Cloud Practitioner\nGiải khuyến khích ICPC miền Bắc\n…'}
            />
          </label>
        </DashboardSurface>

        <DashboardSurface className="p-5 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-1">
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Github className="size-4 text-gray-400" />
                Liên kết GitHub
              </span>
              <input
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                className={dashboardInput}
                placeholder="https://github.com/ten-dang-nhap"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Linkedin className="size-4 text-gray-400" />
                Liên kết LinkedIn
              </span>
              <input
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className={dashboardInput}
                placeholder="https://linkedin.com/in/ten-dang-nhap"
              />
            </label>
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe className="size-4 text-gray-400" />
                Trang web cá nhân
              </span>
              <input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className={dashboardInput}
                placeholder="https://ten-mien-cua-ban.com"
              />
            </label>
          </div>
        </DashboardSurface>

        <div className="flex flex-wrap items-center gap-3 pb-8">
          <button type="submit" disabled={saving} className={cn(dashboardBtnPrimary, 'min-w-[140px]')}>
            {saving ? 'Đang lưu…' : 'Lưu thay đổi'}
          </button>
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-slate-900">
            ← Quay lại tổng quan
          </Link>
        </div>
      </form>
    </DashboardPage>
  );
}
