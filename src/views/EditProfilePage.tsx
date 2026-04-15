'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  User as UserIcon, 
  Mail, 
  Camera, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Plus, 
  Trash2, 
  Save,
  ArrowLeft,
  Globe,
  Linkedin,
  Github,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { User } from '@/types';
import { userService } from '@/services/userService';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

export function EditProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userService.getMe();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSaving(true);
    setSaveSuccess(false);
    try {
      await userService.updateProfile(user.id, user);
      setSaveSuccess(true);
      setTimeout(() => router.push(`/profile/${user.id}`), 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof User, value: any) => {
    if (!user) return;
    setUser({ ...user, [field]: value });
  };

  const updateMentorField = (field: string, value: any) => {
    if (!user || !user.mentorInfo) return;
    setUser({
      ...user,
      mentorInfo: { ...user.mentorInfo, [field]: value }
    });
  };

  const addExperience = () => {
    if (!user) return;
    const newExp = { company: '', role: '', duration: '', description: '' };
    setUser({ ...user, experience: [...(user.experience || []), newExp] });
  };

  const removeExperience = (index: number) => {
    if (!user || !user.experience) return;
    const newExp = [...user.experience];
    newExp.splice(index, 1);
    setUser({ ...user, experience: newExp });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size={48} /></div>;
  if (!user) return <div className="min-h-screen flex items-center justify-center"><ErrorMessage message="Không tìm thấy người dùng" /></div>;

  return (
    <div className="min-h-screen bg-[#F3F2EF] pb-20">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-airbnb-gray hover:text-airbnb-dark font-bold transition-colors mb-2"
            >
              <ArrowLeft size={18} /> Quay lại
            </button>
            <h1 className="text-3xl sm:text-4xl font-black text-airbnb-dark tracking-tighter">Thiết lập hồ sơ</h1>
            <p className="text-airbnb-gray font-medium text-sm sm:text-base">Cập nhật thông tin cá nhân và chuyên môn của bạn.</p>
          </div>
          
          <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
            {saveSuccess && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-xl font-bold text-sm border border-green-100"
              >
                <CheckCircle2 size={18} /> Đã lưu thành công!
              </motion.div>
            )}
            <div className="flex items-center gap-3">
              <button 
                type="button"
                onClick={() => router.back()}
                className="flex-1 xs:flex-none px-6 py-3 bg-white border-2 border-gray-100 text-airbnb-dark rounded-2xl font-bold hover:bg-gray-50 transition-all shadow-sm"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={handleSave}
                disabled={saving || saveSuccess}
                className="flex-1 xs:flex-none px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {saving ? <LoadingSpinner size={20} color="white" /> : <Save size={20} />}
                <span className="whitespace-nowrap">{saveSuccess ? 'Đang chuyển hướng...' : 'Lưu thay đổi'}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Navigation/Status */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl overflow-hidden bg-gray-50 border-4 border-white shadow-xl">
                    <img src={user.avatar} className="w-full h-full object-cover" alt={user.name} />
                  </div>
                  <button className="absolute -bottom-2 -right-2 p-2.5 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition-all border-2 border-white">
                    <Camera size={18} />
                  </button>
                </div>
                <div>
                  <h3 className="text-xl font-black text-airbnb-dark tracking-tight">{user.name}</h3>
                  <p className="text-airbnb-gray font-medium text-sm">{user.email}</p>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 space-y-2">
                <div className="flex items-center justify-between text-sm font-bold">
                  <span className="text-airbnb-gray uppercase tracking-widest text-[10px]">Độ hoàn thiện hồ sơ</span>
                  <span className="text-blue-600">85%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full w-[85%]" />
                </div>
              </div>
            </div>

            <div className="bg-airbnb-dark rounded-[32px] p-8 text-white shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl" />
              <h4 className="text-lg font-black tracking-tight mb-2 relative z-10">Mẹo nhỏ</h4>
              <p className="text-gray-400 text-sm font-medium leading-relaxed relative z-10">
                Hồ sơ đầy đủ thông tin giúp bạn tăng 40% cơ hội được các Mentor và nhà tuyển dụng chú ý.
              </p>
            </div>
          </div>

          {/* Right Column: Forms */}
          <div className="lg:col-span-8 space-y-8">
            <form onSubmit={handleSave} className="space-y-8">
              {/* Basic Info */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <UserIcon size={20} />
                  </div>
                  <h2 className="text-xl font-black text-airbnb-dark tracking-tight">Thông tin cá nhân</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Họ và tên</label>
                    <input 
                      type="text" 
                      value={user.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full px-5 py-3.5 bg-gray-100 border-2 border-transparent rounded-2xl text-airbnb-gray cursor-not-allowed font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Giới thiệu ngắn</label>
                    <textarea 
                      value={user.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      rows={4}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all resize-none"
                      placeholder="Chia sẻ một chút về bản thân bạn..."
                    />
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <GraduationCap size={20} />
                  </div>
                  <h2 className="text-xl font-black text-airbnb-dark tracking-tight">Học vấn</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Trường đại học</label>
                    <input 
                      type="text" 
                      value={user.university}
                      onChange={(e) => updateField('university', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Chuyên ngành</label>
                    <input 
                      type="text" 
                      value={user.major}
                      onChange={(e) => updateField('major', e.target.value)}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Năm học</label>
                    <select 
                      value={user.year}
                      onChange={(e) => updateField('year', parseInt(e.target.value))}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all appearance-none"
                    >
                      {[1, 2, 3, 4, 5].map(y => <option key={y} value={y}>Năm {y}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">GPA hiện tại</label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={user.gpa}
                      onChange={(e) => updateField('gpa', parseFloat(e.target.value))}
                      className="w-full px-5 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <Globe size={20} />
                  </div>
                  <h2 className="text-xl font-black text-airbnb-dark tracking-tight">Liên kết xã hội</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">LinkedIn</label>
                    <div className="relative group">
                      <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-[#0A66C2] transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={user.socialLinks?.linkedin || ''}
                        onChange={(e) => updateField('socialLinks', { ...user.socialLinks, linkedin: e.target.value })}
                        placeholder="linkedin.com/in/username"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">GitHub</label>
                    <div className="relative group">
                      <Github className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-black transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={user.socialLinks?.github || ''}
                        onChange={(e) => updateField('socialLinks', { ...user.socialLinks, github: e.target.value })}
                        placeholder="github.com/username"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest ml-1">Website cá nhân</label>
                    <div className="relative group">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-airbnb-gray group-focus-within:text-blue-600 transition-colors" size={18} />
                      <input 
                        type="text" 
                        value={user.socialLinks?.website || ''}
                        onChange={(e) => updateField('socialLinks', { ...user.socialLinks, website: e.target.value })}
                        placeholder="yourwebsite.com"
                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border-2 border-transparent rounded-2xl focus:border-blue-600 focus:bg-white outline-none font-medium transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
