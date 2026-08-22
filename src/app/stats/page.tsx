'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getAllUserSessions, QuizSession } from '@/lib/firestore';
import { getEarnedBadges, BADGES, Badge } from '@/lib/badges';
import Link from 'next/link';

export default function StatsPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  const [sessions, setSessions] = useState<QuizSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getAllUserSessions(user.uid).then(data => {
        setSessions(data);
        setIsLoading(false);
      });
    }
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-4xl text-cyan-500">📊</motion.div>
      </div>
    );
  }

  if (!user) return null;

  const totalAttempted = sessions.reduce((sum, s) => sum + s.attempted, 0);
  const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
  const overallAccuracy = totalAttempted > 0 ? Math.round((totalScore / totalAttempted) * 100) : 0;
  const totalSessions = sessions.length;

  const statsObj = { totalAttempted, totalScore, sessionsCount: totalSessions };
  const earnedBadges = profile ? getEarnedBadges(profile, statsObj) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-2xl mx-auto print:bg-white print:text-black" dir="ltr">
      <div className="flex items-center justify-between mb-8 print:hidden">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>📊</span> إحصائيات الأداء
        </h1>
        <div className="flex gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-xl text-sm transition font-bold flex items-center gap-2"
          >
            🖨️ تقرير PDF
          </button>
          <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl text-sm transition flex items-center" dir="rtl">
            ← العودة
          </Link>
        </div>
      </div>
      
      <div className="hidden print:block text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">تقرير أداء Prometric Quiz</h1>
        <p className="text-gray-600">{profile?.email} • {new Date().toLocaleDateString('ar-EG')}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center print:border-gray-300 print:bg-white">
          <div className="text-cyan-400 text-3xl font-bold mb-1 print:text-black">{totalSessions}</div>
          <div className="text-gray-400 text-xs">إجمالي الاختبارات</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center print:border-gray-300 print:bg-white">
          <div className="text-green-400 text-3xl font-bold mb-1 print:text-black">{overallAccuracy}%</div>
          <div className="text-gray-400 text-xs">نسبة النجاح الكلية</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center print:border-gray-300 print:bg-white">
          <div className="text-purple-400 text-3xl font-bold mb-1 print:text-black">{totalAttempted}</div>
          <div className="text-gray-400 text-xs">الأسئلة المجابة</div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center print:border-gray-300 print:bg-white">
          <div className="text-yellow-400 text-3xl font-bold mb-1 print:text-black">{totalScore}</div>
          <div className="text-gray-400 text-xs">الإجابات الصحيحة</div>
        </div>
      </div>

      {profile && (
        <>
          <h2 className="text-xl font-bold text-white mb-4 text-right print:text-black" dir="rtl">الأوسمة والإنجازات 🏆</h2>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {BADGES.map(badge => {
              const isEarned = earnedBadges.some(b => b.id === badge.id);
              return (
                <div key={badge.id} className={`p-3 rounded-2xl text-center border transition-all ${isEarned ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30 print:border-gray-300 print:bg-white' : 'bg-white/5 border-white/5 opacity-50 grayscale print:hidden'}`}>
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className={`text-[10px] font-bold ${isEarned ? 'text-yellow-400' : 'text-gray-400'}`}>{badge.name}</div>
                  <div className="text-[9px] text-gray-500 mt-1 leading-tight hidden sm:block">{badge.description}</div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <h2 className="text-xl font-bold text-white mb-4 text-right print:text-black" dir="rtl">سجل الاختبارات الأخيرة</h2>
      
      {sessions.length === 0 ? (
        <div className="text-center py-10 bg-white/5 border border-white/10 rounded-2xl print:border-gray-300 print:bg-white print:text-black">
          <p className="text-gray-500 text-sm">لم تقم بإجراء أي اختبارات بعد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.slice(0, 10).map((session, index) => {
            const dateStr = session.date?.toDate ? session.date.toDate().toLocaleDateString('ar-EG') : 'تاريخ غير معروف';
            const percentage = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0;
            
            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 flex justify-between items-center print:border-gray-300 print:bg-white"
              >
                <div className="text-right flex-1" dir="rtl">
                  <div className="text-white font-bold text-sm mb-1 print:text-black">{session.subject || 'اختبار شامل'}</div>
                  <div className="text-gray-500 text-xs">{dateStr} • {session.section === 'medical' ? 'الطب البشري' : 'طب الأسنان'}</div>
                </div>
                <div className="text-center ml-4">
                  <div className={`text-lg font-bold ${percentage >= 75 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'} print:text-black`}>
                    {percentage}%
                  </div>
                  <div className="text-gray-400 text-xs">{session.score}/{session.attempted}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
