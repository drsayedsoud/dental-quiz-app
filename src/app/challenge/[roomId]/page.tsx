'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { joinChallengeRoom, updateRoomStatus, updatePlayerScore, ChallengeRoom, ChallengePlayer } from '@/lib/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChallengeRoomPage() {
  const router = useRouter();
  const params = useParams();
  const roomId = params.roomId as string;
  
  const { user, profile, loading: authLoading } = useAuth();

  const [room, setRoom] = useState<ChallengeRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myPlayerId, setMyPlayerId] = useState<string | null>(null);
  
  // Quiz State
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [myScore, setMyScore] = useState(0);

  // 1. Authentication & Join Logic
  useEffect(() => {
    if (authLoading) return;

    const initializePlayer = async () => {
      let uid = user?.uid;
      let name = profile?.displayName || user?.displayName || user?.email?.split('@')[0];
      let photoURL = user?.photoURL;

      // Handle Guest
      if (!uid) {
        const guestUid = sessionStorage.getItem('guest_uid');
        const guestName = sessionStorage.getItem('guest_name');
        if (!guestUid || !guestName) {
          router.replace(`/challenge/join?code=${roomId}`);
          return;
        }
        uid = guestUid;
        name = guestName;
      }

      if (!photoURL) {
        photoURL = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
      }

      setMyPlayerId(uid);

      const player: ChallengePlayer = {
        uid,
        name: name || 'لاعب',
        photoURL,
        score: 0,
        isReady: true,
        hasFinished: false
      };

      // Try to join
      const res = await joinChallengeRoom(roomId, player);
      if (!res.success && res.message !== 'المسابقة بدأت بالفعل!' && res.message !== 'الغرفة غير موجودة') {
        // If they were already in the room, it's fine, but if it failed for another reason:
        setError(res.message || 'حدث خطأ');
      }
    };

    initializePlayer();
  }, [user, profile, authLoading, roomId, router]);

  // 2. Real-time Subscription
  useEffect(() => {
    if (!myPlayerId) return;

    const roomRef = doc(db, 'rooms', roomId);
    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        setRoom(docSnap.data() as ChallengeRoom);
        setLoading(false);
      } else {
        setError('الغرفة غير موجودة أو تم إغلاقها.');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [roomId, myPlayerId]);

  if (loading || authLoading) {
    return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-orange-400 animate-pulse text-xl font-bold">جاري الاتصال بساحة التحدي... ⚔️</div>;
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="bg-red-500/10 text-red-400 p-6 rounded-2xl max-w-sm w-full text-center" dir="rtl">
          <span className="text-4xl block mb-4">❌</span>
          <p className="font-bold">{error}</p>
          <button onClick={() => router.replace('/dashboard')} className="mt-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-white w-full transition">العودة للرئيسية</button>
        </div>
      </div>
    );
  }

  const isHost = room.hostId === myPlayerId;
  const playersList = Object.values(room.players).sort((a, b) => b.score - a.score); // Sorted by score

  // ==========================================
  // VIEW 1: LOBBY (شاشة الانتظار)
  // ==========================================
  if (room.status === 'waiting') {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://dental-quiz-app.vercel.app';
    const shareText = encodeURIComponent(`تحداني في مسابقة ${room.section === 'dental' ? 'طب الأسنان' : room.section === 'medical' ? 'الطب البشري' : 'التمريض'} المباشرة! ⚔️🔥\nاستخدم كود الغرفة هذا: *${roomId}*\nأو ادخل من الرابط مباشرة:\n${origin}/challenge/join?code=${roomId}`);
    
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6" dir="rtl">
        <div className="max-w-2xl mx-auto pt-10">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 text-center relative overflow-hidden mb-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500"></div>
            <h1 className="text-3xl font-black text-white mb-2">غرفة التحدي</h1>
            <p className="text-gray-400 mb-8">شارك الكود مع أصدقائك لينضموا الآن</p>
            
            <div className="bg-black/50 border border-white/10 rounded-2xl p-6 inline-block mb-8">
              <p className="text-gray-500 text-xs mb-2">كود الغرفة</p>
              <p className="text-6xl font-black text-orange-400 tracking-widest">{roomId}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
              <a 
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500/20 text-green-400 border border-green-500/30 px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-500/30 transition"
              >
                <span>📱</span> دعوة عبر واتساب
              </a>
            </div>

            {isHost ? (
              <button 
                onClick={() => updateRoomStatus(roomId, 'playing')}
                disabled={playersList.length < 1} // Can start alone for testing, but ideally >1
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-red-600 text-white px-12 py-4 rounded-xl font-black text-lg hover:scale-105 transition active:scale-95 shadow-lg shadow-orange-500/30"
              >
                🚀 بدء المسابقة!
              </button>
            ) : (
              <div className="animate-pulse text-orange-400 font-bold bg-orange-500/10 py-3 rounded-xl">
                ⏳ في انتظار القائد لبدء المسابقة...
              </div>
            )}
          </div>

          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <span>👥</span> اللاعبون المتصلون ({playersList.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <AnimatePresence>
              {playersList.map((p) => (
                <motion.div 
                  key={p.uid}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center"
                >
                  <img src={p.photoURL} alt={p.name} className="w-16 h-16 rounded-full bg-black/50 mb-3 border-2 border-orange-500/50" />
                  <p className="text-white font-bold text-sm truncate w-full">{p.name}</p>
                  {p.uid === room.hostId && <span className="text-[10px] text-orange-400 mt-1 bg-orange-500/10 px-2 py-0.5 rounded-full">القائد 👑</span>}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PLAYING (شاشة اللعب والسباق)
  // ==========================================
  if (room.status === 'playing') {
    const currentQuestion = room.questions[currentQIndex];
    const isFinishedLocally = currentQIndex >= room.questions.length;

    // Handle answering
    const handleAnswer = async (choice: string) => {
      if (isAnswered) return;
      setSelectedAnswer(choice);
      setIsAnswered(true);

      let newScore = myScore;
      if (choice === currentQuestion.correct) {
        newScore += 10; // 10 points per correct answer
        setMyScore(newScore);
      }

      const hasFinished = currentQIndex === room.questions.length - 1;
      await updatePlayerScore(roomId, myPlayerId!, newScore, hasFinished);

      // Automatically go to next question after 1.5 seconds
      setTimeout(() => {
        if (!hasFinished) {
          setCurrentQIndex(prev => prev + 1);
          setSelectedAnswer(null);
          setIsAnswered(false);
        }
      }, 1500);
    };

    // If this player finished all 10 questions, wait for others
    if (isFinishedLocally) {
      const allFinished = playersList.every(p => p.hasFinished);
      if (allFinished && isHost) {
        updateRoomStatus(roomId, 'finished');
      }

      return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-4 text-center" dir="rtl">
          <span className="text-6xl mb-6">🏁</span>
          <h2 className="text-2xl font-bold text-white mb-2">لقد أنهيت الأسئلة!</h2>
          <p className="text-gray-400 mb-8">ننتظر باقي اللاعبين لإنهاء السباق...</p>
          
          <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-3xl p-6">
            <h3 className="text-orange-400 font-bold mb-4">الترتيب المؤقت</h3>
            <div className="space-y-3">
              {playersList.map((p, i) => (
                <div key={p.uid} className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold">#{i + 1}</span>
                    <img src={p.photoURL} alt={p.name} className="w-8 h-8 rounded-full" />
                    <span className="text-white text-sm">{p.name}</span>
                  </div>
                  <span className="text-orange-400 font-bold">{p.score} نقطة</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Active Quiz View
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col" dir="rtl">
        {/* Live Leaderboard Header */}
        <div className="bg-white/5 border-b border-white/10 p-2 sm:p-4 overflow-x-auto whitespace-nowrap flex gap-4 scrollbar-hide shrink-0">
          {playersList.map((p, i) => (
            <div key={p.uid} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${p.uid === myPlayerId ? 'bg-orange-500/20 border-orange-500/50' : 'bg-black/50 border-white/10'}`}>
              <span className="text-[10px] text-gray-500">#{i + 1}</span>
              <img src={p.photoURL} alt={p.name} className="w-6 h-6 rounded-full" />
              <span className="text-white text-xs font-bold">{p.name}</span>
              <span className="text-orange-400 text-xs font-black">{p.score}</span>
            </div>
          ))}
        </div>

        {/* Question Area */}
        <div className="flex-1 p-4 sm:p-6 max-w-3xl mx-auto w-full flex flex-col pt-8">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-sm font-bold bg-white/5 px-3 py-1 rounded-full">سؤال {currentQIndex + 1} من {room.questions.length}</span>
            <span className="text-orange-400 font-bold bg-orange-500/10 px-3 py-1 rounded-full">{myScore} نقطة</span>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 sm:p-8 rounded-3xl mb-8 shadow-xl shadow-black/50">
            <h2 className="text-lg sm:text-xl font-bold text-white leading-relaxed" dir="ltr">{currentQuestion.question}</h2>
          </div>

          <div className="space-y-3 flex-1" dir="ltr">
            {currentQuestion.choices.map((choice: string, idx: number) => {
              let btnClass = "w-full text-left p-4 sm:p-5 rounded-2xl border transition-all text-sm sm:text-base font-semibold shadow-md ";
              if (!isAnswered) {
                btnClass += "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:border-white/20 active:scale-[0.98]";
              } else {
                if (choice === currentQuestion.correct) {
                  btnClass += "bg-green-500/20 border-green-500 text-green-300"; // Correct answer glows green
                } else if (choice === selectedAnswer) {
                  btnClass += "bg-red-500/20 border-red-500 text-red-300"; // Wrong selected glows red
                } else {
                  btnClass += "bg-white/5 border-white/10 text-gray-500 opacity-50"; // Others fade out
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(choice)}
                  disabled={isAnswered}
                  className={btnClass}
                >
                  <div className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center shrink-0 text-xs opacity-70 mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-relaxed">{choice}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 3: FINISHED (النتائج النهائية - منصة التتويج)
  // ==========================================
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4" dir="rtl">
      <div className="w-full max-w-2xl text-center">
        <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-500 mb-12 drop-shadow-lg">
          🏆 النتائج النهائية 🏆
        </h1>

        <div className="flex items-end justify-center gap-2 sm:gap-6 mb-12 h-64">
          {/* 2nd Place */}
          {playersList[1] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex flex-col items-center w-1/3">
              <img src={playersList[1].photoURL} alt={playersList[1].name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-400 mb-2 z-10 bg-black" />
              <div className="bg-gradient-to-t from-gray-600/50 to-gray-400/50 w-full rounded-t-2xl border-t border-gray-300 flex flex-col justify-start pt-4 h-32 relative">
                <span className="text-3xl absolute -top-5 left-1/2 -translate-x-1/2">🥈</span>
                <span className="text-white font-bold truncate px-2 text-sm">{playersList[1].name}</span>
                <span className="text-gray-300 text-xs font-black">{playersList[1].score}</span>
              </div>
            </motion.div>
          )}

          {/* 1st Place */}
          {playersList[0] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="flex flex-col items-center w-1/3">
              <img src={playersList[0].photoURL} alt={playersList[0].name} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-yellow-400 mb-2 z-10 bg-black" />
              <div className="bg-gradient-to-t from-yellow-600/50 to-yellow-400/50 w-full rounded-t-2xl border-t border-yellow-300 flex flex-col justify-start pt-4 h-40 relative shadow-[0_0_30px_rgba(234,179,8,0.3)]">
                <span className="text-4xl absolute -top-6 left-1/2 -translate-x-1/2">👑</span>
                <span className="text-white font-bold truncate px-2 text-sm sm:text-base">{playersList[0].name}</span>
                <span className="text-yellow-200 text-sm font-black">{playersList[0].score}</span>
              </div>
            </motion.div>
          )}

          {/* 3rd Place */}
          {playersList[2] && (
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-col items-center w-1/3">
              <img src={playersList[2].photoURL} alt={playersList[2].name} className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-4 border-orange-700 mb-2 z-10 bg-black" />
              <div className="bg-gradient-to-t from-orange-900/50 to-orange-700/50 w-full rounded-t-2xl border-t border-orange-500 flex flex-col justify-start pt-4 h-24 relative">
                <span className="text-2xl absolute -top-4 left-1/2 -translate-x-1/2">🥉</span>
                <span className="text-white font-bold truncate px-2 text-xs">{playersList[2].name}</span>
                <span className="text-orange-300 text-xs font-black">{playersList[2].score}</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Other Players List */}
        {playersList.length > 3 && (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-4 max-w-md mx-auto text-left">
            {playersList.slice(3).map((p, i) => (
              <div key={p.uid} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0" dir="rtl">
                <div className="flex items-center gap-3">
                  <span className="text-gray-500 font-bold w-4">{i + 4}</span>
                  <img src={p.photoURL} alt={p.name} className="w-8 h-8 rounded-full" />
                  <span className="text-gray-300 text-sm">{p.name}</span>
                </div>
                <span className="text-gray-400 font-bold text-sm">{p.score}</span>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={() => router.replace('/dashboard')}
          className="mt-10 bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-bold transition"
        >
          خروج للرئيسية
        </button>
      </div>
    </div>
  );
}
