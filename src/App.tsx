/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from './lib/utils';
import { Product, CartItem } from './types';
import { documentService } from './services/documentService';

// Import Components
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { CartPage } from './pages/CartPage';
import { SellerDashboard } from './pages/SellerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { EditProfilePage } from './pages/EditProfilePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { PostProductPage } from './pages/PostProductPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MentorMarketplace } from './pages/MentorMarketplace';
import { LoginPage } from './pages/LoginPage';
import { Footer } from './components/Footer';
import { AnimatePresence } from 'motion/react';
import { LoadingSpinner } from './components/ui/LoadingSpinner';
import { ErrorMessage } from './components/ui/ErrorMessage';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CartProvider } from './context/CartContext';

function AppContent() {
  const [products, setProducts] = useState<Product[]>([]);
  const { userRole, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await documentService.getAll();
      setProducts(data || []);
    } catch (err: any) {
      console.error("Failed to fetch products:", err);
      setError(err.message || 'Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddProduct = async (productData: any) => {
    try {
      const newProduct = await documentService.create(productData);
      setProducts(prev => [...prev, newProduct]);
      return newProduct;
    } catch (err) {
      console.error("Failed to add product:", err);
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <LoadingSpinner size={48} label="Đang khởi tạo hệ thống..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white px-4">
        <ErrorMessage message={error} onRetry={fetchProducts} />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage products={products} />} />
              <Route path="/product/:id" element={<ProductDetailPage products={products} />} />
              <Route path="/profile/:id" element={<UserProfilePage products={products} />} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
              <Route path="/seller" element={<ProtectedRoute allowedRoles={['seller']}><SellerDashboard products={products} /></ProtectedRoute>} />
              <Route path="/post-product" element={<ProtectedRoute allowedRoles={['seller', 'admin']}><PostProductPage onAddProduct={handleAddProduct} /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
              <Route path="/mentors" element={<MentorMarketplace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
                    <h2 className="text-2xl font-bold text-airbnb-dark">Welcome back!</h2>
                    <p className="text-airbnb-gray mt-2">You are currently logged in as a <span className="font-bold text-airbnb-red uppercase">{userRole}</span>.</p>
                  </div>
                </ProtectedRoute>
              } />
            </Routes>
          </AnimatePresence>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
