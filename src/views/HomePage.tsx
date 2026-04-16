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
        <h1 className="text-5xl md:text-[56px] font-semibold text-dark leading-[1.04] tracking-tight">
          Tìm kiếm <span className="text-primary">Mentor</span> hoàn hảo cho bạn
        </h1>
        <p className="text-lg md:text-xl text-gray font-medium leading-[1.5] max-w-xl mx-auto">
          Kết nối với những người đi trước giàu kinh nghiệm để nhận được lời khuyên, định hướng và học hỏi.
        </p>

        <div className="pt-6">
          <Link href="/mentors" className="btn-primary text-base px-8 py-4">
            Khám phá Mentor
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
