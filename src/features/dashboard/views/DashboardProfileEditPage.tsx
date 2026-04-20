'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Award,
  Briefcase,
  Check,
  Github,
  Globe,
  GraduationCap,
  Languages,
  Linkedin,
  Loader2,
  Plus,
  Trash2,
  User as UserIcon,
  X,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { useProfileEditor } from '@/hooks/useProfileEditor';
import type { RawEducation, RawExperience, RawLanguage, RawCertificate } from '@/hooks/useProfileEditor';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({
  label,
  children,
  className = '',
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 disabled:bg-gray-50 disabled:text-gray-400';

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  error,
  children,
}: {
  icon: typeof UserIcon;
  title: string;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <Icon size={16} className="text-blue-600" strokeWidth={2.5} />
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-600">{title}</h2>
      </div>
      <div className="p-6 space-y-4">
        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {error}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}

// ─── Inline save button ───────────────────────────────────────────────────────

function SaveRowBtn({
  loading,
  saved,
  onClick,
}: {
  loading: boolean;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
    >
      {loading ? (
        <Loader2 size={12} className="animate-spin" />
      ) : saved ? (
        <Check size={12} />
      ) : null}
      {saved ? 'Đã lưu' : 'Lưu'}
    </button>
  );
}

// ─── Education row ────────────────────────────────────────────────────────────

function EducationRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: RawEducation;
  onUpdate: (id: number | string, data: Partial<RawEducation>) => Promise<unknown>;
  onDelete: (id: number | string) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<RawEducation>>({
    universityName: String(item.universityName ?? ''),
    fieldOfStudy: String(item.fieldOfStudy ?? item.degree ?? ''),
    startDate: String(item.startDate ?? ''),
    endDate: String(item.endDate ?? ''),
    gpa: item.gpa,
    description: String(item.description ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof RawEducation) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = async () => {
    if (!item.id) return;
    setSaving(true);
    try {
      await onUpdate(item.id, form);
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    if (!confirm('Xóa mục học vấn này?')) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Trường / Đại học" className="sm:col-span-2">
          <input className={inputCls} value={form.universityName ?? ''} onChange={set('universityName')} placeholder="Đại học Bách Khoa Hà Nội" />
        </Field>
        <Field label="Chuyên ngành / Bằng cấp">
          <input className={inputCls} value={form.fieldOfStudy ?? ''} onChange={set('fieldOfStudy')} placeholder="Công nghệ thông tin" />
        </Field>
        <Field label="GPA">
          <input className={inputCls} type="number" step="0.01" min={0} max={4} value={form.gpa ?? ''} onChange={(e) => { setSaved(false); setForm((p) => ({ ...p, gpa: e.target.value ? parseFloat(e.target.value) : undefined })); }} placeholder="3.5" />
        </Field>
        <Field label="Ngày bắt đầu">
          <input className={inputCls} value={form.startDate ?? ''} onChange={set('startDate')} placeholder="2020-09-01" />
        </Field>
        <Field label="Ngày kết thúc">
          <input className={inputCls} value={form.endDate ?? ''} onChange={set('endDate')} placeholder="2024-06-30" />
        </Field>
        <Field label="Mô tả" className="sm:col-span-2">
          <textarea className={inputCls} rows={2} value={form.description ?? ''} onChange={set('description')} />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-1">
        <SaveRowBtn loading={saving} saved={saved} onClick={handleSave} />
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Xóa
        </button>
      </div>
    </div>
  );
}

// ─── Language row ─────────────────────────────────────────────────────────────

const LANGUAGE_LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Bản ngữ'];

function LanguageRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: RawLanguage;
  onUpdate: (id: number | string, data: Partial<RawLanguage>) => Promise<unknown>;
  onDelete: (id: number | string) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<RawLanguage>>({
    language: String(item.language ?? item.name ?? ''),
    level: String(item.level ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof RawLanguage) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = async () => {
    if (!item.id) return;
    setSaving(true);
    try {
      await onUpdate(item.id, form);
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    if (!confirm('Xóa ngôn ngữ này?')) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50/60 p-3">
      <input
        className={`${inputCls} flex-1`}
        value={form.language ?? ''}
        onChange={set('language')}
        placeholder="Tiếng Anh"
      />
      <select
        className={`${inputCls} w-32`}
        value={form.level ?? ''}
        onChange={set('level')}
      >
        <option value="">-- Trình độ</option>
        {LANGUAGE_LEVELS.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>
      <SaveRowBtn loading={saving} saved={saved} onClick={handleSave} />
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="text-red-400 hover:text-red-600 disabled:opacity-50"
        title="Xóa"
      >
        {deleting ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
      </button>
    </div>
  );
}

// ─── Experience row ───────────────────────────────────────────────────────────

function ExperienceRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: RawExperience;
  onUpdate: (id: number | string, data: Partial<RawExperience>) => Promise<unknown>;
  onDelete: (id: number | string) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<RawExperience>>({
    company: String(item.company ?? item.organization ?? ''),
    position: String(item.position ?? item.role ?? item.title ?? ''),
    startDate: String(item.startDate ?? ''),
    endDate: String(item.endDate ?? ''),
    isCurrent: item.isCurrent ?? false,
    description: String(item.description ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof RawExperience) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = async () => {
    if (!item.id) return;
    setSaving(true);
    try {
      await onUpdate(item.id, form);
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    if (!confirm('Xóa kinh nghiệm này?')) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Công ty / Tổ chức" className="sm:col-span-2">
          <input className={inputCls} value={form.company ?? ''} onChange={set('company')} placeholder="Google, FPT Software…" />
        </Field>
        <Field label="Vị trí / Vai trò">
          <input className={inputCls} value={form.position ?? ''} onChange={set('position')} placeholder="Frontend Developer" />
        </Field>
        <Field label="Ngày bắt đầu">
          <input className={inputCls} value={form.startDate ?? ''} onChange={set('startDate')} placeholder="2023-01-01" />
        </Field>
        <Field label="Ngày kết thúc">
          <input
            className={inputCls}
            value={form.endDate ?? ''}
            onChange={set('endDate')}
            placeholder={form.isCurrent ? '— Hiện tại' : '2024-12-31'}
            disabled={!!form.isCurrent}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={!!form.isCurrent}
            onChange={(e) => { setSaved(false); setForm((p) => ({ ...p, isCurrent: e.target.checked, endDate: e.target.checked ? '' : p.endDate })); }}
            className="rounded border-gray-300 text-blue-600"
          />
          Đang làm hiện tại
        </label>
        <Field label="Mô tả" className="sm:col-span-2">
          <textarea className={inputCls} rows={3} value={form.description ?? ''} onChange={set('description')} />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-1">
        <SaveRowBtn loading={saving} saved={saved} onClick={handleSave} />
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Xóa
        </button>
      </div>
    </div>
  );
}

// ─── Certificate row ──────────────────────────────────────────────────────────

function CertificateRow({
  item,
  onUpdate,
  onDelete,
}: {
  item: RawCertificate;
  onUpdate: (id: number | string, data: Partial<RawCertificate>) => Promise<unknown>;
  onDelete: (id: number | string) => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<RawCertificate>>({
    name: String(item.name ?? item.title ?? ''),
    issuingOrganization: String(item.issuingOrganization ?? ''),
    issueDate: String(item.issueDate ?? ''),
    expiryDate: String(item.expiryDate ?? ''),
    credentialId: String(item.credentialId ?? ''),
    credentialUrl: String(item.credentialUrl ?? ''),
    description: String(item.description ?? ''),
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof RawCertificate) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSaved(false);
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSave = async () => {
    if (!item.id) return;
    setSaving(true);
    try {
      await onUpdate(item.id, form);
      setSaved(true);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!item.id) return;
    if (!confirm('Xóa chứng chỉ này?')) return;
    setDeleting(true);
    try {
      await onDelete(item.id);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-100 bg-gray-50/60 p-4 space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tên chứng chỉ" className="sm:col-span-2">
          <input className={inputCls} value={form.name ?? ''} onChange={set('name')} placeholder="AWS Cloud Practitioner" />
        </Field>
        <Field label="Tổ chức cấp">
          <input className={inputCls} value={form.issuingOrganization ?? ''} onChange={set('issuingOrganization')} placeholder="Amazon Web Services" />
        </Field>
        <Field label="Ngày cấp">
          <input className={inputCls} value={form.issueDate ?? ''} onChange={set('issueDate')} placeholder="2024-03-15" />
        </Field>
        <Field label="Ngày hết hạn">
          <input className={inputCls} value={form.expiryDate ?? ''} onChange={set('expiryDate')} placeholder="2027-03-15" />
        </Field>
        <Field label="Credential ID">
          <input className={inputCls} value={form.credentialId ?? ''} onChange={set('credentialId')} />
        </Field>
        <Field label="URL xác minh" className="sm:col-span-2">
          <input className={inputCls} value={form.credentialUrl ?? ''} onChange={set('credentialUrl')} placeholder="https://…" />
        </Field>
      </div>
      <div className="flex items-center justify-between pt-1">
        <SaveRowBtn loading={saving} saved={saved} onClick={handleSave} />
        <button
          type="button"
          onClick={handleDelete}
          disabled={deleting}
          className="inline-flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
        >
          {deleting ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} />}
          Xóa
        </button>
      </div>
    </div>
  );
}

// ─── Add new forms ────────────────────────────────────────────────────────────

function AddEducationForm({ onAdd }: { onAdd: (d: Omit<RawEducation, 'id'>) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ universityName: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' });
  const [saving, setSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd({ ...form, gpa: form.gpa ? parseFloat(form.gpa) : undefined });
      setForm({ universityName: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '', description: '' });
      setOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
      <Plus size={14} /> Thêm học vấn
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-3">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Thêm mới</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Trường" className="sm:col-span-2"><input required className={inputCls} value={form.universityName} onChange={set('universityName')} /></Field>
        <Field label="Chuyên ngành"><input className={inputCls} value={form.fieldOfStudy} onChange={set('fieldOfStudy')} /></Field>
        <Field label="GPA"><input className={inputCls} type="number" step="0.01" min={0} max={4} value={form.gpa} onChange={set('gpa')} /></Field>
        <Field label="Từ"><input className={inputCls} value={form.startDate} onChange={set('startDate')} placeholder="2020-09-01" /></Field>
        <Field label="Đến"><input className={inputCls} value={form.endDate} onChange={set('endDate')} placeholder="2024-06-30" /></Field>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving && <Loader2 size={12} className="animate-spin" />} Lưu
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Hủy</button>
      </div>
    </form>
  );
}

function AddLanguageForm({ onAdd }: { onAdd: (d: Omit<RawLanguage, 'id'>) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [language, setLanguage] = useState('');
  const [level, setLevel] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd({ language, level });
      setLanguage(''); setLevel(''); setOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
      <Plus size={14} /> Thêm ngôn ngữ
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-lg border border-blue-200 bg-blue-50/30 p-4">
      <Field label="Ngôn ngữ">
        <input required className={`${inputCls} w-40`} value={language} onChange={(e) => setLanguage(e.target.value)} placeholder="Tiếng Anh" />
      </Field>
      <Field label="Trình độ">
        <select className={`${inputCls} w-32`} value={level} onChange={(e) => setLevel(e.target.value)}>
          <option value="">-- Chọn</option>
          {LANGUAGE_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </Field>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving && <Loader2 size={12} className="animate-spin" />} Thêm
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">Hủy</button>
      </div>
    </form>
  );
}

function AddExperienceForm({ onAdd }: { onAdd: (d: Omit<RawExperience, 'id'>) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' });
  const [saving, setSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setForm({ company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '' });
      setOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
      <Plus size={14} /> Thêm kinh nghiệm
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-3">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Thêm mới</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Công ty" className="sm:col-span-2"><input required className={inputCls} value={form.company} onChange={set('company')} /></Field>
        <Field label="Vị trí"><input className={inputCls} value={form.position} onChange={set('position')} placeholder="Frontend Developer" /></Field>
        <Field label="Ngày bắt đầu"><input className={inputCls} value={form.startDate} onChange={set('startDate')} placeholder="2023-01-01" /></Field>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" checked={form.isCurrent} onChange={(e) => setForm((p) => ({ ...p, isCurrent: e.target.checked }))} className="rounded border-gray-300" />
          Hiện tại
        </label>
        {!form.isCurrent && (
          <Field label="Ngày kết thúc"><input className={inputCls} value={form.endDate} onChange={set('endDate')} placeholder="2024-12-31" /></Field>
        )}
        <Field label="Mô tả" className="sm:col-span-2">
          <textarea className={inputCls} rows={2} value={form.description} onChange={set('description')} />
        </Field>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving && <Loader2 size={12} className="animate-spin" />} Lưu
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600">Hủy</button>
      </div>
    </form>
  );
}

function AddCertificateForm({ onAdd }: { onAdd: (d: Omit<RawCertificate, 'id'>) => Promise<unknown> }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
  const [saving, setSaving] = useState(false);

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onAdd(form);
      setForm({ name: '', issuingOrganization: '', issueDate: '', expiryDate: '', credentialId: '', credentialUrl: '' });
      setOpen(false);
    } catch {
    } finally {
      setSaving(false);
    }
  };

  if (!open) return (
    <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
      <Plus size={14} /> Thêm chứng chỉ
    </button>
  );

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-blue-200 bg-blue-50/30 p-4 space-y-3">
      <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Thêm mới</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Tên chứng chỉ" className="sm:col-span-2"><input required className={inputCls} value={form.name} onChange={set('name')} placeholder="AWS Cloud Practitioner" /></Field>
        <Field label="Tổ chức cấp"><input className={inputCls} value={form.issuingOrganization} onChange={set('issuingOrganization')} /></Field>
        <Field label="Ngày cấp"><input className={inputCls} value={form.issueDate} onChange={set('issueDate')} placeholder="2024-03-15" /></Field>
        <Field label="Ngày hết hạn"><input className={inputCls} value={form.expiryDate} onChange={set('expiryDate')} placeholder="2027-03-15" /></Field>
        <Field label="Credential ID"><input className={inputCls} value={form.credentialId} onChange={set('credentialId')} /></Field>
        <Field label="URL xác minh" className="sm:col-span-2"><input className={inputCls} value={form.credentialUrl} onChange={set('credentialUrl')} placeholder="https://…" /></Field>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60">
          {saving && <Loader2 size={12} className="animate-spin" />} Lưu
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-gray-600">Hủy</button>
      </div>
    </form>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export function DashboardProfileEditPage() {
  const { profile, loading: profileLoading, error: ctxError, refreshProfile } = useUser();

  const editor = useProfileEditor();

  // ── Basic profile form state ──────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [headline, setHeadline] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  const initialized = useRef(false);

  useEffect(() => {
    if (!profile || initialized.current) return;
    initialized.current = true;
    const parts = (profile.name ?? '').trim().split(/\s+/);
    setFirstName(parts.slice(0, -1).join(' ') || parts[0] || '');
    setLastName(parts.length > 1 ? parts[parts.length - 1] : '');
    setBio(profile.bio ?? '');
    setHeadline(profile.mentorInfo?.headline ?? '');
    setGithub(profile.socialLinks?.github ?? '');
    setLinkedin(profile.socialLinks?.linkedin ?? '');
    setWebsite(profile.socialLinks?.website ?? '');
  }, [profile]);

  const handleSaveProfile = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      await editor.saveProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        bio: bio.trim() || undefined,
        headline: headline.trim() || undefined,
        socialLinks: {
          github: github.trim() || undefined,
          linkedin: linkedin.trim() || undefined,
          website: website.trim() || undefined,
        },
      });
      await refreshProfile();
    },
    [bio, editor, firstName, github, headline, lastName, linkedin, refreshProfile, website],
  );

  if (profileLoading && !profile) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <LoadingSpinner label="Đang tải hồ sơ…" />
      </div>
    );
  }

  if (ctxError && !profile) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800">
        {ctxError}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cập nhật hồ sơ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Thông tin hiển thị với mentor và trên hồ sơ công khai.
          </p>
        </div>
        <Link
          href={profile?.id ? `/profile/${profile.id}` : '/profile'}
          className="text-sm font-medium text-blue-600 hover:underline shrink-0"
        >
          Xem hồ sơ công khai →
        </Link>
      </div>

      {/* ── BASIC PROFILE ───────────────────────────────────────────────────── */}
      <form onSubmit={handleSaveProfile}>
        <Section icon={UserIcon} title="Thông tin cơ bản" error={editor.profileError}>
          {editor.profileSavedAt && (
            <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
              ✓ Đã lưu hồ sơ
            </p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Họ">
              <input className={inputCls} value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Nguyễn" />
            </Field>
            <Field label="Tên">
              <input className={inputCls} value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Văn A" />
            </Field>
            <Field label="Email" className="sm:col-span-2">
              <input className={inputCls} value={profile?.email ?? ''} readOnly disabled />
            </Field>
            <Field label="Giới thiệu (bio)" className="sm:col-span-2">
              <textarea
                className={inputCls}
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Mục tiêu học tập, sở thích kỹ thuật, hướng nghiệp…"
              />
            </Field>
            <Field label="Tiêu đề mentor (nếu có)" className="sm:col-span-2">
              <input className={inputCls} value={headline} onChange={(e) => setHeadline(e.target.value)} placeholder="Full-stack · React & Spring Boot" />
            </Field>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500 flex items-center gap-1.5">
              <Globe size={12} /> Liên kết
            </p>
            <div className="grid gap-3 sm:grid-cols-1">
              <Field label="GitHub">
                <div className="relative">
                  <Github size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={`${inputCls} pl-8`} value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/username" />
                </div>
              </Field>
              <Field label="LinkedIn">
                <div className="relative">
                  <Linkedin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={`${inputCls} pl-8`} value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/…" />
                </div>
              </Field>
              <Field label="Website / Portfolio">
                <div className="relative">
                  <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className={`${inputCls} pl-8`} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://…" />
                </div>
              </Field>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={editor.profileSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-black disabled:opacity-60 transition-colors"
            >
              {editor.profileSaving && <Loader2 size={14} className="animate-spin" />}
              {editor.profileSaving ? 'Đang lưu…' : 'Lưu hồ sơ'}
            </button>
            <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-gray-900">
              ← Quay lại
            </Link>
          </div>
        </Section>
      </form>

      {/* ── EDUCATION ───────────────────────────────────────────────────────── */}
      <Section icon={GraduationCap} title="Học vấn" error={editor.educationsError}>
        {editor.educationsLoading ? (
          <LoadingSpinner label="Đang tải…" />
        ) : (
          <div className="space-y-3">
            {editor.educations.length === 0 && (
              <p className="text-sm text-gray-400 italic">Chưa có thông tin học vấn.</p>
            )}
            {editor.educations.map((item) => (
              <EducationRow
                key={item.id ?? JSON.stringify(item)}
                item={item}
                onUpdate={editor.updateEducation}
                onDelete={editor.deleteEducation}
              />
            ))}
            <AddEducationForm onAdd={editor.addEducation} />
          </div>
        )}
      </Section>

      {/* ── EXPERIENCE ──────────────────────────────────────────────────────── */}
      <Section icon={Briefcase} title="Kinh nghiệm làm việc" error={editor.experiencesError}>
        {editor.experiencesLoading ? (
          <LoadingSpinner label="Đang tải…" />
        ) : (
          <div className="space-y-3">
            {editor.experiences.length === 0 && (
              <p className="text-sm text-gray-400 italic">Chưa có kinh nghiệm.</p>
            )}
            {editor.experiences.map((item) => (
              <ExperienceRow
                key={item.id ?? JSON.stringify(item)}
                item={item}
                onUpdate={editor.updateExperience}
                onDelete={editor.deleteExperience}
              />
            ))}
            <AddExperienceForm onAdd={editor.addExperience} />
          </div>
        )}
      </Section>

      {/* ── LANGUAGE ────────────────────────────────────────────────────────── */}
      <Section icon={Languages} title="Ngôn ngữ" error={editor.languagesError}>
        {editor.languagesLoading ? (
          <LoadingSpinner label="Đang tải…" />
        ) : (
          <div className="space-y-2">
            {editor.languages.length === 0 && (
              <p className="text-sm text-gray-400 italic">Chưa có ngôn ngữ.</p>
            )}
            {editor.languages.map((item) => (
              <LanguageRow
                key={item.id ?? JSON.stringify(item)}
                item={item}
                onUpdate={editor.updateLanguage}
                onDelete={editor.deleteLanguage}
              />
            ))}
            <AddLanguageForm onAdd={editor.addLanguage} />
          </div>
        )}
      </Section>

      {/* ── CERTIFICATE ─────────────────────────────────────────────────────── */}
      <Section icon={Award} title="Chứng chỉ & Thành tựu" error={editor.certificatesError}>
        {editor.certificatesLoading ? (
          <LoadingSpinner label="Đang tải…" />
        ) : (
          <div className="space-y-3">
            {editor.certificates.length === 0 && (
              <p className="text-sm text-gray-400 italic">Chưa có chứng chỉ.</p>
            )}
            {editor.certificates.map((item) => (
              <CertificateRow
                key={item.id ?? JSON.stringify(item)}
                item={item}
                onUpdate={editor.updateCertificate}
                onDelete={editor.deleteCertificate}
              />
            ))}
            <AddCertificateForm onAdd={editor.addCertificate} />
          </div>
        )}
      </Section>

      <div className="pb-12" />
    </div>
  );
}
