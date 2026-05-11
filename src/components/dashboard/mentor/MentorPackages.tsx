import React from 'react';
import { Plus, Trash2, Edit3, Power, ArchiveRestore } from 'lucide-react';
import { ServicePackage } from '@/types';

interface MentorPackagesProps {
  packages: ServicePackage[];
  isArchivedView: boolean;
  onAdd: () => void;
  onToggleActive: (id: string) => void;
  onArchive: (id: string) => void;
  isMutating: boolean;
}

export const MentorPackages = ({ 
  packages, 
  isArchivedView, 
  onAdd, 
  onToggleActive, 
  onArchive,
  isMutating
}: MentorPackagesProps) => {
  return (
    <div className="space-y-6">
      {!isArchivedView && (
        <div className="flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onAdd}
            disabled={isMutating}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
          >
            <Plus size={16} /> Thêm gói
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {packages.map((pkg) => {
          const defaultVersion = pkg.versions?.find(v => v.isDefault) || pkg.versions?.[0];
          
          return (
            <div key={pkg.id} className={`group relative space-y-4 rounded-2xl border ${pkg.isActive ? 'border-primary/30 shadow-sm' : 'border-slate-200/90'} bg-white p-6 transition-colors hover:border-slate-300/90`}>
              <div className="absolute top-4 right-4 flex gap-2">
                {!isArchivedView ? (
                  <>
                    <button 
                      onClick={() => onToggleActive(pkg.id)}
                      disabled={isMutating}
                      title={pkg.isActive ? "Tạm ẩn gói" : "Bật hiển thị gói"}
                      className={`p-2 rounded-lg transition-all disabled:opacity-50 ${pkg.isActive ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:text-green-500 hover:bg-slate-50'}`}
                    >
                      <Power size={16} />
                    </button>
                    <button 
                      onClick={() => onArchive(pkg.id)}
                      disabled={isMutating}
                      title="Lưu trữ"
                      className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </>
                ) : (
                  <button 
                    // For now map restore to unarchive if backend supports it, else just placeholder
                    onClick={() => alert("Tính năng khôi phục đang phát triển")} 
                    title="Khôi phục"
                    className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-all"
                  >
                    <ArchiveRestore size={16} />
                  </button>
                )}
              </div>
              
              <div className="pt-2">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="font-semibold text-gray-900 text-lg">{pkg.name}</h3>
                  {pkg.isActive ? (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider">Đang bán</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">Tạm ẩn</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 line-clamp-2">{pkg.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Thông tin phiên bản</p>
                {defaultVersion ? (
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xl font-bold text-primary">{defaultVersion.price.toLocaleString('vi-VN')} ₫</p>
                      <p className="text-xs text-gray-500">/ {defaultVersion.durationInMinutes} phút</p>
                    </div>
                    <button className="text-xs font-medium text-slate-600 hover:text-primary flex items-center gap-1 bg-slate-50 px-2 py-1.5 rounded-md border border-slate-200">
                      <Edit3 size={12} /> Cập nhật
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-orange-50 text-orange-700 p-3 rounded-lg border border-orange-100">
                    <span className="text-sm">Chưa có phiên bản</span>
                    <button className="text-xs font-semibold bg-white px-2 py-1 rounded shadow-sm border border-orange-200 hover:bg-orange-100 transition-colors">
                      Thiết lập
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {packages.length === 0 && (
          <div className="col-span-full py-16 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50/50">
            <Edit3 size={40} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium text-lg">Bạn chưa có gói dịch vụ nào {isArchivedView ? 'đã lưu trữ' : ''}.</p>
            {!isArchivedView && (
              <button onClick={onAdd} disabled={isMutating} className="mt-4 px-6 py-2 bg-white border border-slate-200 rounded-xl text-primary font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50">
                Tạo gói đầu tiên
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
