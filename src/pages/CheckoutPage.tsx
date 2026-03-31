import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, ShieldCheck, CheckCircle2, ArrowLeft, ShoppingBag, Lock } from 'lucide-react';
import { CartItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

import { useCart } from '../context/CartContext';

export const CheckoutPage = () => {
  const { cart, clearCart, totalPrice: subtotal } = useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    cardName: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const fee = subtotal > 0 ? 5 : 0;
  const total = subtotal + fee;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 3000);
    }, 2500);
  };

  if (cart.length === 0 && !isSuccess) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-airbnb-dark mb-4">Giỏ hàng của bạn đang trống</h2>
        <Link to="/" className="text-airbnb-red font-bold hover:underline">Quay lại mua sắm</Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-12 bg-white border border-gray-100 rounded-3xl shadow-2xl max-w-md w-full"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-airbnb-dark mb-4">Thanh toán thành công!</h2>
          <p className="text-airbnb-gray mb-8">Cảm ơn bạn đã tin dùng VibeCart. Tài liệu sẽ được gửi đến email của bạn ngay lập tức.</p>
          <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 3 }}
              className="bg-green-500 h-full"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <Link to="/cart" className="flex items-center gap-2 text-airbnb-gray hover:text-airbnb-dark mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Quay lại giỏ hàng
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Payment Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-airbnb-dark mb-8 flex items-center gap-3">
              <CreditCard className="w-6 h-6" /> Thông tin thanh toán
            </h2>
            
            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Địa chỉ Email nhận tài liệu</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Tên trên thẻ</label>
                <input 
                  required
                  type="text" 
                  value={formData.cardName}
                  onChange={e => setFormData({...formData, cardName: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                  placeholder="NGUYEN VAN A"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Số thẻ</label>
                <div className="relative">
                  <input 
                    required
                    type="text" 
                    value={formData.cardNumber}
                    onChange={e => setFormData({...formData, cardNumber: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium pr-12"
                    placeholder="0000 0000 0000 0000"
                  />
                  <Lock className="w-5 h-5 text-gray-300 absolute right-4 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">Ngày hết hạn</label>
                  <input 
                    required
                    type="text" 
                    value={formData.expiry}
                    onChange={e => setFormData({...formData, expiry: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-airbnb-gray mb-2 tracking-widest">CVC / CVV</label>
                  <input 
                    required
                    type="password" 
                    maxLength={3}
                    value={formData.cvv}
                    onChange={e => setFormData({...formData, cvv: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl focus:bg-white focus:border-airbnb-red focus:ring-4 focus:ring-airbnb-red/5 outline-none transition-all font-medium"
                    placeholder="***"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isProcessing}
                className="w-full airbnb-button mt-8 py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <>
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  `Thanh toán $${total}`
                )}
              </button>
            </form>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-airbnb-gray justify-center">
            <ShieldCheck className="w-5 h-5 text-green-500" />
            Dữ liệu của bạn được mã hóa và bảo mật tuyệt đối.
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-24">
            <h3 className="text-xl font-bold text-airbnb-dark mb-6">Tóm tắt đơn hàng</h3>
            <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-4 items-center">
                  <img src={item.product.image} className="w-16 h-16 rounded-xl object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-airbnb-dark line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-airbnb-gray">Số lượng: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-airbnb-dark">${item.product.price * item.quantity}</p>
                </div>
              ))}
            </div>
            
            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-airbnb-gray">
                <span>Tạm tính</span>
                <span className="font-bold text-airbnb-dark">${subtotal}</span>
              </div>
              <div className="flex justify-between text-airbnb-gray">
                <span>Phí dịch vụ</span>
                <span className="font-bold text-airbnb-dark">${fee}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-airbnb-dark pt-4 border-t border-gray-100">
                <span>Tổng cộng</span>
                <span className="text-airbnb-red">${total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
