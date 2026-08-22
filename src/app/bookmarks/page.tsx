'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getBookmarks, toggleBookmark, Bookmark } from '@/lib/firestore';
import Link from 'next/link';

export default function BookmarksPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      getBookmarks(user.uid).then(data => {
        setBookmarks(data);
        setIsLoading(false);
      });
    }
  }, [user]);

  const handleRemove = async (bookmark: Bookmark) => {
    if (!user) return;
    const isNowBookmarked = await toggleBookmark(user.uid, bookmark);
    if (!isNowBookmarked) {
      setBookmarks(prev => prev.filter(b => b.id !== bookmark.id));
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-4xl text-cyan-500">⭐</motion.div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-2xl mx-auto" dir="ltr">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <span>⭐</span> المحفوظات
        </h1>
        <Link href="/dashboard" className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl text-sm transition" dir="rtl">
          ← العودة
        </Link>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">📑</div>
          <h2 className="text-xl font-bold text-gray-300 mb-2">لا توجد أسئلة محفوظة</h2>
          <p className="text-gray-500 text-sm">يمكنك حفظ الأسئلة الصعبة أثناء الاختبار لمراجعتها هنا لاحقاً.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {bookmarks.map((bookmark) => (
              <motion.div
                key={bookmark.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex justify-between items-start gap-4 mb-4">
                  <p className="text-white text-base leading-relaxed font-medium flex-1">
                    {bookmark.question}
                  </p>
                  <button 
                    onClick={() => handleRemove(bookmark)}
                    className="text-yellow-400 text-xl hover:scale-110 active:scale-90 transition-transform shrink-0"
                    title="إلغاء الحفظ"
                  >
                    ⭐
                  </button>
                </div>

                {expandedId === bookmark.id ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="space-y-3"
                  >
                    <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                      <p className="text-green-400 text-xs font-bold mb-1">✅ الإجابة الصحيحة:</p>
                      <p className="text-gray-200 text-sm">{bookmark.correct}</p>
                    </div>

                    {(bookmark.explanation || (bookmark.detailed && bookmark.detailed !== 'nan')) && (
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-3">
                        {bookmark.explanation && (
                          <div>
                            <p className="text-blue-400 text-xs font-bold mb-1">📘 Explanation:</p>
                            <p className="text-gray-300 text-sm">{bookmark.explanation}</p>
                          </div>
                        )}
                        {bookmark.detailed && bookmark.detailed !== 'nan' && (
                          <div>
                            <p className="text-blue-400 text-xs font-bold mb-1">📝 Detailed:</p>
                            <p className="text-gray-300 text-sm">{bookmark.detailed}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <button 
                      onClick={() => setExpandedId(null)}
                      className="w-full text-center text-gray-500 hover:text-white text-xs py-2 transition mt-2"
                      dir="rtl"
                    >
                      إخفاء الإجابة 🔼
                    </button>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setExpandedId(bookmark.id!)}
                    className="w-full bg-white/5 hover:bg-white/10 text-cyan-400 font-semibold py-2 rounded-xl text-sm transition"
                    dir="rtl"
                  >
                    عرض الإجابة والشرح 👁️
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
