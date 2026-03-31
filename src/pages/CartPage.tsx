import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Trash2, CreditCard, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import { cn } from '../lib/utils';

import { useCart } from '../context/CartContext';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, totalPrice: subtotal } = useCart();
  const shipping = subtotal > 0 ? 15 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-stripe-dark mb-8">Your Shopping Bag</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 glass-card">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Your bag is empty.</p>
              <Link to="/" className="text-stripe-blue font-semibold mt-4 inline-block">Go Shopping</Link>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="glass-card p-4 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                <div className="flex gap-4 items-center w-full sm:w-auto">
                  <img src={item.product.image} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                  <div className="flex-1 sm:hidden">
                    <h3 className="font-bold text-airbnb-dark line-clamp-1">{item.product.name}</h3>
                    <p className="text-[10px] font-bold text-airbnb-gray uppercase tracking-tighter">{item.product.university}</p>
                    <p className="font-bold text-airbnb-dark mt-1">${item.product.price}</p>
                  </div>
                </div>
                
                <div className="hidden sm:block flex-1">
                  <h3 className="font-bold text-airbnb-dark">{item.product.name}</h3>
                  <p className="text-xs text-airbnb-gray mb-1">{item.product.university} • {item.product.subject}</p>
                  <p className="text-sm text-gray-500 font-medium">${item.product.price} each</p>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                  <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-full border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                    >-</button>
                    <span className="font-bold w-4 text-center text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors shadow-sm"
                    >+</button>
                  </div>
                  
                  <div className="text-right min-w-[80px]">
                    <p className="font-bold text-airbnb-dark text-lg">${item.product.price * item.quantity}</p>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-500 hover:text-red-600 mt-1 flex items-center gap-1 text-xs font-bold ml-auto"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="sm:hidden">Xóa</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-stripe-dark mb-6">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-semibold">${shipping}</span>
              </div>
              <div className="border-t border-gray-100 pt-4 flex justify-between text-lg font-bold text-stripe-dark">
                <span>Total</span>
                <span>${total}</span>
              </div>
            </div>
            <Link 
              to={cart.length > 0 ? "/checkout" : "#"}
              className={cn(
                "w-full mt-8 stripe-button py-3 flex items-center justify-center gap-2",
                cart.length === 0 && "opacity-50 cursor-not-allowed pointer-events-none"
              )}
            >
              <CreditCard className="w-5 h-5" /> Checkout
            </Link>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-400 justify-center">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            Secure payment powered by VibePay
          </div>
        </div>
      </div>
    </div>
  );
};
