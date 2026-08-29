'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { createChallengeRoom, ChallengePlayer } from '@/lib/firestore';
import Papa from 'papaparse';
import { motion } from 'framer-motion';

export default function CreateChallengePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, profile } = useAuth();
  
  const [error, setError] = useState('');
  const [loadingMsg, setLoadingMsg] = useState('جاري تجهيز الغرفة...');

  useEffect(() => {
    const setupRoom = async () => {
      if (!user) {
        router.replace('/login');
        return;
      }

      const section = searchParams.get('section') || 'dental';
      const track = searchParams.get('track') || 'undergrad';

      try {
        setLoadingMsg('جاري سحب الأسئلة...');
        const response = await fetch(`/${section}_questions.csv`);
        const csvText = await response.text();
        
        const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        let data: any[] = parsed.data;

        if (section === 'dental' || section === 'medical') {
          if (track === 'undergrad') {
            data = data.filter((q: any) => !q['Target Audience'] || q['Target Audience'].toLowerCase().includes('undergrad') || q['Target Audience'].toLowerCase().includes('student'));
          } else if (track === 'grad') {
            data = data.filter((q: any) => q['Target Audience'] && (q['Target Audience'].toLowerCase().includes('grad') || q['Target Audience'].toLowerCase().includes('prometric')));
          }
        }

        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 10).map(q => ({
          question: q.Question || q.question || '',
          choices: [
            q['Option A'] || q.A || '',
            q['Option B'] || q.B || '',
            q['Option C'] || q.C || '',
            q['Option D'] || q.D || ''
          ].filter(Boolean),
          correct: q['Correct Answer'] || q.correct || '',
          explanation: q.Explanation || q.explanation || '',
          metadata: q['Subject/Topic'] || q.subject || ''
        }));

        if (selected.length === 0) {
          setError('لم نتمكن من العثور على أسئلة لهذا القسم.');
          return;
        }

        setLoadingMsg('جاري توليد كود التحدي...');
        const roomId = Math.floor(1000 + Math.random() * 9000).toString();
        
        const hostName = profile?.displayName || user.displayName || user.email?.split('@')[0] || 'اللاعب';
        const photoURL = user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${hostName}`;

        const hostPlayer: ChallengePlayer = {
          uid: user.uid,
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
          setError('حدث خطأ أثناء إنشاء الغرفة.');
        }

      } catch (err) {
        console.error(err);
        setError('حدث خطأ في قراءة ملف الأسئلة.');
      }
    };

    setupRoom();
  }, [user, profile, router, searchParams]);

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4" dir="rtl">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-6xl mb-6">
        ⚔️
      </motion.div>
      <h1 className="text-2xl font-bold text-white mb-2">تجهيز ساحة التحدي</h1>
      <p className="text-orange-400 animate-pulse">{loadingMsg}</p>
    </div>
  );
}
