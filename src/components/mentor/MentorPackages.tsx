import React from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { MentorPackage } from '../../types';

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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-airbnb-dark tracking-tighter">Gói dịch vụ của bạn</h2>
        <div className="flex gap-2">
          <button 
            onClick={onAdd}
            className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-airbnb-gray hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <Plus size={16} /> Thêm gói mới
          </button>
          <button 
            onClick={onSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center gap-2"
          >
            <Save size={16} /> Lưu thay đổi
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4 relative group">
            <button 
              onClick={() => onRemove(pkg.id)}
              className="absolute top-4 right-4 p-2 text-airbnb-gray hover:text-airbnb-red opacity-0 group-hover:opacity-100 transition-all"
            >
              <Trash2 size={18} />
            </button>
            <div>
              <label className="block text-[10px] font-bold text-airbnb-gray uppercase tracking-widest mb-1">Tên gói</label>
              <input 
                type="text" 
                value={pkg.title}
                onChange={(e) => onUpdate(pkg.id, 'title', e.target.value)}
                className="w-full p-2 bg-gray-50 border border-transparent rounded-lg focus:border-blue-500 focus:bg-white outline-none font-bold text-airbnb-dark"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-airbnb-gray uppercase tracking-widest mb-1">Mô tả</label>
              <textarea 
                value={pkg.description}
                onChange={(e) => onUpdate(pkg.id, 'description', e.target.value)}
                className="w-full p-2 bg-gray-50 border border-transparent rounded-lg focus:border-blue-500 focus:bg-white outline-none text-sm text-airbnb-gray min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-airbnb-gray uppercase tracking-widest mb-1">Giá (VNĐ)</label>
                <input 
                  type="number" 
                  value={pkg.price}
                  onChange={(e) => onUpdate(pkg.id, 'price', parseInt(e.target.value))}
                  className="w-full p-2 bg-gray-50 border border-transparent rounded-lg focus:border-blue-500 focus:bg-white outline-none font-bold text-blue-600"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-airbnb-gray uppercase tracking-widest mb-1">Thời lượng</label>
                <input 
                  type="text" 
                  value={pkg.duration}
                  onChange={(e) => onUpdate(pkg.id, 'duration', e.target.value)}
                  className="w-full p-2 bg-gray-50 border border-transparent rounded-lg focus:border-blue-500 focus:bg-white outline-none font-bold text-airbnb-dark"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
