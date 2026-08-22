'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAlert, usePrompt } from '@/components/Modals';

const sections = [
  {
    id: 'medical',
    title: 'الطب البشري',
    subtitle: 'Medical Prometric (قريباً)',
    icon: '👨‍⚕️',
    gradient: 'from-blue-600 to-indigo-700 opacity-60 cursor-not-allowed',
    href: '#',
    comingSoon: true,
  },
  {
    id: 'dental',
    title: 'طب الأسنان',
    subtitle: 'Dental Prometric (جاهز)',
    icon: '🦷',
    gradient: 'from-cyan-600 to-blue-700',
    href: '/dental',
    comingSoon: false,
  },
];

export default function DashboardPage() {
  const { user, profile, loading, logout } = useAuth();
  const router = useRouter();
  const pressTimer = useRef<NodeJS.Timeout | null>(null);
  const medicalPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isMedicalLongPress = useRef(false);

  // Custom modals
  const { showAlert, AlertComponent } = useAlert();
  const { showPrompt, PromptComponent } = usePrompt();

  // For showing cache clear success before reload
  const [showCacheSuccess, setShowCacheSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  const handlePressStart = () => {
    pressTimer.current = setTimeout(async () => {
      const pin = await showPrompt('لوحة تحكم الإدارة', {
        subtitle: 'أدخل الرقم السري للدخول',
        icon: '🔐',
        placeholder: '••••',
        inputType: 'password',
      });
      if (pin === '1153') {
        sessionStorage.setItem('admin_pin_auth', 'true');
        router.push('/admin');
      } else if (pin !== null) {
        await showAlert('الرقم السري غير صحيح!', '🚫', 'error');
      }
    }, 1500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  };

  const handleMedicalPressStart = () => {
    isMedicalLongPress.current = false;
    medicalPressTimer.current = setTimeout(async () => {
      isMedicalLongPress.current = true;
      try {
        if ('caches' in window) {
          const cacheKeys = await window.caches.keys();
          await Promise.all(cacheKeys.map((key) => window.caches.delete(key)));
        }
        if ('serviceWorker' in navigator) {
          const registrations = await navigator.serviceWorker.getRegistrations();
          for (const reg of registrations) {
            await reg.unregister();
          }
        }
        sessionStorage.clear();
        setShowCacheSuccess(true);
      } catch (e) {
        console.error('Error clearing cache:', e);
        window.location.reload();
      }
    }, 1500);
  };

  const handleMedicalPressEnd = () => {
    if (medicalPressTimer.current) {
      clearTimeout(medicalPressTimer.current);
      medicalPressTimer.current = null;
    }
  };

  const handleSectionClick = async (section: typeof sections[0]) => {
    if (section.id === 'medical' && isMedicalLongPress.current) {
      isMedicalLongPress.current = false;
      return;
    }
    if (section.comingSoon) {
      await showAlert('هذا القسم قيد التطوير\nوسيتم توفير أسئلة الطب البشري قريباً إن شاء الله!', '📚', 'info');
    } else {
      router.push(section.href);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-cyan-400 text-xl">⏳ جاري التحميل...</div>
      </div>
    );
  }

  if (!user) return null;

  const isAdmin = user.email === 'drsayedsoudnew@gmail.com' || profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative">
      {/* Custom Modals */}
      {AlertComponent}
      {PromptComponent}

      {/* Cache Clear Success Overlay */}
      {showCacheSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative z-10 w-full max-w-sm bg-[#0f172a] border-2 border-green-500/50 rounded-3xl p-6 shadow-[0_0_40px_rgba(34,197,94,0.3)] text-center"
          >
            <div className="text-5xl mb-4">🧹</div>
            <p className="text-green-300 text-sm sm:text-base leading-relaxed font-semibold">
              تم مسح الكاش والملفات المؤقتة بنجاح!
            </p>
            <p className="text-gray-400 text-xs mt-2">جاري إعادة تشغيل التطبيق...</p>
            <button
              onClick={() => {
                window.location.href = window.location.origin + window.location.pathname + '?reload=' + Date.now();
              }}
              className="mt-5 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 rounded-2xl transition active:scale-95 text-sm"
            >
              إعادة التشغيل الآن
            </button>
          </motion.div>
        </div>
      )}

      {/* Background effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="relative z-10 px-4 py-8 max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-extrabold text-gradient mb-2">Prometric</h1>
          <p className="text-gray-400 text-sm">
            مرحباً {profile?.email?.split('@')[0] || 'بك'} 👋
          </p>
          {isAdmin ? (
            <motion.div
              animate={{ opacity: [0.85, 1, 0.85], scale: [0.98, 1.02, 0.98] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 mt-2.5 bg-gradient-to-r from-red-600/30 via-red-500/20 to-red-600/30 border-2 border-red-500 text-red-300 text-xs font-black px-4 py-1.5 rounded-full shadow-[0_0_25px_rgba(239,68,68,0.5)] backdrop-blur-md"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-80"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              <span>🛡️ مدير النظام</span>
            </motion.div>
          ) : profile?.isVip ? (
            <span className="inline-block mt-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
              ⭐ VIP
            </span>
          ) : null}
        </motion.div>

        {/* Section Cards */}
        <div className="space-y-4 mb-10">
          {sections.map((section, index) => (
            <motion.button
              key={section.id}
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.15 }}
              onMouseDown={section.id === 'medical' ? handleMedicalPressStart : undefined}
              onMouseUp={section.id === 'medical' ? handleMedicalPressEnd : undefined}
              onMouseLeave={section.id === 'medical' ? handleMedicalPressEnd : undefined}
              onTouchStart={section.id === 'medical' ? handleMedicalPressStart : undefined}
              onTouchEnd={section.id === 'medical' ? handleMedicalPressEnd : undefined}
              onClick={() => handleSectionClick(section)}
              className={`w-full bg-gradient-to-l ${section.gradient} rounded-2xl p-6 text-right hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg text-white select-none`}
            >
              <div className="flex items-center gap-4">
                <span className="text-5xl">{section.icon}</span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="text-white/60 text-sm mt-1">{section.subtitle}</p>
                </div>
                <span className="text-white/40 text-2xl">
                  {section.comingSoon ? '🔒' : '←'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => router.push('/quiz?section=dental&mode=simulation')}
            className="bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-400 p-4 rounded-2xl transition active:scale-95 text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">⏱️</span>
            <span className="text-xs sm:text-sm font-bold">امتحان محاكاة</span>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            onClick={() => router.push('/quiz?section=dental&mode=quick')}
            className="bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 p-4 rounded-2xl transition active:scale-95 text-center flex flex-col items-center justify-center gap-2"
          >
            <span className="text-2xl">🎯</span>
            <span className="text-xs sm:text-sm font-bold">اختبار سريع (10)</span>
          </motion.button>
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/bookmarks')}
            className="w-full glass glass-hover rounded-xl py-3 text-yellow-400 hover:text-yellow-300 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            ⭐ الأسئلة المحفوظة
          </button>
          <button
            onClick={() => router.push('/stats')}
            className="w-full glass glass-hover rounded-xl py-3 text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            📊 إحصائيات الأداء
          </button>
          <button
            onClick={() => router.push('/about')}
            className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white text-sm transition"
          >
            من نحن
          </button>
          <button
            onClick={() => router.push('/privacy')}
            className="w-full glass glass-hover rounded-xl py-3 text-gray-400 hover:text-white text-sm transition"
          >
            سياسة الخصوصية
          </button>
          <button
            onClick={logout}
            className="w-full bg-red-500/10 border border-red-500/20 rounded-xl py-3 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition"
          >
            تسجيل خروج
          </button>

          {/* Admin settings button - small and side */}
          <div className="pt-2 flex justify-start">
            {isAdmin ? (
              <button
                onClick={() => router.push('/admin')}
                className="text-xs text-gray-500 hover:text-cyan-400 transition flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5"
              >
                <span>⚙️</span>
                <span>خاص بالإدارة</span>
              </button>
            ) : (
              <button
                onMouseDown={handlePressStart}
                onMouseUp={handlePressEnd}
                onMouseLeave={handlePressEnd}
                onTouchStart={handlePressStart}
                onTouchEnd={handlePressEnd}
                onClick={(e) => {
                  e.preventDefault();
                }}
                className="text-xs text-gray-600 hover:text-gray-500 transition p-1 rounded-md hover:bg-white/5 select-none cursor-default"
                title=""
              >
                ⚙️
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
