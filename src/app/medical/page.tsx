
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getAllUserSessions, QuizSession } from '@/lib/firestore';

const subjects = [
  { name: 'Internal Medicine', icon: '🩺' },
  { name: 'General Surgery', icon: '🔪' },
  { name: 'Pediatrics', icon: '👶' },
  { name: 'Obstetrics & Gynecology', icon: '🤰' },
  { name: 'Family Medicine', icon: '👨‍👩‍👧‍👦' },
  { name: 'Emergency Medicine', icon: '🚑' },
  { name: 'Psychiatry', icon: '🧠' },
  { name: 'Orthopedics', icon: '🦴' },
  { name: 'Ophthalmology', icon: '👁️' },
  { name: 'ENT', icon: '👂' },
  { name: 'Dermatology', icon: ' छा' },
  { name: 'Radiology', icon: '☢️' },
  { name: 'Anatomy', icon: '💀' },
  { name: 'Physiology', icon: '⚡' },
  { name: 'Pathology', icon: '🔬' },
  { name: 'Pharmacology', icon: '💊' },
  { name: 'Microbiology', icon: '🦠' },
  { name: 'Biochemistry', icon: '🧪' },
  { name: 'Public Health', icon: '🌍' },
  { name: 'Forensic Medicine', icon: '⚖️' },
  { name: 'General Practice', icon: '🩺' },
];

const studentModules = [
  { name: 'Basic Structure and Function', icon: '🧬' },
  { name: 'Musculoskeletal & Integumentary', icon: '🦴' },
  { name: 'Cardiopulmonary systems', icon: '🫀' },
  { name: 'Digestive system & Nutrition', icon: '🍏' },
  { name: 'Endocrine & Reproductive systems', icon: '🩸' },
  { name: 'Nervous system & Special senses', icon: '🧠' },
  { name: 'Urinary system', icon: '💧' },
  { name: 'Principles of Diseases & Pharmacology', icon: '💊' },
  { name: 'Systemic Pathology & Therapeutics I', icon: '🔬' },
  { name: 'Infection & Immunity', icon: '🦠' },
  { name: 'Systemic Pathology & Therapeutics II', icon: '🧪' },
  { name: 'Community medicine', icon: '🌍' },
  { name: 'Ophthalmology', icon: '👁️' },
  { name: 'Forensic medicine & clinical toxicology', icon: '⚖️' },
  { name: 'Paediatrics', icon: '👶' },
  { name: 'Medicine I', icon: '🩺' },
  { name: 'Medicine II', icon: '🩺' },
  { name: 'Family medicine', icon: '👨‍👩‍👧‍👦' },
  { name: 'Ear, Nose and throat (ENT)', icon: '👂' },
  { name: 'Surgery I', icon: '🔪' },
  { name: 'Surgery II & emergency', icon: '🚑' },
  { name: 'Obstetrics & gynaecology', icon: '🤰' },
  { name: 'Professional practice', icon: '👨‍⚕️' },
];

export default function MedicalPage() {
  const [selectedTrack, setSelectedTrack] = useState<'undergrad' | 'grad' | null>(null);
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
    else if (user) getAllUserSessions(user.uid).then(setSessions);
  }, [user, loading, router]);

  if (loading || !user) return null;

  const FREE_LIMIT = 100;
  const isLimited = !profile?.isVip && (profile?.questionCount || 0) >= FREE_LIMIT;

  const startExam = (subject?: string, mode: string = 'exam') => {
    if (isLimited) {
      alert('لقد وصلت للحد الأقصى للأسئلة المجانية.');
      return;
    }
    const params = new URLSearchParams({ section: 'medical', track: selectedTrack || '' });
    if (subject) params.set('subject', subject);
    else params.set('mode', mode);
    router.push(`/quiz?${params.toString()}`);
  };

  const getSubjectStats = (subjectName: string) => {
    const subjSessions = sessions.filter(s => s.subject === subjectName);
    if (subjSessions.length === 0) return null;
    const totalAttempted = subjSessions.reduce((sum, s) => sum + s.attempted, 0);
    const totalScore = subjSessions.reduce((sum, s) => sum + s.score, 0);
    return totalAttempted > 0 ? Math.round((totalScore / totalAttempted) * 100) : 0;
  };

  if (!selectedTrack) {
    return (
      <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 max-w-3xl mx-auto">
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}} className="text-center mb-10">
          <span className="text-5xl mb-4 block">🩺</span>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-4 tracking-wide drop-shadow-md">
            الطب البشري
          </h1>
          <p className="text-gray-300 text-base sm:text-lg">الرجاء اختيار المسار الخاص بك للبدء</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <button onClick={() => setSelectedTrack('undergrad')} className="group relative overflow-hidden bg-white/5 border border-white/10 hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all rounded-3xl p-8 flex flex-col items-center justify-center gap-4 active:scale-95">
            <span className="text-6xl group-hover:scale-110 transition-transform">🎓</span>
            <h2 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">الطلبة</h2>
            <p className="text-gray-400 text-sm text-center">أسئلة وتجميعات مخصصة لطلبة البكالوريوس (الموديولات)</p>
          </button>
          
          <button onClick={() => setSelectedTrack('grad')} className="group relative overflow-hidden bg-white/5 border border-white/10 hover:bg-yellow-500/10 hover:border-yellow-500/50 transition-all rounded-3xl p-8 flex flex-col items-center justify-center gap-4 active:scale-95">
            <span className="text-6xl group-hover:scale-110 transition-transform">👨‍⚕️</span>
            <h2 className="text-2xl font-bold text-white group-hover:text-yellow-300 transition-colors">الخريجون والدراسات العليا</h2>
            <p className="text-gray-400 text-sm text-center">أطباء الامتياز، التكليف، الماجستير، والزمالة</p>
          </button>
        </div>
      </div>
    );
  }

  const currentSubjects = selectedTrack === 'undergrad' ? studentModules : subjects;

  return (
    <div className="min-h-screen pt-24 pb-10 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {selectedTrack === 'undergrad' ? '🎓 مسار الطلبة' : '👨‍⚕️ مسار الخريجين'}
        </h2>
        <button onClick={() => setSelectedTrack(null)} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition">
          ↩️ تغيير المسار
        </button>
      </div>

      <motion.div initial={{opacity: 0, y: 10}} animate={{opacity: 1, y: 0}}>
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button onClick={() => startExam(undefined, 'exam')} disabled={isLimited} className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white font-bold p-4 rounded-2xl shadow-lg hover:from-blue-500 hover:to-indigo-600 transition disabled:opacity-40 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">📝</span>
            <span className="text-xs sm:text-sm">امتحان شامل</span>
          </motion.button>

          <motion.button onClick={() => startExam(undefined, 'simulation')} disabled={isLimited} className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 p-4 rounded-2xl transition disabled:opacity-40 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">⏱️</span>
            <span className="text-xs sm:text-sm font-bold">امتحان محاكاة</span>
          </motion.button>

          <motion.button onClick={() => startExam(undefined, 'quick')} disabled={isLimited} className="bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 p-4 rounded-2xl transition disabled:opacity-40 flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xs sm:text-sm font-bold">اختبار سريع</span>
          </motion.button>

          <motion.button onClick={() => router.push(`/bookmarks?section=medical&track=${selectedTrack}`)} className="bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 p-4 rounded-2xl transition flex flex-col items-center justify-center gap-2">
            <span className="text-2xl">⭐</span>
            <span className="text-xs sm:text-sm font-bold">الأسئلة المحفوظة</span>
          </motion.button>

          <motion.button 
            onClick={() => router.push(`/challenge/create?section=medical&track=${selectedTrack}`)} 
            className="col-span-2 mx-auto w-3/4 sm:w-1/2 relative overflow-hidden bg-gradient-to-r from-red-700 via-red-600 to-red-800 border border-red-500 hover:border-red-400 py-3 sm:py-4 rounded-2xl transition-all flex flex-row items-center justify-center gap-2 group shadow-[0_0_10px_rgba(220,38,38,0.4)] animate-heartbeat hover:animate-none hover:scale-[1.02] active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            <span className="text-xl sm:text-2xl group-hover:scale-110 transition-transform drop-shadow-lg">⚔️</span>
            <span className="text-sm sm:text-base font-black text-white drop-shadow-md tracking-wide">تحدي الأصدقاء</span>
          </motion.button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white mb-6 flex items-center gap-3">
          <span className={selectedTrack === 'undergrad' ? 'text-cyan-400' : 'text-yellow-400'}>📚</span> 
          المواد الدراسية
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {currentSubjects.map((subject, index) => {
            const accuracy = getSubjectStats(subject.name);
            return (
              <motion.button
                key={subject.name}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => startExam(subject.name, 'standard')}
                className="glass rounded-3xl p-4 flex flex-col items-center justify-between text-center border border-white/10 hover:border-blue-500/40 hover:bg-white/10 transition-all shadow-xl group aspect-square relative overflow-hidden"
              >
                {accuracy !== null && (
                  <div className="absolute top-2 left-2 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1 text-white">
                    <span className={accuracy >= 80 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                      {accuracy}%
                    </span>
                  </div>
                )}
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3 mt-4 group-hover:scale-110 transition-transform">
                  {subject.icon}
                </div>
                <h3 className="font-bold text-white text-xs sm:text-sm leading-tight group-hover:text-blue-300 transition-colors line-clamp-3">
                  {subject.name}
                </h3>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
