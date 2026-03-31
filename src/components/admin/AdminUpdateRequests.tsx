import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import { Product } from '../../types';

interface AdminUpdateRequestsProps {
  requests: Product[];
  onApprove: (id: number) => void;
}

export const AdminUpdateRequests = ({ requests, onApprove }: AdminUpdateRequestsProps) => {
  if (requests.length === 0) {
    return <div className="px-6 py-12 text-center text-airbnb-gray italic">Không có yêu cầu cập nhật nào.</div>;
  }

  return (
    <div className="p-0 sm:p-6">
      {/* Desktop Table */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-airbnb-gray font-bold">
            <th className="px-6 py-4">Tài liệu</th>
            <th className="px-6 py-4">Thay đổi</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {requests.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <img src={req.image} className="w-10 h-10 rounded-lg object-cover" alt={req.name} />
                  <p className="text-sm font-bold text-airbnb-dark">{req.name}</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="space-y-1">
                  {req.updateRequest?.price && (
                    <p className="text-xs text-airbnb-gray">Giá: <span className="line-through">{req.price}</span> → <span className="text-green-600 font-bold">{req.updateRequest.price}</span></p>
                  )}
                  {req.updateRequest?.description && (
                    <p className="text-xs text-airbnb-gray italic line-clamp-1">Mô tả mới: {req.updateRequest.description}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onApprove(req.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    <CheckCircle2 size={20} />
                  </button>
                  <button className="p-2 text-airbnb-red hover:bg-red-50 rounded-lg transition-colors">
                    <XCircle size={20} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-100">
        {requests.map(req => (
          <div key={req.id} className="p-4 space-y-4">
            <div className="flex items-center gap-3">
              <img src={req.image} className="w-12 h-12 rounded-xl object-cover" alt={req.name} />
              <p className="text-sm font-bold text-airbnb-dark">{req.name}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-xl space-y-2">
              <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Thay đổi</p>
              {req.updateRequest?.price && (
                <p className="text-xs text-airbnb-gray">Giá: <span className="line-through">{req.price}</span> → <span className="text-green-600 font-bold">{req.updateRequest.price}</span></p>
              )}
              {req.updateRequest?.description && (
                <p className="text-xs text-airbnb-gray italic">Mô tả mới: {req.updateRequest.description}</p>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => onApprove(req.id)}
                className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-bold flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> Duyệt
              </button>
              <button className="px-4 py-2 bg-red-50 text-airbnb-red rounded-xl text-xs font-bold flex items-center gap-2">
                <XCircle size={16} /> Từ chối
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
