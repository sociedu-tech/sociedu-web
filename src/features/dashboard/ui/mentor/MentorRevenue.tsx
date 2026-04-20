import React from 'react';
import {
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  History,
  Filter,
  Download,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const statGridClass = (compact: boolean) =>
  cn(
    'grid gap-4',
    compact ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  );

type MentorRevenueProps = {
  /** Khi true: ẩn tiêu đề + nút (dùng trong Tổng quan với `DashboardSection`). */
  embedded?: boolean;
  showStatCards?: boolean;
  showTransactions?: boolean;
  /** 2×2 thẻ nhỏ — phù hợp cột phụ tổng quan. */
  compactStats?: boolean;
  /** false khi tiêu đề đã có ở `DashboardSection` bên ngoài. */
  showTransactionsHeading?: boolean;
};

export function MentorRevenueToolbar() {
  return (
    <div className="flex flex-wrap gap-2 sm:gap-3">
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Filter size={16} /> Bộ lọc
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Download size={16} /> Xuất báo cáo
      </button>
    </div>
  );
}

export function MentorRevenue({
  embedded = false,
  showStatCards = true,
  showTransactions = true,
  compactStats = false,
  showTransactionsHeading = true,
}: MentorRevenueProps) {
  const transactions = [
    { id: 1, mentee: 'Nguyễn Văn A', package: 'Khóa học React nâng cao', amount: 500000, date: '02/04/2026', status: 'Hoàn thành', type: 'credit' },
    { id: 2, mentee: 'Trần Thị B', package: 'Tư vấn UI/UX Career', amount: 300000, date: '01/04/2026', status: 'Hoàn thành', type: 'credit' },
    { id: 3, type: 'withdrawal', amount: -1000000, date: '28/03/2026', status: 'Đang xử lý', bank: 'VCB - ****1234' },
    { id: 4, mentee: 'Lê Văn C', package: 'Code Review Support', amount: 200000, date: '25/03/2026', status: 'Hoàn thành', type: 'credit' },
  ];

  return (
    <div className="space-y-6">
      {!embedded ? (
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-lg font-semibold text-dark">Thống kê Doanh thu</h2>
          <MentorRevenueToolbar />
        </div>
      ) : null}

      {/* Stats Overview */}
      {showStatCards ? (
      <div className={statGridClass(compactStats)}>
        <div className="bg-primary p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-4">
              <Wallet size={20} />
            </div>
            <p className="text-xs font-semibold tracking-wider text-primary-50 opacity-90 mb-1">Số dư hiện tại</p>
            <h3 className="text-2xl font-bold">2.450.000đ</h3>
            <button className="mt-5 w-full py-2 bg-white text-primary rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
              Rút tiền ngay
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp size={20} />
            </div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Tổng thu nhập</p>
            <h3 className="text-2xl font-bold text-dark">15.800.000đ</h3>
          </div>
          <p className="text-xs font-medium text-green-600 mt-4 flex items-center gap-1">
             <ArrowUpRight size={14} /> +12% so với tháng trước
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
               <CreditCard size={20} />
            </div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Tháng này</p>
            <h3 className="text-2xl font-bold text-dark">4.200.000đ</h3>
          </div>
          <p className="text-xs font-medium text-blue-600 mt-4 flex items-center gap-1">
             <ArrowUpRight size={14} /> 6 buổi học mới tuần này
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 flex flex-col justify-between transition-colors">
          <div>
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
               <History size={20} />
            </div>
            <p className="text-xs font-semibold tracking-wider text-gray-500 mb-1">Chờ xử lý</p>
            <h3 className="text-2xl font-bold text-dark">850.000đ</h3>
          </div>
          <p className="text-xs font-medium text-gray-500 mt-4">
             Đang trong quá trình đối soát
          </p>
        </div>
      </div>
      ) : null}

      {/* Transaction History */}
      {showTransactions ? (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
        {showTransactionsHeading ? (
          <h3 className="mb-6 flex items-center gap-2 text-base font-semibold text-dark">
            <History className="text-gray-400" size={18} /> Lịch sử giao dịch gần đây
          </h3>
        ) : null}

        <div className="space-y-4">
          {transactions.map(tx => (
            <div key={tx.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 group transition-colors">
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border",
                    tx.type === 'withdrawal' ? "bg-red-50 text-red-600 border-red-100" : "bg-green-50 text-green-600 border-green-100"
                  )}>
                    {tx.type === 'withdrawal' ? <ArrowDownRight size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div>
                    <h4 className="font-medium text-dark text-sm">
                      {tx.type === 'withdrawal' ? `Rút tiền: ${tx.bank}` : tx.mentee}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {tx.type === 'withdrawal' ? 'Hệ thống đang xử lý' : tx.package}
                    </p>
                  </div>
               </div>
               <div className="text-right">
                  <p className={cn(
                    "text-sm font-bold",
                    tx.type === 'withdrawal' ? "text-red-600" : "text-green-600"
                  )}>
                    {tx.type === 'withdrawal' ? '' : '+'}{tx.amount.toLocaleString()}đ
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{tx.date}</p>
               </div>
            </div>
          ))}
        </div>
        
        <button
          type="button"
          className="mt-6 w-full rounded-xl border border-dashed border-gray-200 py-3 text-sm font-medium text-primary transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          Xem lịch sử chi tiết
        </button>
      </div>
      ) : null}
    </div>
  );
};
