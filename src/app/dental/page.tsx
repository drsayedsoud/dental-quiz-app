'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const subjects = [
  { name: 'Endodontic', icon: '⚡', startIndex: 2270 },
  { name: 'Operative', icon: '💎', startIndex: 5013 },
  { name: 'Oral Surgery', icon: '✂️', startIndex: 2991 },
  { name: 'Periodontic', icon: '🌿', startIndex: 4112 },
  { name: 'Fixed Prosthodontic', icon: '👑', startIndex: 4601 },
  { name: 'Pedodontic', icon: '🧸', startIndex: 3290 },
  { name: 'Orthodontic', icon: '📐', startIndex: 3511 },
  { name: 'Pathology', icon: '🔬', startIndex: 5223 },
  { name: 'Radiology', icon: '🩻', startIndex: 3880 },
  { name: 'Removable Prosthodontic', icon: '👄', startIndex: 4804 },
  { name: 'Oral Medicine', icon: '💊', startIndex: 4368 },
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
          <h1 className="text-2xl font-extrabold text-gradient">🦷 Dental Prometric</h1>
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

        {/* 2-Column Grid of Subject Cards */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="glass rounded-2xl p-3.5 flex flex-col justify-between items-center text-center border border-white/10 hover:border-cyan-500/30 transition shadow-lg relative group"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-2 group-hover:scale-110 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/30 transition">
                {subject.icon}
              </div>

              {/* Title */}
              <h2 className="font-bold text-white text-xs sm:text-sm leading-snug min-h-[2rem] flex items-center justify-center mb-3">
                {subject.name}
              </h2>

              {/* Action Buttons */}
              <div className="flex gap-1.5 w-full mt-auto">
                <a
                  href={studyLinks[subject.name]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-blue-500/15 hover:bg-blue-500/25 active:scale-95 border border-blue-500/30 text-blue-300 py-1.5 rounded-xl text-center text-xs font-bold transition flex items-center justify-center gap-1"
                >
                  <span>📖</span>
                  <span>ذاكر</span>
                </a>
                <button
                  onClick={() => startExam(subject.name, subject.startIndex)}
                  disabled={isLimited}
                  className="flex-1 bg-cyan-500/15 hover:bg-cyan-500/25 active:scale-95 border border-cyan-500/30 text-cyan-300 py-1.5 rounded-xl text-center text-xs font-bold transition disabled:opacity-40 flex items-center justify-center gap-1"
                >
                  <span>📝</span>
                  <span>اختبار</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>

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
