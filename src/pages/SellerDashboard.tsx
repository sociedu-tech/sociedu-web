import React, { useState, useEffect } from 'react';
import { Plus, DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const chartData = [
  { name: 'Mon', sales: 4000 },
  { name: 'Tue', sales: 3000 },
  { name: 'Wed', sales: 5000 },
  { name: 'Thu', sales: 2780 },
  { name: 'Fri', sales: 1890 },
  { name: 'Sat', sales: 2390 },
  { name: 'Sun', sales: 3490 },
];

export const SellerDashboard = ({ products }: { products: Product[] }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size={40} label="Đang tải dữ liệu kinh doanh..." />
    </div>
  );
  const stats = [
    { label: 'Total Revenue', value: '$12,450', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Orders', value: '24', icon: ShoppingBag, color: 'text-airbnb-red', bg: 'bg-red-50' },
    { label: 'Products', value: products.length, icon: Package, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Customer Rating', value: '4.9/5', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-airbnb-dark">Seller Center</h1>
          <p className="text-airbnb-gray">Grow your business on VibeCart.</p>
        </div>
        <Link 
          to="/post-product"
          className="airbnb-button flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Post a Product
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((s, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 flex items-center gap-4">
            <div className={cn("p-3 rounded-xl", s.bg)}>
              <s.icon className={cn("w-6 h-6", s.color)} />
            </div>
            <div>
              <p className="text-sm text-airbnb-gray font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-airbnb-dark">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-airbnb-dark mb-6">Sales Overview</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF385C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#FF385C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#717171'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#FF385C" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-bold text-airbnb-dark mb-6">Your Listings</h3>
          <div className="space-y-4">
            {products.slice().reverse().slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center gap-3 pb-4 border-b border-gray-50 last:border-0">
                <img src={p.image} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-airbnb-dark line-clamp-1">{p.name}</p>
                  <p className="text-xs text-airbnb-gray">{p.stock} in stock</p>
                </div>
                <p className="text-sm font-bold text-airbnb-dark">${p.price}</p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 text-sm font-semibold text-airbnb-red hover:underline">Manage all listings</button>
        </div>
      </div>
    </div>
  );
};
