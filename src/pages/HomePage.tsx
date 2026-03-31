import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Star, BookOpen, Code, GraduationCap, School, Filter, ChevronRight, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const HomePage = ({ products }: { products: Product[] }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUniversity, setSelectedUniversity] = useState<string>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    // If we have products or if it's explicitly empty (fallback), stop loading
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, [products]);

  const universities = useMemo(() => ['all', ...new Set(products.map(p => p.university))], [products]);
  const subjects = useMemo(() => ['all', ...new Set(products.map(p => p.subject))], [products]);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchUni = selectedUniversity === 'all' || p.university === selectedUniversity;
    const matchSub = selectedSubject === 'all' || p.subject === selectedSubject;
    return matchCat && matchUni && matchSub;
  });

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <LoadingSpinner size={48} label="Đang tải danh sách tài liệu..." />
    </div>
  );

  const Filters = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-airbnb-red" />
        <h2 className="text-lg font-bold text-airbnb-dark">Bộ lọc</h2>
      </div>

      {/* Category Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-airbnb-gray">Loại tài liệu</h3>
        <div className="space-y-1">
          {['all', 'Giáo trình', 'Source Code'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                if (showMobileFilters) setShowMobileFilters(false);
              }}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
                selectedCategory === cat ? "bg-airbnb-red/10 text-airbnb-red font-bold" : "text-airbnb-gray hover:bg-gray-100"
              )}
            >
              <div className="flex items-center gap-2">
                {cat === 'all' && <Filter className="w-4 h-4" />}
                {cat === 'Giáo trình' && <BookOpen className="w-4 h-4" />}
                {cat === 'Source Code' && <Code className="w-4 h-4" />}
                <span>{cat === 'all' ? 'Tất cả' : cat}</span>
              </div>
              {selectedCategory === cat && <ChevronRight className="w-4 h-4" />}
            </button>
          ))}
        </div>
      </div>

      {/* University Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-airbnb-gray">Trường đại học</h3>
        <select 
          value={selectedUniversity}
          onChange={(e) => {
            setSelectedUniversity(e.target.value);
            if (showMobileFilters) setShowMobileFilters(false);
          }}
          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-airbnb-red/20"
        >
          {universities.map(uni => (
            <option key={uni} value={uni}>{uni === 'all' ? 'Tất cả các trường' : uni}</option>
          ))}
        </select>
      </div>

      {/* Subject Filter */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-airbnb-gray">Môn học</h3>
        <select 
          value={selectedSubject}
          onChange={(e) => {
            setSelectedSubject(e.target.value);
            if (showMobileFilters) setShowMobileFilters(false);
          }}
          className="w-full p-2.5 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-airbnb-red/20"
        >
          {subjects.map(sub => (
            <option key={sub} value={sub}>{sub === 'all' ? 'Tất cả môn học' : sub}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-6">
        <button 
          onClick={() => setShowMobileFilters(true)}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-airbnb-dark shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-5 h-5 text-airbnb-red" />
          Lọc tài liệu
        </button>
      </div>

      {/* Mobile Filters Modal */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 bg-black/50 z-[200] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-[80%] max-w-sm bg-white z-[201] p-6 lg:hidden overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black text-airbnb-dark">Bộ lọc</h2>
                <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Filters />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <Filters />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <p className="text-airbnb-gray text-sm">Hiển thị <span className="font-bold text-airbnb-dark">{filteredProducts.length}</span> tài liệu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-10">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-[4/3] relative rounded-2xl overflow-hidden mb-4 bg-gray-100">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {product.category}
                      </span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          navigate('/login', { state: { from: '/' } });
                          return;
                        }
                        addToCart(product);
                      }}
                      className="absolute bottom-3 right-3 p-3 bg-airbnb-red text-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-base text-airbnb-dark line-clamp-1 group-hover:text-airbnb-red transition-colors">{product.name}</h3>
                      <div className="flex items-center gap-1 shrink-0">
                        <Star className="w-3 h-3 fill-airbnb-red text-airbnb-red" />
                        <span className="text-sm font-medium">{product.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-airbnb-gray text-xs">
                      <School className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{product.university}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-airbnb-gray text-xs">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span className="line-clamp-1">{product.subject}</span>
                    </div>
                    <p className="text-lg font-bold text-airbnb-dark mt-2">${product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-bold text-airbnb-dark">Không tìm thấy tài liệu</h3>
              <p className="text-airbnb-gray mt-1">Thử thay đổi bộ lọc của bạn để xem thêm kết quả.</p>
              <button 
                onClick={() => { setSelectedCategory('all'); setSelectedUniversity('all'); setSelectedSubject('all'); }}
                className="mt-4 text-airbnb-red font-bold hover:underline"
              >
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
