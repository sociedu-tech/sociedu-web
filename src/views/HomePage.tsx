'use client';

import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';

export const HomePage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6"
      >
        <h1 className="text-4xl md:text-6xl font-black text-airbnb-dark leading-tight">
          Tìm kiếm <span className="text-airbnb-red">Mentor</span> hoàn hảo cho bạn
        </h1>
        <p className="text-xl text-airbnb-gray">
          Kết nối với những người đi trước giàu kinh nghiệm để nhận được lời khuyên, định hướng và học hỏi.
        </p>
        
        <div className="pt-6">
          <Link 
            href="/mentors" 
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-airbnb-red rounded-full hover:bg-airbnb-dark transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
          >
            Khám phá Mentor
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
