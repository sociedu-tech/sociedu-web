import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, CheckCircle2, MapPin, Info, Calendar, Linkedin, Github, Globe } from 'lucide-react';
import type { User as UserType } from '@/types';

interface ProfileHeaderProps {
  user: UserType;
  isOwnProfile: boolean;
  onContactClick: () => void;
}

export const ProfileHeader = ({ user, isOwnProfile, onContactClick }: ProfileHeaderProps) => {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start text-center md:text-left">
          <div className="relative group">
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 shadow-inner">
              <Image 
                src={user.avatar} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                alt={user.name}
                width={160}
                height={160}
                unoptimized
              />
            </div>
            {isOwnProfile && (
              <button className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg text-blue-600 hover:bg-blue-50 transition-all border border-gray-100">
                <Camera size={18} />
              </button>
            )}
          </div>
          
          <div className="flex-1 space-y-4 w-full">
            <div className="space-y-1">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-3">
                <h1 className="text-2xl sm:text-3xl font-black text-airbnb-dark tracking-tight">{user.name}</h1>
                {user.role === 'mentor' && user.mentorInfo?.verificationStatus === 'verified' && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black tracking-widest border border-blue-100">
                    <CheckCircle2 size={12} /> Verified
                  </div>
                )}
              </div>
              <p className="text-base sm:text-lg font-medium text-airbnb-dark/80 leading-tight">
                {user.role === 'mentor' ? user.mentorInfo?.headline : (user.major ? `${user.major} @ ${user.university}` : 'Thành viên Mentoree')}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-airbnb-gray font-medium">
              <span className="flex items-center gap-1.5"><MapPin size={16} className="text-blue-500" /> Hà Nội, Việt Nam</span>
              <button 
                onClick={onContactClick}
                className="text-blue-600 font-bold hover:text-blue-700 transition-colors flex items-center gap-1.5"
              >
                <Info size={16} /> Thông tin liên hệ
              </button>
              <span className="flex items-center gap-1.5"><Calendar size={16} className="text-blue-500" /> Tham gia {user.joinedDate}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              {isOwnProfile ? (
                <Link
                  href="/edit-profile"
                  className="w-full sm:w-auto px-6 py-2.5 bg-airbnb-dark text-white rounded-2xl font-bold hover:bg-black transition-all shadow-lg shadow-gray-200 text-center"
                >
                  Chỉnh sửa hồ sơ
                </Link>
              ) : (
                <>
                  <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
                    Kết nối
                  </button>
                  <button className="w-full sm:w-auto px-6 py-2.5 border-2 border-gray-100 text-airbnb-dark rounded-2xl font-bold hover:bg-gray-50 transition-all">
                    Nhắn tin
                  </button>
                </>
              )}
              
              <div className="h-10 w-px bg-gray-100 mx-2 hidden lg:block" />
              
              <div className="flex items-center justify-center gap-3 w-full sm:w-auto">
                {user.socialLinks?.linkedin && (
                  <a href={user.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-airbnb-gray hover:text-linkedin hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                    <Linkedin size={18} />
                  </a>
                )}
                {user.socialLinks?.github && (
                  <a href={user.socialLinks.github} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-airbnb-gray hover:text-black hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200">
                    <Github size={18} />
                  </a>
                )}
                {user.socialLinks?.website && (
                  <a href={user.socialLinks.website} target="_blank" rel="noopener noreferrer" className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-airbnb-gray hover:text-blue-500 hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100">
                    <Globe size={18} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
