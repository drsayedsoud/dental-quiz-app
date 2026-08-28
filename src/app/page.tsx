'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';

export default function SplashPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        router.replace(user ? '/dashboard' : '/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]" />

              <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-5xl md:text-6xl mb-6 flex justify-center items-center gap-4 md:gap-6"
        >
          <span className="hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">🦷</span>
          <span className="hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">💊</span>
          <span className="text-6xl md:text-7xl hover:scale-110 transition-transform drop-shadow-[0_0_15px_rgba(56,189,248,0.5)] z-10">👨‍⚕️</span>
          <span className="hover:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(56,189,248,0.3)]">🩺</span>
        </motion.div>

        {/* App Name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold text-gradient mb-3"
        >
          Medical Prometric
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-gray-400 text-lg"
        >
          المنصة الشاملة للأطباء وأطباء الأسنان والصيادلة والتمريض
        </motion.p>

        {/* Loading dots */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
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
