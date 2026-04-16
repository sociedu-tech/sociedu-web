import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

const COLORS = [
  'var(--color-chart-1)',
  'var(--color-chart-2)',
  'var(--color-chart-3)',
  'var(--color-chart-4)',
  'var(--color-chart-5)',
];

const mockStats = {
  revenue: [
    { name: 'Tháng 1', value: 4000 },
    { name: 'Tháng 2', value: 3000 },
    { name: 'Tháng 3', value: 2000 },
    { name: 'Tháng 4', value: 2780 },
    { name: 'Tháng 5', value: 1890 },
    { name: 'Tháng 6', value: 2390 },
    { name: 'Tháng 7', value: 3490 },
  ],
  userGrowth: [
    { name: 'Tháng 1', users: 100 },
    { name: 'Tháng 2', users: 150 },
    { name: 'Tháng 3', users: 220 },
    { name: 'Tháng 4', users: 310 },
    { name: 'Tháng 5', users: 450 },
    { name: 'Tháng 6', users: 600 },
    { name: 'Tháng 7', users: 800 },
  ],
  categoryDistribution: [
    { name: 'Giáo trình', value: 400 },
    { name: 'Source Code', value: 300 },
    { name: 'Đồ án', value: 300 },
    { name: 'Khác', value: 200 },
  ]
};

export const AdminStats = () => {
  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">Tổng doanh thu</p>
          <p className="text-3xl font-black text-blue-900">128.500kđ</p>
          <p className="text-xs text-blue-600 mt-2 font-bold">+12% so với tháng trước</p>
        </div>
        <div className="bg-green-50 p-6 rounded-3xl border border-green-100">
          <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">Người dùng mới</p>
          <p className="text-3xl font-black text-green-900">1,240</p>
          <p className="text-xs text-green-600 mt-2 font-bold">+8% so với tháng trước</p>
        </div>
        <div className="bg-orange-50 p-6 rounded-3xl border border-orange-100">
          <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">Tài liệu đã bán</p>
          <p className="text-3xl font-black text-orange-900">3,520</p>
          <p className="text-xs text-orange-600 mt-2 font-bold">+15% so với tháng trước</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-airbnb-gray uppercase tracking-widest">Doanh thu theo tháng</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockStats.revenue}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="var(--color-chart-area-stroke)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-chart-tick)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-chart-tick)'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-tooltip)'}}
                />
                <Area type="monotone" dataKey="value" stroke="var(--color-chart-area-stroke)" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-airbnb-gray uppercase tracking-widest">Tăng trưởng người dùng</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockStats.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-chart-tick)'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: 'var(--color-chart-tick)'}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-tooltip)'}}
                />
                <Line type="monotone" dataKey="users" stroke="var(--color-chart-line)" strokeWidth={3} dot={{r: 4, fill: 'var(--color-chart-line)', strokeWidth: 2, stroke: 'white'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-airbnb-gray uppercase tracking-widest">Phân bổ danh mục</h3>
          <div className="h-[300px] w-full flex flex-col sm:flex-row items-center justify-center gap-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockStats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockStats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: 'var(--shadow-tooltip)'}}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap sm:flex-col gap-2 justify-center">
              {mockStats.categoryDistribution.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}} />
                  <span className="text-xs font-bold text-airbnb-dark">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
