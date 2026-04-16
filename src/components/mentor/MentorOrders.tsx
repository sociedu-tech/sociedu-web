import React from 'react';
import { 
  ShoppingBag, CheckCircle2, Clock, XCircle, 
  Search, Eye, MessageSquare, MoreVertical,
  AlertCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const MentorOrders = () => {
  const orders = [
    { id: 'ORD-001', mentee: 'Nguyễn Văn A', package: 'Tư vấn sự nghiệp IT', amount: 500000, date: '02/04/2026', status: 'Chờ xác nhận', urgency: 'Cao' },
    { id: 'ORD-002', mentee: 'Trần Thị B', package: 'Review Code React', amount: 300000, date: '01/04/2026', status: 'Đã xác nhận', urgency: 'Bình thường' },
    { id: 'ORD-003', mentee: 'Lê Văn C', package: 'Khóa học Design UI/UX', amount: 1500000, date: '30/03/2026', status: 'Hoàn thành', urgency: 'Thấp' },
    { id: 'ORD-004', mentee: 'Phạm Minh D', package: 'Tư vấn học bổng', amount: 200000, date: '28/03/2026', status: 'Đã hủy', urgency: 'Bình thường' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-semibold text-dark">Quản lý Đơn hàng</h2>
        <div className="flex gap-3 w-full sm:w-auto">
           <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm mã đơn, tên mentee..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {order.status === 'Chờ xác nhận' && (
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
            )}
            
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  order.status === 'Chờ xác nhận' ? "bg-red-50 border-red-100 text-red-600" :
                  order.status === 'Đã xác nhận' ? "bg-blue-50 border-blue-100 text-blue-600" :
                  order.status === 'Hoàn thành' ? "bg-green-50 border-green-100 text-green-600" :
                  "bg-gray-50 border-gray-100 text-gray-500"
                )}>
                  <ShoppingBag size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-500 tracking-wider">{order.id}</span>
                    {order.urgency === 'Cao' && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-md">
                        <AlertCircle size={10} /> Khẩn cấp
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-dark text-base">{order.package}</h3>
                  <p className="text-sm text-gray-500">Người đặt: <span className="text-dark font-medium">{order.mentee}</span></p>
                </div>
              </div>

              <div className="flex flex-wrap lg:flex-nowrap items-center gap-6 lg:gap-12 bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                <div>
                   <p className="text-xs font-medium text-gray-500 mb-1">Ngày đặt</p>
                   <p className="text-sm font-semibold text-dark">{order.date}</p>
                </div>
                <div>
                   <p className="text-xs font-medium text-gray-500 mb-1">Số tiền</p>
                   <p className="text-sm font-bold text-primary">{order.amount.toLocaleString()}đ</p>
                </div>
                <div>
                   <p className="text-xs font-medium text-gray-500 mb-1">Trạng thái</p>
                   <div className={cn(
                     "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium",
                     order.status === 'Chờ xác nhận' ? "bg-red-50 text-red-700" :
                     order.status === 'Đã xác nhận' ? "bg-blue-50 text-blue-700" :
                     order.status === 'Hoàn thành' ? "bg-green-50 text-green-700" :
                     "bg-gray-100 text-gray-700"
                   )}>
                     {order.status === 'Hoàn thành' ? <CheckCircle2 size={12} /> : 
                      order.status === 'Chờ xác nhận' ? <Clock size={12} /> : 
                      order.status === 'Đã hủy' ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                     {order.status}
                   </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 lg:mt-0">
                {order.status === 'Chờ xác nhận' ? (
                  <>
                    <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-all shadow-sm">
                      Chấp nhận
                    </button>
                    <button className="px-5 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all">
                      Từ chối
                    </button>
                  </>
                ) : (
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors border border-gray-200 shadow-sm bg-white" title="Xem chi tiết">
                    <Eye size={18} />
                  </button>
                )}
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors border border-gray-200 shadow-sm bg-white" title="Nhắn tin">
                  <MessageSquare size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex justify-center mt-6">
         <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-dark transition-colors shadow-sm">
            Tải thêm đơn hàng
         </button>
      </div>
    </div>
  );
};
