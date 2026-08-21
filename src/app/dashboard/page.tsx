'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const sections = [
  {
    id: 'dental',
    title: 'طب الأسنان',
    subtitle: 'Prometric Dental Exams',
    icon: '🦷',
    gradient: 'from-cyan-600 to-blue-700',
    href: '/dental',
  },
  {
    id: 'quran',
    title: 'مسابقات القرآن',
    subtitle: 'Quran Competitions',
    icon: '📖',
    gradient: 'from-gray-100 to-white text-gray-900',
    href: '/quran',
  },
];

export default function DashboardPage() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 text-xl">⏳ جارٍ التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gradient mb-2">Prometric Dent Said</h1>
          <p className="text-gray-400 text-sm">
            مرحباً {profile?.email?.split('@')[0] || 'بك'} 👋
          </p>
          {profile?.isVip && (
            <span className="inline-block mt-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
              ⭐ VIP
            </span>
          )}
        </motion.div>

        {/* Section Cards */}
        <div className="space-y-4 mb-10">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              onClick={() => router.push(section.href)}
              className={`w-full bg-gradient-to-l ${section.gradient} rounded-2xl p-6 text-right hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{section.icon}</span>
                <div className="flex-1">
                  <h2 className={`text-xl font-bold ${section.id === 'quran' ? 'text-gray-900' : 'text-white'}`}>{section.title}</h2>
                  <p className={`text-sm mt-1 ${section.id === 'quran' ? 'text-gray-600' : 'text-white/60'}`}>{section.subtitle}</p>
                </div>
                <span className={`text-2xl ${section.id === 'quran' ? 'text-gray-400' : 'text-white/40'}`}>←</span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/about')}
            className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white text-sm transition"
          >
            من نحن
          </button>
          <button
            onClick={() => router.push('/privacy')}
            className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white text-sm transition"
          >
            سياسة الخصوصية
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500/10 border border-red-500/20 rounded-xl py-3 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition"
          >
            تسجيل خروج
          </button>
        </motion.div>
      </div>
    </div>
  );
}
