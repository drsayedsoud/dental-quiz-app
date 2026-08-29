'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

const sectionIcons = [
  { icon: '👨‍⚕️', label: 'الطب البشري', color: 'rgba(99,102,241,0.4)' },
  { icon: '🦷', label: 'طب الأسنان', color: 'rgba(6,182,212,0.4)' },
  { icon: '💊', label: 'الصيدلة', color: 'rgba(16,185,129,0.4)' },
  { icon: '👩‍⚕️', label: 'التمريض', color: 'rgba(244,63,94,0.4)' },
];

export default function SplashPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        router.replace(user ? '/dashboard' : '/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center"
      >
        {/* Icons appearing one by one */}
        <div className="flex justify-center items-center gap-5 md:gap-8 mb-8">
          {sectionIcons.map((item, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{
                delay: 0.3 + i * 0.35,
                duration: 0.5,
                type: 'spring',
                stiffness: 200,
                damping: 15,
              }}
              className="flex flex-col items-center gap-1"
            >
              <motion.span
                animate={{ y: [0, -6, 0] }}
                transition={{
                  delay: 1.8 + i * 0.15,
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-5xl md:text-6xl"
                style={{ filter: `drop-shadow(0 0 12px ${item.color})` }}
              >
                {item.icon}
              </motion.span>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 + i * 0.35, duration: 0.4 }}
                className="text-[9px] text-gray-500 font-bold"
              >
                {item.label}
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gradient mb-3"
        >
          MedicalPro
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2.1, duration: 0.6 }}
          className="text-gray-400 text-base sm:text-lg px-4"
        >
          المنصة الشاملة لتحضير اختبارات القطاع الطبي
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="flex gap-2 justify-center mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2.5 h-2.5 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
