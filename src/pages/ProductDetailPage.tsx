import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, User, School, BookOpen, ArrowLeft, MessageSquare, AlertTriangle } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';
import { documentService } from '../services/documentService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { ReportModal } from '../components/ReportModal';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

import { useCart } from '../context/CartContext';

export const ProductDetailPage = ({ products }: { products: Product[] }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      // First try to find in existing products if provided
      const foundProduct = products.find(p => p.id === parseInt(id || '0'));
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        const data = await documentService.getById(id!);
        setProduct(data);
      }
    } catch (err: any) {
      setError(err.message || 'Không tìm thấy tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id, products]);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/product/${id}` } });
      return;
    }
    addToCart(product!);
  };

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size={40} label="Đang tải chi tiết tài liệu..." />
    </div>
  );

  if (error || !product) return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <ErrorMessage 
        message={error || "Tài liệu không tồn tại"} 
        onRetry={fetchProduct} 
      />
      <div className="mt-8 text-center">
        <Link to="/" className="text-airbnb-red font-bold hover:underline">Quay lại trang chủ</Link>
      </div>
    </div>
  );

  const recommendations = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-airbnb-gray hover:text-airbnb-dark mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Quay lại
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left: Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl overflow-hidden bg-gray-100 aspect-square"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 bg-airbnb-red/10 text-airbnb-red text-xs font-bold rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-sm font-bold">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              {product.rating}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-airbnb-dark mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2 text-airbnb-gray">
              <School className="w-5 h-5" />
              <span className="text-sm font-medium">{product.university}</span>
            </div>
            <div className="flex items-center gap-2 text-airbnb-gray">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">{product.subject}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <p className="text-airbnb-gray leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mt-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-6 border border-gray-200 rounded-[32px] shadow-sm gap-6">
            <div className="text-center sm:text-left">
              <p className="text-[10px] font-bold uppercase text-airbnb-gray tracking-widest mb-1">Giá tài liệu</p>
              <p className="text-4xl font-black text-airbnb-dark">${product.price}</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsReportModalOpen(true)}
                className="p-4 border border-gray-200 rounded-2xl text-airbnb-gray hover:text-airbnb-red hover:border-airbnb-red transition-all flex-shrink-0"
                title="Báo cáo vi phạm"
              >
                <AlertTriangle size={24} />
              </button>
              <button 
                onClick={handleAddToCart}
                className={cn(
                  "airbnb-button flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 text-lg",
                  !isAuthenticated && "bg-gray-400 hover:bg-gray-500"
                )}
              >
                <ShoppingCart className="w-6 h-6" /> 
                {!isAuthenticated ? 'Đăng nhập để mua' : 'Thêm vào giỏ'}
              </button>
            </div>
          </div>

          <Link 
            to={`/profile/${product.sellerId}`}
            className="mt-6 flex items-center gap-3 p-4 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
          >
            <div className="w-12 h-12 rounded-full bg-airbnb-red/10 flex items-center justify-center text-airbnb-red">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-airbnb-gray uppercase tracking-tighter">Người bán</p>
              <p className="font-bold text-airbnb-dark">Xem hồ sơ người bán</p>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Reviews Section */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-airbnb-dark mb-8 flex items-center gap-2">
          <MessageSquare className="w-6 h-6" /> Đánh giá từ người mua
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map(review => (
              <div key={review.id} className="p-6 border border-gray-100 rounded-2xl bg-white shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-airbnb-gray">
                      {review.user[0]}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{review.user}</p>
                      <p className="text-xs text-airbnb-gray">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={cn("w-3 h-3", i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200")} />
                    ))}
                  </div>
                </div>
                <p className="text-airbnb-gray text-sm italic">"{review.comment}"</p>
              </div>
            ))
          ) : (
            <p className="text-airbnb-gray italic">Chưa có đánh giá nào cho tài liệu này.</p>
          )}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h2 className="text-2xl font-bold text-airbnb-dark mb-8">Tài liệu tương tự</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="group">
              <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
              <h3 className="font-bold text-airbnb-dark line-clamp-1 group-hover:text-airbnb-red transition-colors">{p.name}</h3>
              <p className="text-sm text-airbnb-gray">{p.university}</p>
              <p className="font-bold text-airbnb-dark mt-1">${p.price}</p>
            </Link>
          ))}
        </div>
      </div>

      <ReportModal 
        isOpen={isReportModalOpen} 
        onClose={() => setIsReportModalOpen(false)} 
        targetType="document" 
        targetName={product.name} 
      />
    </div>
  );
};
