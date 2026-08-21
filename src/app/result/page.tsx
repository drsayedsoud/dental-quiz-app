'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = parseInt(searchParams.get('score') || '0');
  const attempted = parseInt(searchParams.get('attempted') || '0');
  const total = parseInt(searchParams.get('total') || '0');
  const percentage = attempted > 0 ? (score / attempted) * 100 : 0;

  let message = '';
  let emoji = '';
  let color = '';
  if (percentage >= 90) { message = 'ممتاز! استمر في هذا الأداء الرائع 💪'; emoji = '🏆'; color = 'text-yellow-400'; }
  else if (percentage >= 70) { message = 'أداء جيد جدًا! اقتربت من التميز 👏'; emoji = '🌟'; color = 'text-cyan-400'; }
  else if (percentage >= 50) { message = 'لستَ بعيدًا عن الأفضل! واصل المذاكرة ✨'; emoji = '💡'; color = 'text-blue-400'; }
  else { message = 'لا تيأس، البداية دائمًا صعبة! واصل التدريب 🚀'; emoji = '🔥'; color = 'text-orange-400'; }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            {emoji}
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">نتيجة الاختبار</h1>

          {/* Score Circle */}
          <div className="relative w-32 h-32 mx-auto my-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={percentage >= 70 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                initial={{ strokeDasharray: '0 264' }}
                animate={{ strokeDasharray: `${percentage * 2.64} ${264 - percentage * 2.64}` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{percentage.toFixed(0)}%</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-gray-300">
              <span className="text-green-400 font-bold">{score}</span> صحيحة من <span className="text-cyan-400 font-bold">{attempted}</span> سؤال
            </p>
            <p className={`${color} font-bold text-lg`}>{message}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dental')}
              className="w-full bg-gradient-to-l from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition"
            >
              🔄 اختبار آخر
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white transition"
            >
              ← العودة للرئيسية
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-400">جارٍ التحميل...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}
