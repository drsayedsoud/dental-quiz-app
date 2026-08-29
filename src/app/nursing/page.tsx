'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getAllUserSessions, QuizSession } from '@/lib/firestore';

const subjects = [
  { name: 'التمريض العام', icon: '👩‍⚕️' },
];

export default function NursingPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [showSubjectMenu, setShowSubjectMenu] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllUserSessions(user.uid).then(setSessions);
    }
  }, [user]);

  const getSubjectStats = (subjectName: string) => {
    const subjSessions = sessions.filter(s => s.subject === subjectName);
    if (subjSessions.length === 0) return null;
    let correct = 0;
    let total = 0;
    subjSessions.forEach(s => {
      correct += s.score;
      total += s.attempted;
    });
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
  };

  const handleModeSelect = (mode: string, section: string, subj?: string) => {
    const params = new URLSearchParams();
    params.set('mode', mode);
    params.set('section', section);
    if (subj) {
      params.set('subject', subj);
    }
    router.push(`/quiz?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-purple-400 text-xl">⏳ جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pb-10">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 pt-8 max-w-lg relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Header */}
          <div className="text-center mb-8 relative">
            <button
              onClick={() => router.push('/dashboard')}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition p-2 bg-white/5 rounded-full"
            >
              ➔
            </button>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-500 mb-2">
              التمريض
            </h1>
            <p className="text-gray-400 text-sm">
              Nursing Prometric 👩‍⚕️
            </p>
          </div>

          {!showSubjectMenu ? (
            <div className="space-y-4 mb-8">
              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                onClick={() => handleModeSelect('exam', 'nursing')}
                className="w-full relative overflow-hidden group bg-gradient-to-l from-fuchsia-600 to-purple-700 rounded-3xl p-6 text-right hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg"
              >
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="bg-white/20 p-3 rounded-2xl">
                    <span className="text-3xl">📝</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">امتحان برومترك</h2>
                    <p className="text-fuchsia-100/80 text-sm">50 سؤال في 50 دقيقة (عشوائي)</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                onClick={() => handleModeSelect('simulation', 'nursing')}
                className="w-full glass rounded-3xl p-6 text-right hover:bg-white/5 active:scale-[0.98] transition-all border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <span className="text-3xl">⏱️</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">محاكاة شاملة</h2>
                    <p className="text-gray-400 text-sm">100 سؤال في 100 دقيقة</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
                onClick={() => setShowSubjectMenu(true)}
                className="w-full glass rounded-3xl p-6 text-right hover:bg-white/5 active:scale-[0.98] transition-all border border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-white/5 p-3 rounded-2xl">
                    <span className="text-3xl">📚</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white mb-1">تدريب مخصص</h2>
                    <p className="text-gray-400 text-sm">أسئلة غير مرتبطة بوقت (تدريب التمريض العام)</p>
                  </div>
                </div>
              </motion.button>

              <motion.button
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                onClick={() => alert('قريباً جداً! جاري برمجة هذه الميزة الرائعة 🔥')}
                className="w-full relative overflow-hidden group bg-gradient-to-r from-orange-500/20 via-red-500/20 to-orange-500/20 border border-orange-500/50 rounded-3xl p-6 text-right hover:border-orange-400 active:scale-[0.98] transition-all"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="relative bg-orange-500/20 p-3 rounded-2xl border border-orange-500/30">
                    <div className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                    </div>
                    <span className="text-3xl group-hover:scale-110 transition-transform">⚔️</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-orange-400 mb-1 drop-shadow-md">تحدي الأصدقاء (Live)</h2>
                    <p className="text-orange-200/80 text-sm">غرفة مسابقة حية في الوقت الفعلي</p>
                  </div>
                </div>
              </motion.button>
            </div>
          ) : (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-white font-bold text-lg">أقسام التمريض</h2>
                <button onClick={() => setShowSubjectMenu(false)} className="text-purple-400 text-sm hover:text-purple-300">العودة للأنماط</button>
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                {subjects.map((subject, index) => {
                  const accuracy = getSubjectStats(subject.name);
                  return (
                    <motion.button
                      key={subject.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleModeSelect('practice', 'nursing', subject.name)}
                      className="glass glass-hover rounded-2xl p-4 text-center group border border-white/5 relative overflow-hidden"
                    >
                      {accuracy !== null && (
                        <div className="absolute top-2 right-2 text-[10px] font-bold text-purple-300 bg-purple-900/40 px-1.5 py-0.5 rounded">
                          {accuracy}%
                        </div>
                      )}
                      <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">
                        {subject.icon}
                      </div>
                      <h3 className="text-sm font-bold text-gray-200 line-clamp-2 leading-snug">
                        {subject.name}
                      </h3>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
