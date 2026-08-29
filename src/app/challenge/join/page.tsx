'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function JoinChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile, loading } = useAuth();
  
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in and has a code, skip this page
  useEffect(() => {
    if (!loading && user && code && code.length === 4) {
      router.replace(`/challenge/${code}`);
    }
  }, [user, loading, code, router]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 4) {
      alert('كود الغرفة يجب أن يكون 4 أرقام');
      return;
    }
    
    setIsSubmitting(true);

    if (!user) {
      if (!guestName.trim()) {
        alert('الرجاء إدخال اسمك للانضمام');
        setIsSubmitting(false);
        return;
      }
      // Save guest info to session storage
      sessionStorage.setItem('guest_name', guestName.trim());
      sessionStorage.setItem('guest_uid', 'guest_' + Math.random().toString(36).substr(2, 9));
    }

    router.push(`/challenge/${code}`);
  };

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 p-8 rounded-3xl w-full max-w-sm backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">⚔️</span>
          <h1 className="text-2xl font-bold text-white mb-2">تحدي الأصدقاء</h1>
          <p className="text-gray-400 text-sm">أدخل الكود للانضمام إلى الغرفة</p>
        </div>

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs mb-1">كود الغرفة (4 أرقام)</label>
            <input 
              type="text" 
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="مثال: 5932"
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-center text-2xl font-bold text-white tracking-widest focus:border-orange-500 focus:outline-none transition"
              required
            />
          </div>

          {!user && (
            <div>
              <label className="block text-gray-400 text-xs mb-1">اسمك (للحضور كضيف)</label>
              <input 
                type="text" 
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="اكتب اسمك الأول..."
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none transition"
                required
              />
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting || code.length !== 4 || (!user && !guestName.trim())}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold p-4 rounded-xl hover:from-orange-400 hover:to-red-500 transition disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isSubmitting ? 'جاري الانضمام...' : 'دخول الغرفة 🔥'}
          </button>
        </form>

        {!user && (
          <p className="text-center text-gray-500 text-[10px] mt-6">
            يمكنك إنشاء حساب دائم لاحقاً لحفظ تقدمك
          </p>
        )}
      </motion.div>
    </div>
  );
}
