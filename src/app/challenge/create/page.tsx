'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createChallengeRoom, ChallengePlayer } from '@/lib/firestore';
import { motion } from 'framer-motion';

function CreateChallengeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  const [allQuestions, setAllQuestions] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [numQuestions, setNumQuestions] = useState(10);

  const section = searchParams.get('section') || 'dental';
  const track = searchParams.get('track') || 'undergrad';

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!user) {
        router.replace('/login');
        return;
      }

      try {
        const res = await fetch(`/api/questions?section=${section}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        
        const data = await res.json();
        let questions = data.questions || [];

        setAllQuestions(questions);

        // Extract unique subjects
        const uniqueSubjects = Array.from(new Set(questions.map((q: any) => q.metadata).filter(Boolean))) as string[];
        setSubjects(uniqueSubjects.sort());

      } catch (err) {
        console.error(err);
        setError('حدث خطأ في جلب بيانات القسم من الخادم.');
      } finally {
        setIsFetching(false);
      }
    };

    fetchQuestions();
  }, [user, router, section]);

  const handleCreateRoom = async () => {
    setIsCreating(true);

    try {
      // Filter questions
      let pool = allQuestions;
      if (selectedSubject !== 'all') {
        pool = allQuestions.filter(q => q.metadata === selectedSubject);
      }

      if (pool.length === 0) {
        setError('لا توجد أسئلة كافية لهذه المادة.');
        setIsCreating(false);
        return;
      }

      // Shuffle and slice
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, Math.min(numQuestions, pool.length));

      const roomId = Math.floor(1000 + Math.random() * 9000).toString();
      const hostName = (profile as any)?.displayName || user?.displayName || user?.email?.split('@')[0] || 'اللاعب';
      const photoURL = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostName}`;

      const hostPlayer: ChallengePlayer = {
        uid: user!.uid,
        name: hostName,
        photoURL,
        score: 0,
        isReady: true,
        hasFinished: false
      };

      const success = await createChallengeRoom(roomId, hostPlayer, section, track, selected);
      
      if (success) {
        router.replace(`/challenge/${roomId}`);
      } else {
        setError('حدث خطأ أثناء إنشاء الغرفة (تأكد من تعديل الـ Rules).');
        setIsCreating(false);
      }
    } catch (err) {
      console.error(err);
      setError('حدث خطأ غير متوقع.');
      setIsCreating(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl max-w-sm w-full text-center" dir="rtl">
          <span className="text-4xl block mb-4">❌</span>
          <p className="font-bold">{error}</p>
          <button onClick={() => router.back()} className="mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white w-full transition">عودة</button>
        </div>
      </div>
    );
  }

  if (isFetching || isCreating) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4" dir="rtl">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-6">
          ⚔️
        </motion.div>
        <h1 className="text-2xl font-bold text-white mb-2">تجهيز ساحة التحدي</h1>
        <p className="text-orange-400 animate-pulse">{isCreating ? 'جاري إنشاء الغرفة...' : 'جاري تحميل المواد...'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl w-full max-w-md backdrop-blur-md"
      >
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block drop-shadow-[0_0_15px_rgba(234,88,12,0.5)]">⚔️</span>
          <h1 className="text-2xl font-bold text-white mb-2">إعدادات التحدي</h1>
          <p className="text-gray-400 text-sm">حدد نوع التحدي قبل أن تدعو أصدقاءك</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 font-bold mb-2">المادة (الموضوع)</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-orange-500 focus:outline-none transition appearance-none"
            >
              <option value="all">🌐 شامل (جميع المواد)</option>
              {subjects.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-300 font-bold mb-2">عدد الأسئلة</label>
            <div className="grid grid-cols-3 gap-3">
              {[10, 20, 30].map(num => (
                <button
                  key={num}
                  onClick={() => setNumQuestions(num)}
                  className={`py-3 rounded-xl font-bold transition-all border ${numQuestions === num ? 'bg-orange-500/20 border-orange-500 text-orange-400' : 'bg-black/50 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white'}`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleCreateRoom}
            className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-lg py-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(220,38,38,0.5)] mt-4"
          >
            إنشاء ساحة التحدي 🔥
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CreateChallengePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-orange-400 animate-pulse">جاري التحميل...</div>}>
      <CreateChallengeContent />
    </Suspense>
  );
}
