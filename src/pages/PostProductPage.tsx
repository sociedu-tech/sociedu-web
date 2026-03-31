import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ArrowLeft, Image as ImageIcon, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PostProductPage = ({ onAddProduct }: { onAddProduct: (p: any) => void }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: '', 
    category: 'Giáo trình', 
    image: '', 
    stock: '10',
    university: '',
    subject: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onAddProduct(newProduct);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/seller');
      }, 2000);
    } catch (error) {
      console.error("Failed to post product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white border border-gray-100 rounded-3xl shadow-2xl max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-airbnb-dark mb-4">Đăng tài liệu thành công!</h2>
          <p className="text-airbnb-gray mb-8">Tài liệu của bạn đã được niêm yết trên hệ thống. Đang chuyển hướng...</p>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 2 }}
              className="bg-green-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/seller" className="flex items-center gap-2 text-airbnb-gray hover:text-airbnb-dark mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại Seller Center
      </Link>

      <div className="mb-12">
        <h1 className="text-4xl font-bold text-airbnb-dark mb-4">Đăng tài liệu mới</h1>
        <p className="text-lg text-airbnb-gray">Chia sẻ kiến thức và kiếm thêm thu nhập từ tài liệu của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Form Fields */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Tên tài liệu</label>
              <input 
                required
                type="text" 
                value={newProduct.name}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all text-lg font-medium"
                placeholder="e.g. Giáo trình Giải tích 1 - Bách Khoa"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Loại tài liệu</label>
                <select 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium appearance-none"
                >
                  <option>Giáo trình</option>
                  <option>Source Code</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Giá bán ($)</label>
                <input 
                  required
                  type="number" 
                  value={newProduct.price}
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Trường đại học</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.university}
                  onChange={e => setNewProduct({...newProduct, university: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                  placeholder="e.g. ĐH Bách Khoa"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Môn học</label>
                <input 
                  required
                  type="text" 
                  value={newProduct.subject}
                  onChange={e => setNewProduct({...newProduct, subject: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                  placeholder="e.g. Giải tích 1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Mô tả chi tiết</label>
              <textarea 
                required
                rows={6}
                value={newProduct.description}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium resize-none"
                placeholder="Mô tả chi tiết về nội dung tài liệu, tình trạng, năm xuất bản..."
              />
            </div>
          </div>
        </div>

        {/* Right: Sidebar / Image Upload */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <label className="block text-xs font-bold uppercase text-airbnb-gray mb-4 tracking-widest">Hình ảnh tài liệu</label>
            <div className="aspect-square rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-6 text-center group hover:border-airbnb-red transition-colors cursor-pointer relative overflow-hidden">
              {newProduct.image ? (
                <img src={newProduct.image} className="w-full h-full object-cover absolute inset-0" referrerPolicy="no-referrer" />
              ) : (
                <>
                  <ImageIcon className="w-12 h-12 text-gray-300 mb-3 group-hover:text-airbnb-red transition-colors" />
                  <p className="text-xs font-bold text-airbnb-gray uppercase tracking-tighter">Dán URL hình ảnh bên dưới</p>
                </>
              )}
            </div>
            <input 
              required
              type="url" 
              value={newProduct.image}
              onChange={e => setNewProduct({...newProduct, image: e.target.value})}
              className="w-full mt-4 p-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-airbnb-red outline-none transition-all text-sm"
              placeholder="https://picsum.photos/..."
            />
          </div>

          <div className="bg-airbnb-dark text-white rounded-3xl p-8 shadow-xl">
            <h3 className="text-xl font-bold mb-4">Quy định đăng bài</h3>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <span>Tài liệu phải thuộc quyền sở hữu của bạn.</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                <span>Thông tin trường/môn học phải chính xác.</span>
              </li>
              <li className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0" />
                <span>Không đăng tài liệu vi phạm pháp luật.</span>
              </li>
            </ul>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full airbnb-button mt-8 py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang xử lý..." : "Niêm yết ngay"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
