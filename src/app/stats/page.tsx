'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getAllUserSessions, QuizSession } from '@/lib/firestore';
import { getEarnedBadges, BADGES } from '@/lib/badges';
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

  // ========== Computed Stats ==========
  const stats = useMemo(() => {
    const totalAttempted = sessions.reduce((sum, s) => sum + s.attempted, 0);
    const totalScore = sessions.reduce((sum, s) => sum + s.score, 0);
    const totalWrong = totalAttempted - totalScore;
    const overallAccuracy = totalAttempted > 0 ? Math.round((totalScore / totalAttempted) * 100) : 0;
    const totalSessions = sessions.length;

    // Today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaySessions = sessions.filter(s => {
      if (!s.date?.toDate) return false;
      const d = s.date.toDate();
      return d >= today;
    });
    const todayAttempted = todaySessions.reduce((sum, s) => sum + s.attempted, 0);
    const todayScore = todaySessions.reduce((sum, s) => sum + s.score, 0);
    const todayWrong = todayAttempted - todayScore;

    // Day Streak calculation
    const uniqueDays = new Set<string>();
    sessions.forEach(s => {
      if (s.date?.toDate) {
        const d = s.date.toDate();
        uniqueDays.add(`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`);
      }
    });

    let streak = 0;
    const checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);
    // Check if today has activity, if not start from yesterday
    const todayKey = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
    if (!uniqueDays.has(todayKey)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const key = `${checkDate.getFullYear()}-${checkDate.getMonth()}-${checkDate.getDate()}`;
      if (uniqueDays.has(key)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    // Weekly activity (last 7 days)
    const weekDays: { label: string; active: boolean }[] = [];
    const dayLabels = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      weekDays.push({
        label: dayLabels[d.getDay()].slice(0, 3),
        active: uniqueDays.has(key),
      });
    }

    // Subject breakdown
    const subjectMap: Record<string, { score: number; attempted: number; count: number }> = {};
    sessions.forEach(s => {
      const subj = s.subject || 'شامل';
      if (!subjectMap[subj]) subjectMap[subj] = { score: 0, attempted: 0, count: 0 };
      subjectMap[subj].score += s.score;
      subjectMap[subj].attempted += s.attempted;
      subjectMap[subj].count += 1;
    });
    const subjectBreakdown = Object.entries(subjectMap)
      .map(([name, data]) => ({
        name,
        ...data,
        accuracy: data.attempted > 0 ? Math.round((data.score / data.attempted) * 100) : 0,
      }))
      .sort((a, b) => b.attempted - a.attempted);

    return {
      totalAttempted, totalScore, totalWrong, overallAccuracy, totalSessions,
      todayAttempted, todayScore, todayWrong,
      streak, weekDays, subjectBreakdown,
    };
  }, [sessions]);

  const dailyGoal = 40;
  const goalProgress = Math.min(stats.todayAttempted, dailyGoal);
  const goalPercent = Math.round((goalProgress / dailyGoal) * 100);

  // SVG Circle parameters
  const circleRadius = 70;
  const circumference = 2 * Math.PI * circleRadius;
  const strokeDashoffset = circumference - (goalPercent / 100) * circumference;

  const statsObj = { totalAttempted: stats.totalAttempted, totalScore: stats.totalScore, sessionsCount: stats.totalSessions };
  const earnedBadges = profile ? getEarnedBadges(profile, statsObj) : [];

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-4xl text-cyan-500">📊</motion.div>
      </div>
    );
  }

  if (!user) return null;

  // Greeting based on time
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 18 ? 'مساء الخير' : 'مساء النور';
  const userName = profile?.displayName || profile?.email?.split('@')[0] || 'بكم';

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-6 max-w-2xl mx-auto" dir="rtl">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">{greeting}، {userName} 👋</h1>
          <p className="text-gray-500 text-xs mt-1">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 text-gray-400 px-3 py-2 rounded-xl text-xs transition">
          ← العودة
        </Link>
      </div>

      {/* ========== DAILY TARGET CARD ========== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-lg">◉</span>
            <h2 className="text-white font-bold text-lg">الهدف اليومي</h2>
          </div>
          <span className="text-gray-500 text-xs">الأسئلة المحلولة اليوم</span>
        </div>

        {/* Circular Progress */}
        <div className="flex justify-center mb-5">
          <div className="relative w-44 h-44">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle cx="80" cy="80" r={circleRadius} stroke="rgba(255,255,255,0.05)" strokeWidth="10" fill="none" />
              {/* Wrong portion (red) */}
              {stats.todayWrong > 0 && (
                <circle cx="80" cy="80" r={circleRadius}
                  stroke="#ef4444" strokeWidth="10" fill="none" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - ((Math.min(stats.todayAttempted, dailyGoal) / dailyGoal) * circumference)}
                  className="transition-all duration-1000"
                />
              )}
              {/* Correct portion (green) */}
              <circle cx="80" cy="80" r={circleRadius}
                stroke="#22c55e" strokeWidth="10" fill="none" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - ((Math.min(stats.todayScore, dailyGoal) / dailyGoal) * circumference)}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-white text-4xl font-black">{stats.todayAttempted}</span>
              <span className="text-gray-500 text-sm">/ {dailyGoal} هدف</span>
            </div>
          </div>
        </div>

        {/* Correct / Wrong / Left */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
            <div className="text-green-400 text-xs mb-1">✓ صحيح</div>
            <div className="text-green-400 text-2xl font-black">{stats.todayScore}</div>
          </div>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-center">
            <div className="text-red-400 text-xs mb-1">✗ خطأ</div>
            <div className="text-red-400 text-2xl font-black">{stats.todayWrong}</div>
          </div>
          <div className="bg-gray-500/10 border border-gray-500/20 rounded-xl p-3 text-center">
            <div className="text-gray-400 text-xs mb-1">◷ متبقي</div>
            <div className="text-gray-400 text-2xl font-black">{Math.max(dailyGoal - stats.todayAttempted, 0)}</div>
          </div>
        </div>
      </motion.div>

      {/* ========== DAY STREAK CARD ========== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🔥</span>
            <div>
              <span className="text-orange-400 text-3xl font-black">{stats.streak}</span>
              <p className="text-gray-400 text-xs font-bold">أيام متتالية</p>
            </div>
          </div>
        </div>

        {/* Weekly calendar */}
        <div className="grid grid-cols-7 gap-2">
          {stats.weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all ${
                day.active 
                  ? 'bg-green-500 text-white shadow-[0_0_10px_rgba(34,197,94,0.4)]' 
                  : 'bg-white/5 text-gray-600'
              }`}>
                {day.active ? '✓' : '—'}
              </div>
              <span className="text-[9px] text-gray-500 font-bold">{day.label}</span>
            </div>
          ))}
        </div>
        <p className="text-center text-orange-400/70 text-xs font-bold mt-3">🔥 لا تكسر السلسلة!</p>
      </motion.div>

      
      {/* ========== LEADERBOARD CARD ========== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="mb-4"
      >
        <button 
          onClick={() => router.push('/leaderboard')}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-yellow-500/20 to-amber-500/20 hover:from-yellow-500/30 hover:to-amber-500/30 border border-yellow-500/30 p-5 rounded-3xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-between"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-4">
            <span className="text-4xl drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]">🏆</span>
            <div className="text-right">
              <h3 className="text-xl font-bold text-yellow-400">لوحة الشرف العالمية</h3>
              <p className="text-xs text-gray-400 mt-1">شاهد ترتيبك بين جميع الأطباء في التطبيق</p>
            </div>
          </div>
          <span className="text-yellow-500/50 text-2xl relative">←</span>
        </button>
      </motion.div>

      {/* ========== OVERALL STATS CARD ========== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4"
      >
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">📊 الإحصائيات الكلية</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-center">
            <div className="text-cyan-400 text-3xl font-black mb-1">{stats.totalSessions}</div>
            <div className="text-gray-400 text-[10px] font-bold">إجمالي الاختبارات</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 text-center">
            <div className="text-green-400 text-3xl font-black mb-1">{stats.overallAccuracy}%</div>
            <div className="text-gray-400 text-[10px] font-bold">نسبة النجاح</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4 text-center">
            <div className="text-purple-400 text-3xl font-black mb-1">{stats.totalAttempted}</div>
            <div className="text-gray-400 text-[10px] font-bold">الأسئلة المُجابة</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4 text-center">
            <div className="text-yellow-400 text-3xl font-black mb-1">{stats.totalScore}</div>
            <div className="text-gray-400 text-[10px] font-bold">الإجابات الصحيحة</div>
          </div>
        </div>
      </motion.div>

      {/* ========== SUBJECT BREAKDOWN ========== */}
      {stats.subjectBreakdown.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4"
        >
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">📚 أداؤك حسب المادة</h2>
          <div className="space-y-3">
            {stats.subjectBreakdown.slice(0, 8).map((subj, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white text-sm font-bold truncate">{subj.name}</span>
                    <span className={`text-xs font-black ${subj.accuracy >= 75 ? 'text-green-400' : subj.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {subj.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-white/5 rounded-full h-2.5 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${subj.accuracy}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                      className={`h-full rounded-full ${subj.accuracy >= 75 ? 'bg-green-500' : subj.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    />
                  </div>
                  <div className="text-gray-500 text-[10px] mt-0.5">{subj.score}/{subj.attempted} • {subj.count} اختبار</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ========== BADGES ========== */}
      {profile && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-4"
        >
          <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">🏆 الأوسمة والإنجازات</h2>
          <div className="grid grid-cols-3 gap-3">
            {BADGES.map(badge => {
              const isEarned = earnedBadges.some(b => b.id === badge.id);
              return (
                <motion.div 
                  key={badge.id}
                  whileHover={{ scale: 1.05 }}
                  className={`p-3 rounded-2xl text-center border transition-all ${
                    isEarned 
                      ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/30' 
                      : 'bg-white/5 border-white/5 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <div className={`text-[10px] font-bold ${isEarned ? 'text-yellow-400' : 'text-gray-500'}`}>{badge.name}</div>
                  <div className="text-[8px] text-gray-500 mt-1 leading-tight">{badge.description}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ========== RECENT SESSIONS ========== */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="bg-white/5 border border-white/10 rounded-3xl p-5 mb-8"
      >
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">📝 آخر الاختبارات</h2>
        
        {sessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">لم تقم بإجراء أي اختبارات بعد.</p>
            <p className="text-gray-600 text-xs mt-1">ابدأ أول اختبار لترى إحصائياتك هنا!</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {sessions.slice(0, 10).map((session, index) => {
              const dateStr = session.date?.toDate ? session.date.toDate().toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : '';
              const timeStr = session.date?.toDate ? session.date.toDate().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) : '';
              const percentage = session.attempted > 0 ? Math.round((session.score / session.attempted) * 100) : 0;
              
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.05 }}
                  className="bg-white/5 border border-white/5 rounded-xl p-3 flex justify-between items-center"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-bold text-sm truncate">{session.subject || 'اختبار شامل'}</div>
                    <div className="text-gray-500 text-[10px] mt-0.5">{dateStr} {timeStr}</div>
                  </div>
                  <div className="flex items-center gap-3 mr-3">
                    <div className="text-gray-400 text-[10px]">{session.score}/{session.attempted}</div>
                    <div className={`text-lg font-black min-w-[45px] text-left ${percentage >= 75 ? 'text-green-400' : percentage >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                      {percentage}%
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

    </div>
  );
}
