/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Question {
  question: string;
  choices: string[];
  correct: string;
  explanation: string;
  detailed: string;
  metadata: string;
}

export default function ReviewPage() {
  const router = useRouter();
  const [wrongAnswers, setWrongAnswers] = useState<Question[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('wrongAnswers');
    if (stored) {
      setWrongAnswers(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 max-w-2xl mx-auto" dir="ltr">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-red-400 flex items-center gap-2">
          <span>📋</span> مراجعة الأخطاء
        </h1>
        <button 
          onClick={() => router.back()} 
          className="bg-white/5 hover:bg-white/10 text-gray-400 px-4 py-2 rounded-xl text-sm transition" 
          dir="rtl"
        >
          ← العودة
        </button>
      </div>

      {wrongAnswers.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">✨</div>
          <h2 className="text-xl font-bold text-gray-300 mb-2">لا توجد أخطاء لمراجعتها</h2>
          <p className="text-gray-500 text-sm">أداء مثالي! يبدو أنك أجبت على جميع الأسئلة بشكل صحيح.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {wrongAnswers.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5"
            >
              <div className="mb-4">
                <span className="text-red-400 text-xs font-bold mb-1 block">سؤال {index + 1}:</span>
                <p className="text-white text-base leading-relaxed font-medium">
                  {q.question}
                </p>
              </div>

              {expandedId === index ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="space-y-3"
                >
                  <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
                    <p className="text-green-400 text-xs font-bold mb-1">✅ الإجابة الصحيحة:</p>
                    <p className="text-gray-200 text-sm">{q.correct}</p>
                  </div>

                  {(q.explanation || (q.detailed && q.detailed !== 'nan')) && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 space-y-3">
                      {q.explanation && (
                        <div>
                          <p className="text-blue-400 text-xs font-bold mb-1">📘 Explanation:</p>
                          <p className="text-gray-300 text-sm">{q.explanation}</p>
                        </div>
                      )}
                      {q.detailed && q.detailed !== 'nan' && (
                        <div>
                          <p className="text-blue-400 text-xs font-bold mb-1">📝 Detailed:</p>
                          <p className="text-gray-300 text-sm">{q.detailed}</p>
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
                  onClick={() => setExpandedId(index)}
                  className="w-full bg-white/5 hover:bg-white/10 text-cyan-400 font-semibold py-2 rounded-xl text-sm transition"
                  dir="rtl"
                >
                  عرض الإجابة والشرح 👁️
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
