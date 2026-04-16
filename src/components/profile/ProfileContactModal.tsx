import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserIcon, MessageSquare, Linkedin, Globe, PlusCircle } from 'lucide-react';
import { User as UserType } from '../../types';

interface ProfileContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserType;
}

export const ProfileContactModal = ({ isOpen, onClose, user }: ProfileContactModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-airbnb-dark">Thông tin liên hệ</h3>
              <button onClick={onClose} className="text-airbnb-gray hover:text-airbnb-dark">
                <PlusCircle size={24} className="rotate-45" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Hồ sơ cá nhân</p>
                  <p className="text-airbnb-dark font-medium">{window.location.href}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="p-3 bg-red-50 rounded-xl text-red-600">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Email</p>
                  <p className="text-airbnb-dark font-medium">{user.email}</p>
                </div>
              </div>
              {user.socialLinks?.linkedin && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-linkedin">
                    <Linkedin size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">LinkedIn</p>
                    <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                      {user.socialLinks.linkedin}
                    </a>
                  </div>
                </div>
              )}
              {user.socialLinks?.website && (
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-50 rounded-xl text-green-600">
                    <Globe size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-airbnb-gray uppercase tracking-widest">Website</p>
                    <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline">
                      {user.socialLinks.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 bg-gray-50 text-center">
              <p className="text-xs text-airbnb-gray italic">Thông tin này chỉ hiển thị cho những người bạn kết nối.</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
