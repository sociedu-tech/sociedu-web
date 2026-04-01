/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

// Import Components
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { MentorDashboard } from './pages/MentorDashboard';
import { EditProfilePage } from './pages/EditProfilePage';
import { UserProfilePage } from './pages/UserProfilePage';
import { MentorMarketplace } from './pages/MentorMarketplace';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { Footer } from './components/Footer';
import { AnimatePresence } from 'motion/react';
import { LoadingSpinner } from './components/ui/LoadingSpinner';

import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function AppContent() {
  const { userRole, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-white">
        <LoadingSpinner size={48} label="Đang khởi tạo hệ thống..." />
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
              <Route path="/" element={<HomePage />} />
              <Route path="/profile/:id" element={<UserProfilePage />} />
              <Route path="/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
              <Route path="/mentor-dashboard" element={<ProtectedRoute allowedRoles={['mentor']}><MentorDashboard /></ProtectedRoute>} />
              <Route path="/mentors" element={<MentorMarketplace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
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
      <AppContent />
    </AuthProvider>
  );
}
