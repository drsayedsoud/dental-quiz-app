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
  { name: 'Dermatology', icon: '🧴' },
  { name: 'Radiology', icon: '☢️' },
  { name: 'Anatomy', icon: '💀' },
  { name: 'Physiology', icon: '⚡' },
  { name: 'Pathology', icon: '🔬' },
  { name: 'Pharmacology', icon: '💊' },
  { name: 'Microbiology', icon: '🦠' },
  { name: 'Biochemistry', icon: '🧬' },
  { name: 'Public Health', icon: '🌍' },
  { name: 'Forensic Medicine', icon: '⚖️' },
  { name: 'General Practice', icon: '🏥' },
];

export default function MedicalPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const [sessions, setSessions] = useState<QuizSession[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    } else if (user) {
      getAllUserSessions(user.uid).then(setSessions);
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  const FREE_LIMIT = 100;
  const isLimited = !profile?.isVip && (profile?.questionCount || 0) >= FREE_LIMIT;

  const startExam = (subject?: string) => {
    if (isLimited) {
      alert('🚫 لقد تجاوزت الحد الأقصى للأسئلة المجانية (100 سؤال). تواصل مع الإدارة للحصول على وصول VIP.');
      return;
    }
    const params = new URLSearchParams({ section: 'medical' });
    if (subject) {
      params.set('subject', subject);
    } else {
      params.set('mode', 'exam');
    }
    router.push(`/quiz?${params.toString()}`);
  };

  const getSubjectStats = (subjectName: string) => {
    const subjSessions = sessions.filter(s => s.subject === subjectName);
    if (subjSessions.length === 0) return null;
    const totalAttempted = subjSessions.reduce((sum, s) => sum + s.attempted, 0);
    const totalScore = subjSessions.reduce((sum, s) => sum + s.score, 0);
    return totalAttempted > 0 ? Math.round((totalScore / totalAttempted) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-blue-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 py-6 max-w-lg mx-auto">
        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gradient">👨‍⚕️ Medical Prometric</h1>
          <div className="mt-2 inline-block bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-bold px-4 py-1.5 rounded-full">
            {profile?.questionCount || 0} سؤال محلول
          </div>
          {isLimited && (
            <p className="text-red-400 text-xs mt-2">🚫 وصلت للحد الأقصى المجاني</p>
          )}
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startExam()}
            disabled={isLimited}
            className="bg-gradient-to-l from-blue-600 to-indigo-700 text-white font-bold p-4 rounded-2xl shadow-lg hover:from-blue-500 hover:to-indigo-600 transition disabled:opacity-40 disabled:cursor-not-allowed text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">🧪</span>
            <span className="text-xs sm:text-sm">اختبار شامل</span>
          </motion.button>

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isLimited) { alert('🚫 لقد تجاوزت الحد الأقصى.'); return; }
              router.push('/quiz?section=medical&mode=simulation');
            }}
            disabled={isLimited}
            className="bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 p-4 rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">⏱️</span>
            <span className="text-xs sm:text-sm font-bold">امتحان محاكاة</span>
          </motion.button>

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              if (isLimited) { alert('🚫 لقد تجاوزت الحد الأقصى.'); return; }
              router.push('/quiz?section=medical&mode=quick');
            }}
            disabled={isLimited}
            className="bg-emerald-500/20 border border-emerald-500/30 hover:bg-emerald-500/30 text-emerald-300 p-4 rounded-2xl transition disabled:opacity-40 disabled:cursor-not-allowed text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">🎯</span>
            <span className="text-xs sm:text-sm font-bold">اختبار سريع (10)</span>
          </motion.button>

          <motion.button
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push('/bookmarks?section=medical')}
            className="bg-yellow-500/20 border border-yellow-500/30 hover:bg-yellow-500/30 text-yellow-300 p-4 rounded-2xl transition text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">⭐</span>
            <span className="text-xs sm:text-sm font-bold">الأسئلة المحفوظة</span>
          </motion.button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-2 gap-3.5 mb-6">
          {subjects.map((subject, index) => {
            const accuracy = getSubjectStats(subject.name);
            return (
              <motion.button
                key={subject.name}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => startExam(subject.name)}
                className="glass rounded-3xl p-4 flex flex-col items-center justify-between text-center border border-white/10 hover:border-blue-500/40 hover:bg-white/10 transition-all shadow-xl group aspect-square relative overflow-hidden"
              >
                {accuracy !== null && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-gray-800">
                    <div 
                      className={`h-full ${accuracy >= 75 ? 'bg-green-500' : accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                )}
                
                {accuracy !== null && (
                  <div className={`absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-black/50 ${accuracy >= 75 ? 'text-green-400' : accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {accuracy}%
                  </div>
                )}

                <div className="text-4xl group-hover:scale-110 transition duration-300 mt-2">
                  {subject.icon}
                </div>

                <div className="w-full mt-2">
                  <h2 className="font-extrabold text-white text-xs sm:text-sm leading-tight tracking-wide group-hover:text-blue-400 transition">
                    {subject.name}
                  </h2>
                </div>
              </motion.button>
            );
          })}
        </div>

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
