'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const score = parseInt(searchParams.get('score') || '0');
  const attempted = parseInt(searchParams.get('attempted') || '0');
  
  const percentage = attempted > 0 ? (score / attempted) * 100 : 0;

  let message = '';
  let emoji = '';
  let color = '';
  if (percentage >= 90) { message = 'Ù…Ù…ØªØ§Ø²! Ø§Ø³ØªÙ…Ø± ÙÙŠ Ù‡Ø°Ø§ Ø§Ù„Ø£Ø¯Ø§Ø¡ Ø§Ù„Ø±Ø§Ø¦Ø¹ ðŸ’ª'; emoji = 'ðŸ†'; color = 'text-yellow-400'; }
  else if (percentage >= 70) { message = 'Ø£Ø¯Ø§Ø¡ Ø¬ÙŠØ¯ Ø¬Ø¯Ù‹Ø§! Ø§Ù‚ØªØ±Ø¨Øª Ù…Ù† Ø§Ù„ØªÙ…ÙŠØ² ðŸ‘'; emoji = 'ðŸŒŸ'; color = 'text-cyan-400'; }
  else if (percentage >= 50) { message = 'Ù„Ø³ØªÙŽ Ø¨Ø¹ÙŠØ¯Ù‹Ø§ Ø¹Ù† Ø§Ù„Ø£ÙØ¶Ù„! ÙˆØ§ØµÙ„ Ø§Ù„Ù…Ø°Ø§ÙƒØ±Ø© âœ¨'; emoji = 'ðŸ’¡'; color = 'text-blue-400'; }
  else { message = 'Ù„Ø§ ØªÙŠØ£Ø³ØŒ Ø§Ù„Ø¨Ø¯Ø§ÙŠØ© Ø¯Ø§Ø¦Ù…Ù‹Ø§ ØµØ¹Ø¨Ø©! ÙˆØ§ØµÙ„ Ø§Ù„ØªØ¯Ø±ÙŠØ¨ ðŸš€'; emoji = 'ðŸ”¥'; color = 'text-orange-400'; }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="text-7xl mb-4"
          >
            {emoji}
          </motion.div>

          <h1 className="text-2xl font-bold text-white mb-2">Ù†ØªÙŠØ¬Ø© Ø§Ù„Ø§Ø®ØªØ¨Ø§Ø±</h1>

          {/* Score Circle */}
          <div className="relative w-32 h-32 mx-auto my-6">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1e293b" strokeWidth="8" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke={percentage >= 70 ? '#22c55e' : percentage >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8" strokeLinecap="round"
                strokeDasharray={`${percentage * 2.64} ${264 - percentage * 2.64}`}
                initial={{ strokeDasharray: '0 264' }}
                animate={{ strokeDasharray: `${percentage * 2.64} ${264 - percentage * 2.64}` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold text-white">{percentage.toFixed(0)}%</span>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <p className="text-gray-300">
              <span className="text-green-400 font-bold">{score}</span> ØµØ­ÙŠØ­Ø© Ù…Ù† <span className="text-cyan-400 font-bold">{attempted}</span> Ø³Ø¤Ø§Ù„
            </p>
            <p className={`${color} font-bold text-lg`}>{message}</p>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={() => router.push('/dental')}
              className="w-full bg-gradient-to-l from-cyan-600 to-blue-600 text-white font-bold py-3.5 rounded-xl hover:from-cyan-500 hover:to-blue-500 transition"
            >
              ðŸ”„ Ø§Ø®ØªØ¨Ø§Ø± Ø¢Ø®Ø±
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white transition"
            >
              â† Ø§Ù„Ø¹ÙˆØ¯Ø© Ù„Ù„Ø±Ø¦ÙŠØ³ÙŠØ©
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <p className="text-gray-400">Ø¬Ø§Ø±Ù Ø§Ù„ØªØ­Ù…ÙŠÙ„...</p>
      </div>
    }>
      <ResultContent />
    </Suspense>
  );
}



