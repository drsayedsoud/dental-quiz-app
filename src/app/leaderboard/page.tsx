'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getGlobalLeaderboard, UserProfile } from '@/lib/firestore';
import { useAuth } from '@/context/AuthContext';
import { LeaderboardRowSkeleton } from '@/components/Skeleton';

export default function LeaderboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<(UserProfile & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getGlobalLeaderboard(50).then(data => {
      setLeaders(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 pt-6 px-4" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            لوحة الشرف 🏆
          </h1>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm transition"
          >
            العودة
          </button>
        </div>

        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/5 border border-cyan-500/20 rounded-3xl p-6 mb-8 text-center">
          <h2 className="text-xl font-bold text-cyan-400 mb-2">أفضل الأطباء على مستوى التطبيق</h2>
          <p className="text-gray-400 text-sm">يتم تحديث النقاط تلقائياً بعد كل اختبار تنهيه بنجاح</p>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => <LeaderboardRowSkeleton key={i} />)}
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-20 text-gray-500">لا يوجد بيانات حتى الآن. كن أنت الأول!</div>
        ) : (
          <div className="space-y-3">
            {leaders.map((leader, index) => {
              const isCurrentUser = user?.uid === leader.id;
              
              // Styling for top 3
              let rankStyle = "bg-white/5 border-white/5 text-gray-400";
              let rankIcon = `#${index + 1}`;
              
              if (index === 0) {
                rankStyle = "bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 border-yellow-500/50 text-yellow-400";
                rankIcon = "🥇";
              } else if (index === 1) {
                rankStyle = "bg-gradient-to-r from-gray-300/20 to-gray-400/10 border-gray-300/50 text-gray-300";
                rankIcon = "🥈";
              } else if (index === 2) {
                rankStyle = "bg-gradient-to-r from-orange-500/20 to-orange-600/10 border-orange-500/50 text-orange-400";
                rankIcon = "🥉";
              } else if (isCurrentUser) {
                rankStyle = "bg-cyan-500/20 border-cyan-500/50 text-cyan-300";
              }

              return (
                <div 
                  key={leader.id} 
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all hover:scale-[1.01] ${rankStyle} ${isCurrentUser ? 'shadow-[0_0_15px_rgba(6,182,212,0.2)]' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 text-center font-black text-xl">{rankIcon}</div>
                    <img 
                      src={leader.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${leader.displayName || 'User'}`} 
                      alt="Avatar" 
                      className="w-12 h-12 rounded-full bg-black/50 border border-white/10"
                    />
                    <div>
                      <h3 className="font-bold text-white truncate max-w-[150px] sm:max-w-[300px]">
                        {leader.displayName || leader.email?.split('@')[0] || 'طبيب'}
                      </h3>
                      {leader.major && (
                        <p className="text-xs opacity-70">
                          {leader.major === 'dental' ? 'طب الأسنان' : leader.major === 'medical' ? 'طب بشري' : leader.major === 'pharmacy' ? 'صيدلة' : 'تمريض'}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-black text-xl">{leader.totalPoints || 0}</div>
                    <div className="text-[10px] opacity-70">نقطة</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
