'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function QuranPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-4">📖</div>
          <h1 className="text-2xl font-bold text-gradient mb-3">مسابقات القرآن</h1>
          <p className="text-gray-400 mb-6">قريبًا إن شاء الله...</p>
          <p className="text-gray-500 text-sm mb-6">
            يمكنك الآن زيارة المسابقة الحالية:
          </p>
          <a
            href="https://quranquiz.pythonanywhere.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-gradient-to-l from-emerald-600 to-teal-700 text-white font-bold py-3.5 rounded-xl hover:from-emerald-500 hover:to-teal-600 transition mb-4"
          >
            🌐 فتح مسابقة القرآن
          </a>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white transition"
          >
            ← العودة للرئيسية
          </button>
        </div>
      </motion.div>
    </div>
  );
}
