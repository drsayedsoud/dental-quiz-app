'use client';

import { useEffect, useState, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { incrementQuestionCount, saveQuizSession } from '@/lib/firestore';

interface Question {
  question: string;
  choices: string[];
  correct: string;
  explanation: string;
  detailed: string;
  metadata: string;
}

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, profile, refreshProfile } = useAuth();

  const subject = searchParams.get('subject');
  const section = searchParams.get('section') || 'dental';
  const mode = searchParams.get('mode');
  const startIndex = parseInt(searchParams.get('startIndex') || '0');

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [attempted, setAttempted] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isMuted, setIsMuted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState('');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const sessionSavedRef = useRef(false);

  // Fetch questions
  useEffect(() => {
    async function fetchQuestions() {
      try {
        const params = new URLSearchParams();
        if (subject) {
          params.set('subject', subject);
          params.set('startIndex', String(startIndex));
        }
        if (mode === 'exam') params.set('mode', 'exam');
        params.set('section', section);

        const res = await fetch(`/api/questions?${params.toString()}`);
        if (!res.ok) throw new Error('Failed to fetch questions');
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError('Ø­Ø¯Ø« Ø®Ø·Ø£ ÙÙŠ ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©. Ø­Ø§ÙˆÙ„ Ù…Ø±Ø© Ø£Ø®Ø±Ù‰.');
      } finally {
        setLoadingQuestions(false);
      }
    }
    fetchQuestions();
  }, [subject, startIndex, mode, section]);

  // Initialize audio
  useEffect(() => {
    correctSoundRef.current = new Audio('/sounds/win.mp3');
    wrongSoundRef.current = new Audio('/sounds/lose.mp3');
    const savedMute = sessionStorage.getItem('isMuted') === 'true';
    setTimeout(() => setIsMuted(savedMute), 0);
  }, []);

  // Timer
  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      saveSession();
      router.push(/result?score=&attempted=&subject=&section=);
    } else {
      setCurrentIndex(prev => prev + 1);
      setAnswered(false);
      setSelected(null);
      setTimeout(() => setTimeLeft(30), 0);
      setShowExplanation(false);
    }
  }, [currentIndex, questions.length, score, attempted, subject, section, router]);

  useEffect(() => {
    if (loadingQuestions || answered || questions.length === 0) return;
    setTimeout(() => setTimeLeft(30), 0);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleNext();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, loadingQuestions, answered, questions.length]);

  const currentQuestion = questions[currentIndex];

  const handleAnswer = useCallback(async (choice: string) => {
    if (answered || !currentQuestion) return;
    setAnswered(true);
    setSelectedAnswer(choice);
    if (timerRef.current) clearInterval(timerRef.current);

    const isCorrect = choice === currentQuestion.correct;
    if (isCorrect) setScore(prev => prev + 1);
    setAttempted(prev => prev + 1);

    // Play sound
    if (!isMuted) {
      try {
        const sound = isCorrect ? correctSoundRef.current : wrongSoundRef.current;
        if (sound) { sound.currentTime = 0; sound.play(); }
      } catch {}
    }

    // Increment counter in Firestore
    if (user) {
      try { await incrementQuestionCount(user.uid); } catch {}
    }
  }, [answered, currentQuestion, isMuted, user]);

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      // Save session and go to results
      if (user) {
        saveQuizSession(user.uid, {
          subject: subject || 'Ù…Ø®ØªÙ„Ø·',
          score,
          attempted: attempted,
          lastQuestionIndex: currentIndex,
          section: section as 'dental' | 'quran',
        }).catch(() => {});
        refreshProfile().catch(() => {});
      }
      const params = new URLSearchParams({
        score: String(score),
        attempted: String(attempted),
        total: String(questions.length),
      });
      router.replace(`/result?${params.toString()}`);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setAnswered(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, [currentIndex, questions.length, score, attempted, subject, section, user, router, refreshProfile]);

  const handleFinish = async () => {
    if (user) {
      await saveQuizSession(user.uid, {
        subject: subject || 'Ù…Ø®ØªÙ„Ø·',
        score,
        attempted,
        lastQuestionIndex: currentIndex,
        section: section as 'dental' | 'quran',
      }).catch(() => {});
      refreshProfile().catch(() => {});
    }
    const params = new URLSearchParams({
      score: String(score),
      attempted: String(attempted),
      total: String(questions.length),
    });
    router.replace(`/result?${params.toString()}`);
  };

  const toggleMute = () => {
    const newVal = !isMuted;
    setIsMuted(newVal);
    sessionStorage.setItem('isMuted', String(newVal));
  };

  const copyToAI = () => {
    if (currentQuestion) {
      navigator.clipboard.writeText(currentQuestion.question).then(() => {
        window.open('https://chat.openai.com/', '_blank');
      });
    }
  };

  // Loading state
  if (loadingQuestions) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a]">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-4xl mb-4">ðŸ¦·</motion.div>
        <p className="text-gray-400">Ø¬Ø§Ø±Ù ØªØ­Ù…ÙŠÙ„ Ø§Ù„Ø£Ø³Ø¦Ù„Ø©...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] px-4">
        <p className="text-red-400 text-lg mb-4">{error || 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø£Ø³Ø¦Ù„Ø© Ù…ØªØ§Ø­Ø©'}</p>
        <button onClick={() => router.back()} className="bg-cyan-600 text-white px-6 py-3 rounded-xl">Ø§Ù„Ø¹ÙˆØ¯Ø©</button>
      </div>
    );
  }

  const percentage = attempted > 0 ? ((score / attempted) * 100).toFixed(1) : '0.0';
  const timerPercent = (timeLeft / 30) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-4 max-w-2xl mx-auto" dir="ltr">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm">
          <span className="text-cyan-400 font-bold">Score: {score}/{attempted}</span>
          <span className="text-gray-500 mr-2"> ({percentage}%)</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggleMute} className="text-xl">{isMuted ? 'ðŸ”‡' : 'ðŸ”Š'}</button>
          <span className={`font-mono font-bold text-lg ${timeLeft <= 10 ? 'text-red-400' : 'text-cyan-400'}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Timer Progress Bar */}
      <div className="w-full h-1.5 bg-gray-800 rounded-full mb-4 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${timeLeft <= 10 ? 'bg-red-500' : 'bg-cyan-500'}`}
          animate={{ width: `${timerPercent}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* Question Counter */}
      <div className="text-center mb-4">
        {subject && <p className="text-cyan-400 font-bold mb-1">ðŸ“˜ {subject}</p>}
        <p className="text-gray-500 text-sm">Question {currentIndex + 1} of {questions.length}</p>
      </div>

      {/* Question */}
      <motion.div
        key={currentIndex}
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="glass rounded-2xl p-5 mb-4"
      >
        <p className="text-white text-base leading-relaxed font-medium">{currentQuestion.question}</p>
        {currentQuestion.metadata && currentQuestion.metadata !== 'nan' && (
          <p className="text-gray-500 text-xs mt-2">{currentQuestion.metadata}</p>
        )}
      </motion.div>

      {/* Choices */}
      <div className="space-y-3 mb-6">
        {currentQuestion.choices.map((choice, i) => {
          let bg = 'glass glass-hover';
          if (answered) {
            if (choice === currentQuestion.correct) bg = 'bg-green-600/20 border-green-500/40';
            else if (choice === selectedAnswer) bg = 'bg-red-600/20 border-red-500/40';
            else bg = 'glass opacity-50';
          }
          return (
            <motion.button
              key={i}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: i * 0.08 }}
              onClick={() => handleAnswer(choice)}
              disabled={answered}
              className={`w-full ${bg} border rounded-xl p-4 text-right text-white text-sm transition hover:border-cyan-500/30 disabled:cursor-default`}
            >
              <span className="text-cyan-400 font-bold ml-2">{String.fromCharCode(65 + i)}.</span>
              {choice}
            </motion.button>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {answered && (
          <>
            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="w-full bg-purple-500/10 border border-purple-500/20 text-purple-400 py-3 rounded-xl text-sm font-semibold hover:bg-purple-500/20 transition"
            >
              {showExplanation ? 'ðŸ”½ Ø¥Ø®ÙØ§Ø¡ Ø§Ù„Ø´Ø±Ø­' : 'ðŸ“˜ Ø¹Ø±Ø¶ Ø§Ù„Ø´Ø±Ø­'}
            </button>

            {showExplanation && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="glass rounded-xl p-4 space-y-3"
              >
                {currentQuestion.explanation && (
                  <div>
                    <p className="text-cyan-400 text-xs font-bold mb-1">ðŸ“˜ Explanation:</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{currentQuestion.explanation}</p>
                  </div>
                )}
                {currentQuestion.detailed && currentQuestion.detailed !== 'nan' && (
                  <div>
                    <p className="text-cyan-400 text-xs font-bold mb-1">ðŸ“ Detailed:</p>
                    <p className="text-gray-300 text-sm leading-relaxed">{currentQuestion.detailed}</p>
                  </div>
                )}
              </motion.div>
            )}
          </>
        )}

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-l from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition"
        >
          {currentIndex >= questions.length - 1 ? 'ðŸ Ø¥Ù†Ù‡Ø§Ø¡' : 'â†’ Ø§Ù„Ø³Ø¤Ø§Ù„ Ø§Ù„ØªØ§Ù„ÙŠ'}
        </button>

        <button onClick={copyToAI} className="w-full bg-violet-500/10 border border-violet-500/20 text-violet-400 py-3 rounded-xl text-sm font-semibold hover:bg-violet-500/20 transition">
          ðŸ¤– Ask AI
        </button>

        <button onClick={handleFinish} className="w-full bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl text-sm font-semibold hover:bg-red-500/20 transition">
          ðŸ›‘ Ø¥Ù†Ù‡Ø§Ø¡ Ø§Ù„Ø¬Ù„Ø³Ø©
        </button>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-400">Ø¬Ø§Ø±Ù Ø§Ù„ØªØ­Ù…ÙŠÙ„...</p>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}


