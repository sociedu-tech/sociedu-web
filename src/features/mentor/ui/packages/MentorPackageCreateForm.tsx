'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { servicePackageService } from '@/services/servicePackageService';
import type { CreatePackageCurriculumInput } from '@/features/mentor/types/servicePackage';
import { useToast } from '@/context/ToastContext';
import { DashboardPage, DashboardSurface } from '@/features/dashboard/ui/DashboardPrimitives';

type CurriculumDraft = {
  key: string;
  title: string;
  description: string;
  duration: string;
};

const emptyCurriculum = (): CurriculumDraft => ({
  key: `c-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  title: '',
  description: '',
  duration: '60',
});

export function MentorPackageCreateForm() {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('60');
  const [curriculums, setCurriculums] = useState<CurriculumDraft[]>([emptyCurriculum()]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const addCurriculum = () => {
    setCurriculums((prev) => [...prev, emptyCurriculum()]);
  };

  const removeCurriculum = (key: string) => {
    setCurriculums((prev) => (prev.length <= 1 ? prev : prev.filter((c) => c.key !== key)));
  };

  const updateCurriculum = (key: string, field: keyof CurriculumDraft, value: string) => {
    setCurriculums((prev) => prev.map((c) => (c.key === key ? { ...c, [field]: value } : c)));
  };

  const validate = (): CreatePackageCurriculumInput[] | null => {
    if (!name.trim()) {
      setFormError('Tên gói dịch vụ không được để trống.');
      return null;
    }
    const parsedPrice = Number(price);
    if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
      setFormError('Giá gói dịch vụ không hợp lệ.');
      return null;
    }
    const parsedDuration = Number(duration);
    if (!Number.isInteger(parsedDuration) || parsedDuration < 1) {
      setFormError('Thời lượng gói phải là số phút ≥ 1.');
      return null;
    }

    const mapped: CreatePackageCurriculumInput[] = [];
    for (let i = 0; i < curriculums.length; i++) {
      const item = curriculums[i];
      if (!item.title.trim()) {
        setFormError(`Buổi lộ trình ${i + 1}: tiêu đề không được để trống.`);
        return null;
      }
      const itemDuration = Number(item.duration);
      if (!Number.isInteger(itemDuration) || itemDuration < 1) {
        setFormError(`Buổi lộ trình ${i + 1}: thời lượng phải ≥ 1 phút.`);
        return null;
      }
      mapped.push({
        title: item.title.trim(),
        description: item.description.trim() || undefined,
        orderIndex: i + 1,
        duration: itemDuration,
      });
    }

    setFormError(null);
    return mapped;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const curriculumPayload = validate();
    if (!curriculumPayload) return;

    setSubmitting(true);
    try {
      const created = await servicePackageService.createPackage({
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        duration: Number(duration),
        curriculums: curriculumPayload,
      });
      toast.success('Đã tạo gói dịch vụ thành công.');
      router.push(`/dashboard/packages/${created.id}`);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Không thể tạo gói dịch vụ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardPage>
      <DashboardSurface className="p-4 sm:p-6">
        <form onSubmit={(e) => void handleSubmit(e)} className="mx-auto max-w-3xl space-y-8">
          <section className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Thông tin gói</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Tên gói *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ví dụ: Tư vấn lộ trình học tập"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Mô tả</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="Mô tả ngắn về nội dung và lợi ích của gói..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Giá (VNĐ) *</label>
                <input
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="500000"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-medium text-primary outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-600">Thời lượng (phút) *</label>
                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Lộ trình buổi học</h2>
                <p className="mt-1 text-xs text-slate-500">Mỗi mục là một buổi trong gói mentoring.</p>
              </div>
              <button
                type="button"
                onClick={addCurriculum}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="size-4" />
                Thêm buổi
              </button>
            </div>

            <div className="space-y-3">
              {curriculums.map((item, index) => (
                <div
                  key={item.key}
                  className="rounded-2xl border border-slate-200/90 bg-slate-50/40 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-primary">
                      Buổi {index + 1}
                    </span>
                    {curriculums.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => removeCurriculum(item.key)}
                        className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
                        aria-label="Xóa buổi"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    ) : null}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Tiêu đề *</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateCurriculum(item.key, 'title', e.target.value)}
                        placeholder="Ví dụ: Đánh giá năng lực hiện tại"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Mô tả</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => updateCurriculum(item.key, 'description', e.target.value)}
                        rows={2}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-slate-600">Thời lượng (phút) *</label>
                      <input
                        type="number"
                        min={1}
                        value={item.duration}
                        onChange={(e) => updateCurriculum(item.key, 'duration', e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {formError ? (
            <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-4">
            <Link
              href="/dashboard/packages"
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
              {submitting ? 'Đang tạo…' : 'Tạo gói dịch vụ'}
            </button>
          </div>
        </form>
      </DashboardSurface>
    </DashboardPage>
  );
}
