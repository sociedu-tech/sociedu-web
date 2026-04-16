import React from 'react';
import Image from 'next/image';
import { CheckCircle2, XCircle } from 'lucide-react';
import { User } from '../../types';

interface AdminMentorRequestsProps {
  requests: User[];
  onApprove: (id: string) => void;
}

export const AdminMentorRequests = ({ requests, onApprove }: AdminMentorRequestsProps) => {
  if (requests.length === 0) {
    return <div className="px-6 py-12 text-center text-airbnb-gray italic">Không có yêu cầu nào đang chờ.</div>;
  }

  return (
    <div className="p-0 sm:p-6">
      {/* Desktop Table */}
      <table className="w-full text-left hidden md:table">
        <thead>
          <tr className="bg-gray-50 text-[10px] uppercase tracking-widest text-airbnb-gray font-bold">
            <th className="px-6 py-4">Người dùng</th>
            <th className="px-6 py-4">Chuyên môn</th>
            <th className="px-6 py-4">Ngày yêu cầu</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {requests.map(req => (
            <tr key={req.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Image src={req.avatar} className="w-10 h-10 rounded-full object-cover" alt={req.name} width={40} height={40} unoptimized />
                  <div>
                    <p className="text-sm font-bold text-airbnb-dark">{req.name}</p>
                    <p className="text-xs text-airbnb-gray">{req.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <p className="text-sm text-airbnb-dark font-medium">{req.mentorInfo?.headline}</p>
                <p className="text-xs text-airbnb-gray mt-1">{req.mentorInfo?.expertise.join(', ')}</p>
              </td>
              <td className="px-6 py-4 text-sm text-airbnb-gray">{req.joinedDate}</td>
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
              <Image src={req.avatar} className="w-12 h-12 rounded-full object-cover" alt={req.name} width={48} height={48} unoptimized />
              <div>
                <p className="text-sm font-bold text-airbnb-dark">{req.name}</p>
                <p className="text-xs text-airbnb-gray">{req.email}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest mb-1">Chuyên môn</p>
              <p className="text-sm text-airbnb-dark font-medium">{req.mentorInfo?.headline}</p>
              <p className="text-xs text-airbnb-gray mt-1">{req.mentorInfo?.expertise.join(', ')}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-airbnb-gray">{req.joinedDate}</p>
              <div className="flex gap-2">
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
          </div>
        ))}
      </div>
    </div>
  );
};
