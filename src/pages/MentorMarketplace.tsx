import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, Search, Filter, CheckCircle2, MessageSquare, 
  Calendar, GraduationCap, Award, ArrowRight, User as UserIcon, X
} from 'lucide-react';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { mentorService } from '../services/mentorService';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { cn } from '../lib/utils';

export const MentorMarketplace = () => {
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const fetchMentors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mentorService.getAll();
      setMentors(data);
    } catch (err: any) {
      setError("Không thể tải danh sách Mentor. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
    window.scrollTo(0, 0);
  }, []);

  const filteredMentors = mentors.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.mentorInfo?.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.mentorInfo?.expertise.some(e => e.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <LoadingSpinner size={48} label="Đang tìm kiếm các chuyên gia..." />
    </div>
  );

  if (error) return (
    <div className="max-w-xl mx-auto py-20 px-4">
      <ErrorMessage message={error} onRetry={fetchMentors} />
    </div>
  );

  const Filters = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-2 mb-6">
        <Filter className="w-5 h-5 text-airbnb-red" />
        <h2 className="text-lg font-bold text-airbnb-dark">Bộ lọc Mentor</h2>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-airbnb-gray mb-4">Lĩnh vực</h3>
          <div className="space-y-2">
            {['Tất cả', 'Công nghệ thông tin', 'Kinh tế', 'Toán học', 'Ngoại ngữ'].map(cat => (
              <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-gray-300 text-airbnb-red focus:ring-airbnb-red" />
                <span className="text-sm text-airbnb-gray group-hover:text-airbnb-dark transition-colors">{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-airbnb-gray mb-4">Giá dịch vụ</h3>
          <input type="range" className="w-full accent-airbnb-red" />
          <div className="flex justify-between mt-2 text-xs font-bold text-airbnb-gray">
            <span>$0</span>
            <span>$1000+</span>
          </div>
        </div>

        <button 
          onClick={() => setShowMobileFilters(false)}
          className="w-full py-3 bg-airbnb-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-colors"
        >
          Áp dụng bộ lọc
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-20">
      {/* Hero Section */}
      <div className="bg-airbnb-dark text-white py-12 md:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-airbnb-red/10 blur-[120px] rounded-full" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Kết nối với <span className="text-airbnb-red">Mentor</span> hàng đầu
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 leading-relaxed">
              Nhận tư vấn 1-1 từ các sinh viên xuất sắc và chuyên gia trong ngành để bứt phá trong học tập và sự nghiệp.
            </p>
            
            <div className="relative max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Tìm theo tên, chuyên môn hoặc kỹ năng..."
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-airbnb-red transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <button 
            onClick={() => setShowMobileFilters(true)}
            className="w-full flex items-center justify-center gap-2 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-airbnb-dark shadow-xl"
          >
            <Filter className="w-5 h-5 text-airbnb-red" />
            Lọc Mentor
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl sticky top-24">
              <Filters />
            </div>
          </aside>

          {/* Mentors Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredMentors.map((mentor, idx) => (
                <motion.div
                  key={mentor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white border border-gray-100 rounded-[2rem] p-6 hover:shadow-2xl transition-all group"
                >
                  <div className="flex gap-4 mb-6">
                    <img 
                      src={mentor.avatar} 
                      alt={mentor.name} 
                      className="w-20 h-20 rounded-2xl object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-airbnb-dark group-hover:text-airbnb-red transition-colors">{mentor.name}</h3>
                        {mentor.mentorInfo?.verificationStatus === 'verified' && (
                          <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                      <p className="text-xs text-airbnb-gray font-medium line-clamp-1 mb-2">{mentor.mentorInfo?.headline}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-xs font-bold text-airbnb-dark">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          {mentor.mentorInfo?.rating}
                        </div>
                        <div className="w-1 h-1 bg-gray-300 rounded-full" />
                        <div className="text-[10px] font-bold text-airbnb-gray uppercase tracking-tighter">
                          {mentor.mentorInfo?.sessionsCompleted} buổi học
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {mentor.mentorInfo?.expertise.slice(0, 3).map(exp => (
                      <span key={exp} className="px-3 py-1 bg-gray-50 text-airbnb-gray rounded-lg text-[10px] font-bold border border-gray-100">
                        {exp}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <div>
                      <p className="text-[10px] font-bold text-airbnb-gray uppercase tracking-widest">Giá từ</p>
                      <p className="text-xl font-black text-airbnb-dark">${mentor.mentorInfo?.price}<span className="text-xs font-normal text-airbnb-gray">/giờ</span></p>
                    </div>
                    <Link 
                      to={`/profile/${mentor.id}`}
                      className="flex items-center gap-2 px-6 py-3 bg-airbnb-red text-white rounded-xl font-bold text-sm hover:bg-airbnb-red/90 transition-all shadow-lg shadow-airbnb-red/20"
                    >
                      Xem hồ sơ <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredMentors.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-gray-100">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <UserIcon className="w-10 h-10 text-gray-200" />
                </div>
                <h3 className="text-xl font-bold text-airbnb-dark mb-2">Không tìm thấy Mentor</h3>
                <p className="text-airbnb-gray">Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
