import React from 'react';
import { Plus, Trash2, Save, Edit3 } from 'lucide-react';
import { MentorPackage } from '@/types';

interface MentorPackagesProps {
  packages: MentorPackage[];
  onAdd: () => void;
  onRemove: (id: string | number) => void;
  onUpdate: (id: string | number, field: keyof MentorPackage, value: any) => void;
  onSave: () => void;
}

export const MentorPackages = ({ packages, onAdd, onRemove, onUpdate, onSave }: MentorPackagesProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
        >
          <Plus size={16} /> Thêm gói
        </button>
        <button
          type="button"
          onClick={onSave}
          className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-95"
        >
          <Save size={16} /> Lưu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="group relative space-y-4 rounded-2xl border border-slate-200/90 bg-white p-6 transition-colors hover:border-slate-300/90">
            <button 
              onClick={() => onRemove(pkg.id)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
            >
              <Trash2 size={16} />
            </button>
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">Tên gói</label>
              <input 
                type="text" 
                value={pkg.title}
                onChange={(e) => onUpdate(pkg.id, 'title', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none font-medium text-dark text-sm transition-all"
                placeholder="Ví dụ: Tư vấn 1-1"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">Mô tả</label>
              <textarea 
                value={pkg.description}
                onChange={(e) => onUpdate(pkg.id, 'description', e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none text-sm text-gray-700 min-h-[80px] resize-none transition-all"
                placeholder="Mô tả chi tiết nội dung gói..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">Giá (VNĐ)</label>
                <input 
                  type="number" 
                  value={pkg.price}
                  onChange={(e) => onUpdate(pkg.id, 'price', parseInt(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none font-medium text-primary text-sm transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 tracking-wider">Thời lượng</label>
                <input 
                  type="text" 
                  value={pkg.duration}
                  onChange={(e) => onUpdate(pkg.id, 'duration', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:border-primary focus:ring-1 focus:ring-primary focus:bg-white outline-none font-medium text-dark text-sm transition-all"
                  placeholder="Vd: 60 phút"
                />
              </div>
            </div>
          </div>
        ))}
        {packages.length === 0 && (
          <div className="col-span-full py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50">
            <Edit3 size={32} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">Bạn chưa có gói dịch vụ nào.</p>
            <button onClick={onAdd} className="mt-4 text-primary font-medium hover:underline">Thêm gói đầu tiên</button>
          </div>
        )}
      </div>
    </div>
  );
};
