'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { getUnresolvedReports } from '@/lib/firestore';
import { useAlert, usePrompt } from '@/components/Modals';

const sections = [
  {
    id: 'medical',
    title: 'الطب البشري',
    subtitle: 'Medical Prometric (أطباء)',
    icon: '👨‍⚕️',
    gradient: 'from-blue-600 to-indigo-700',
    href: '/medical',
    comingSoon: false,
  },
  {
    id: 'dental',
    title: 'طب الأسنان',
    subtitle: 'Dental Prometric (أطباء)',
    icon: '🦷',
    gradient: 'from-cyan-600 to-blue-700',
    href: '/dental',
    comingSoon: false,
  },
  {
    id: 'pharmacy',
    title: 'الصيدلة',
    subtitle: 'Pharmacy Prometric (صيادلة)',
    icon: '💊',
    gradient: 'from-emerald-600 to-teal-700',
    href: '#',
    comingSoon: true,
  },
  {
    id: 'nursing',
    title: 'التمريض',
    subtitle: 'Nursing Prometric (تمريض)',
    icon: '👩‍⚕️',
    gradient: 'from-pink-500 to-rose-500',
    href: '/nursing',
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
  const [reportsCount, setReportsCount] = useState(0);

  const isAdmin = user?.email === 'drsayedsoudnew@gmail.com' || profile?.role === 'admin';

  useEffect(() => {
    if (isAdmin) {
      getUnresolvedReports().then(reports => setReportsCount(reports.length)).catch(console.error);
    }
  }, [isAdmin]);

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
      await showAlert('هذا القسم قيد التطوير\nوسيتم تجهيز أسئلة هذا القسم قريباً إن شاء الله!', '📚', 'info');
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

  return (
    
      <div className="min-h-screen bg-[#0a0a0a] relative">
        {/* Deploy Version (Admin Only) */}
        {isAdmin && (
          <div className="absolute top-2 left-2 z-50 bg-white/5 text-white/40 px-2 py-0.5 rounded text-[10px] font-mono border border-white/10 shadow-lg">
            v12
          </div>
        )}

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

      <div className="relative z-10 px-4 py-6 md:py-8 w-full max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-3 pt-2"
        >
          <h1 className="text-2xl font-extrabold text-gradient mb-1">Medical Prometric</h1>
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
        <div className="space-y-3 mb-5 md:mb-8">
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
              className={`w-full bg-gradient-to-l ${section.gradient} rounded-2xl py-6 px-4 sm:py-7 sm:px-5 md:py-8 md:px-6 text-right hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-lg text-white select-none`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl md:text-4xl">{section.icon}</span>
                <div className="flex-1">
                  <h2 className="text-base md:text-lg font-bold">{section.title}</h2>
                  <p className="text-white/80 text-xs md:text-sm font-medium">{section.subtitle}</p>
                </div>
                <span className="text-white/40 text-2xl">
                  {section.comingSoon ? '🔒' : '←'}
                </span>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-3"
        >
          <button
            onClick={() => router.push('/stats')}
            className="w-full glass glass-hover rounded-xl py-3 text-blue-400 hover:text-blue-300 text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            📊 إحصائيات الأداء
          </button>
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <button
            onClick={logout}
            className="w-full bg-red-500/10 border border-red-500/20 rounded-xl py-3 text-red-400 hover:bg-red-500/20 text-sm font-semibold transition"
          >
            تسجيل خروج
          </button>

          {/* Admin settings & Share buttons */}
          <div className="pt-2 flex items-center justify-between">
            {isAdmin ? (
              <button
                onClick={() => router.push('/admin')}
                className="relative text-xs text-gray-500 hover:text-cyan-400 transition flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-white/5"
              >
                <span>⚙️</span>
                <span>خاص بالإدارة</span>
                {reportsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold min-w-[16px] h-[16px] flex items-center justify-center rounded-full shadow-lg shadow-red-500/50 animate-pulse">
                    {reportsCount}
                  </span>
                )}
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
                className="text-xs text-gray-600 hover:text-gray-500 transition p-1 rounded-md hover:bg-white/5 select-none cursor-default flex items-center justify-center w-8 h-8"
                title="إعدادات النظام"
              >
                ⚙️
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={() => {
                const message = "منصة Prometric الطبية المتخصصة 🩺🦷\nأفضل منظومة أكاديمية للتحضير لاختبارات مزاولة المهنة والترخيص الطبي (SCFHS, DHA, MOH) في طب الأسنان والطب البشري.\n\n✨ مميزات المنصة:\n✅ محاكاة للامتحانات الفعلية بنفس التوقيت\n✅ بنك أسئلة إكلينيكي متجدد\n✅ تفسيرات علمية دقيقة لكل إجابة\n\nجرب المنصة الآن وشاركها مع زملائك:\n" + window.location.origin;
                window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
              }}
              className="text-xs text-green-400 hover:text-green-300 transition flex items-center gap-2 py-1.5 px-3 rounded-lg border border-green-500/20 bg-green-500/10 hover:bg-green-500/20"
              title="مشاركة عبر واتساب"
            >
              <span className="font-bold">مشاركة التطبيق</span>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
