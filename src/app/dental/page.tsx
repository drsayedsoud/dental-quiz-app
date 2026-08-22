'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { DentalIconMap } from '@/components/DentalIcons';

const subjects = [
  { name: 'Endodontic', startIndex: 2270 },
  { name: 'Operative', startIndex: 5013 },
  { name: 'Oral Surgery', startIndex: 2991 },
  { name: 'Periodontic', startIndex: 4112 },
  { name: 'Fixed Prosthodontic', startIndex: 4601 },
  { name: 'Pedodontic', startIndex: 3290 },
  { name: 'Orthodontic', startIndex: 3511 },
  { name: 'Pathology', startIndex: 5223 },
  { name: 'Radiology', startIndex: 3880 },
  { name: 'Removable Prosthodontic', startIndex: 4804 },
  { name: 'Oral Medicine', startIndex: 4368 },
];

const studyLinks: Record<string, string> = {
  'Endodontic': 'https://www.dentiscope.org/_files/ugd/66484b_13de14e0ee1245d098407d33277bd911.pdf',
  'Operative': 'https://www.dentiscope.org/_files/ugd/66484b_9e2d2cf919784f7f98ef5be74cce9275.pdf',
  'Oral Surgery': 'https://www.dentiscope.org/_files/ugd/66484b_5c326d7e426b4654a9efa77f7d1afe9b.pdf',
  'Periodontic': 'https://www.dentiscope.org/_files/ugd/66484b_7d8dd69cda6d4aa1a269fc466373e171.pdf',
  'Fixed Prosthodontic': 'https://www.dentiscope.org/_files/ugd/66484b_dfd43c22780649b1a7065b98d9a22619.pdf',
  'Pedodontic': 'https://www.dentiscope.org/_files/ugd/66484b_2394fa6e184449b5ab9ea531277299c8.pdf',
  'Orthodontic': 'https://www.dentiscope.org/_files/ugd/66484b_81a9da40864943fa96d25db2de3a5e1f.pdf',
  'Pathology': 'https://www.dentiscope.org/_files/ugd/66484b_7715d7b654904f6e897cd98d52578ea6.pdf',
  'Radiology': 'https://www.dentiscope.org/_files/ugd/66484b_f068e2f0268848d3a0c36cf9566ad3f2.pdf',
  'Removable Prosthodontic': 'https://www.dentiscope.org/_files/ugd/66484b_e90c5fcf18eb4709aad84faade7e29dc.pdf',
  'Oral Medicine': 'https://www.dentiscope.org/_files/ugd/66484b_128003f99a6a4f29b33cddb345bc9c59.pdf',
};

export default function DentalPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<{ name: string; startIndex: number } | null>(null);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading || !user) return null;

  const FREE_LIMIT = 100;
  const isLimited = !profile?.isVip && (profile?.questionCount || 0) >= FREE_LIMIT;

  const startExam = (subject?: string, startIndex?: number) => {
    if (isLimited) {
      alert('🚫 لقد تجاوزت الحد الأقصى للأسئلة المجانية (100 سؤال). تواصل مع الإدارة للحصول على وصول VIP.');
      return;
    }
    const params = new URLSearchParams({ section: 'dental' });
    if (subject) {
      params.set('subject', subject);
      if (startIndex) params.set('startIndex', String(startIndex));
    } else {
      params.set('mode', 'exam');
    }
    router.push(`/quiz?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 py-6 max-w-lg mx-auto">
        {/* Header */}
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gradient">🦷 Dental Prometric</h1>
          <div className="mt-2 inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold px-4 py-1.5 rounded-full">
            {profile?.questionCount || 0} سؤال محلول
          </div>
          {isLimited && (
            <p className="text-red-400 text-xs mt-2">🚫 وصلت للحد الأقصى المجاني</p>
          )}
        </motion.div>

        {/* Random Exam Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => startExam()}
          disabled={isLimited}
          className="w-full bg-gradient-to-l from-green-600 to-emerald-700 text-white font-bold py-3.5 rounded-2xl mb-6 shadow-lg hover:from-green-500 hover:to-emerald-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
        >
          <span>🧪</span>
          <span>ادخل اختبار شامل الآن</span>
        </motion.button>

        {/* 2-Column Square Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {subjects.map((subject, index) => {
            const IconComp = DentalIconMap[subject.name];
            return (
              <motion.button
                key={subject.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedSubject(subject)}
                className="glass rounded-3xl p-4 flex flex-col items-center justify-between text-center border border-white/10 hover:border-cyan-500/40 hover:bg-white/10 transition-all shadow-xl group aspect-square"
              >
                {/* Visual Dental Illustration */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  {IconComp && <IconComp className="w-full h-full drop-shadow-md" />}
                </div>

                {/* Specialty Title */}
                <div className="w-full">
                  <h2 className="font-extrabold text-white text-sm sm:text-base leading-tight tracking-wide group-hover:text-cyan-400 transition">
                    {subject.name}
                  </h2>
                </div>

                {/* Subtle Tap Indicator */}
                <div className="w-full flex items-center justify-center gap-1 text-[11px] text-cyan-400/80 font-medium py-1 px-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <span>اضغط للاختيار</span>
                  <span>←</span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Modal Popup for Study / Exam */}
        <AnimatePresence>
          {selectedSubject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedSubject(null)}
                className="absolute inset-0 bg-black/80 backdrop-blur-md"
              />

              {/* Modal Box */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 20 }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="relative z-10 w-full max-w-sm bg-[#0f172a] border-2 border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-center"
              >
                {/* Close button */}
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="absolute top-4 left-4 w-8 h-8 rounded-full bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition"
                >
                  ✕
                </button>

                {/* Large Icon */}
                <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  {DentalIconMap[selectedSubject.name] && (
                    React.createElement(DentalIconMap[selectedSubject.name], { className: "w-full h-full drop-shadow-xl" })
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-extrabold text-white mb-2">
                  {selectedSubject.name}
                </h3>
                <p className="text-xs text-cyan-200/70 mb-6">
                  اختر ما ترغب بالبدء به الآن:
                </p>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href={studyLinks[selectedSubject.name]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gradient-to-l from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-blue-600/30 transition flex items-center justify-center gap-2 text-base"
                  >
                    <span>📖</span>
                    <span>ذاكر المحتوى والشرح</span>
                  </a>

                  <button
                    onClick={() => {
                      const subj = selectedSubject;
                      setSelectedSubject(null);
                      startExam(subj.name, subj.startIndex);
                    }}
                    disabled={isLimited}
                    className="w-full bg-gradient-to-l from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-cyan-600/30 transition flex items-center justify-center gap-2 text-base disabled:opacity-40"
                  >
                    <span>📝</span>
                    <span>بدء الامتحان والتمرن</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => router.push('/dashboard')}
          className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white text-sm transition font-semibold"
        >
          ← العودة للأقسام
        </motion.button>
      </div>
    </div>
  );
}
