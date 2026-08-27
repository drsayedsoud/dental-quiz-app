'use client';

import { useEffect, useState, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAlert } from '@/components/Modals';
import { ConfirmModal } from '@/components/Modals';
import { 
  getAllUsers, 
  toggleUserVip, 
  resetUserQuestionCount,
  UserProfile
} from '@/lib/firestore';

type TabType = 'stats' | 'files' | 'users' | 'tools';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const { showAlert, AlertComponent } = useAlert();
  
  const [activeTab, setActiveTab] = useState<TabType>('stats');
  const [usersList, setUsersList] = useState<(UserProfile & { id: string })[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Upload states
  const [uploadingDental, setUploadingDental] = useState(false);
  const [uploadingMedical, setUploadingMedical] = useState(false);
  const [uploadingNursing, setUploadingNursing] = useState(false);
  const [nursingStatus, setNursingStatus] = useState<{success: boolean; message: string} | null>(null);
  const nursingFileInputRef = useRef<HTMLInputElement>(null);
  const [dentalStatus, setDentalStatus] = useState<string | null>(null);
  const [medicalStatus, setMedicalStatus] = useState<string | null>(null);

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; uid: string; email: string }>({ open: false, uid: '', email: '' });

  const dentalFileInputRef = useRef<HTMLInputElement | null>(null);
  const medicalFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading) {
      const isPinAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_pin_auth') === 'true';
      if (!user || (!isPinAuth && profile?.role !== 'admin' && user.email !== 'drsayedsoudnew@gmail.com')) {
        router.replace('/dashboard');
      }
    }
  }, [user, profile, loading, router]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    const data = await getAllUsers();
    setUsersList(data);
    setIsLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleVip = async (uid: string, currentStatus: boolean) => {
    const success = await toggleUserVip(uid, currentStatus);
    if (success) setUsersList(prev => prev.map(u => u.id === uid ? { ...u, isVip: !currentStatus } : u));
  };

  const handleResetCount = async (uid: string, email: string) => {
    setConfirmModal({ open: true, uid, email });
  };

  const confirmReset = async () => {
    const { uid } = confirmModal;
    const success = await resetUserQuestionCount(uid);
    if (success) {
      setUsersList(prev => prev.map(u => u.id === uid ? { ...u, questionCount: 0 } : u));
      await showAlert('تم تصفير عداد الأسئلة بنجاح', '✅', 'success');
    }
    setConfirmModal({ open: false, uid: '', email: '' });
  };

  const handleFileUpload = async (file: File, section: 'dental' | 'medical' | 'nursing') => {
    const isDental = section === 'dental';
    if (isDental) {
      setUploadingDental(true);
      setDentalStatus(null);
    } else if (section === 'medical') {
      setUploadingMedical(true);
      setMedicalStatus(null);
    } else {
      setUploadingNursing(true);
      setNursingStatus(null);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('section', section);

      const res = await fetch('/api/admin/upload-questions', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'فشل في رفع الملف');
      }

      const msg = `✅ تم رفع وتحديث ملف أسئلة ${isDental ? 'طب الأسنان' : section === 'medical' ? 'الطب البشري' : 'التمريض'} بنجاح!`;
      if (isDental) setDentalStatus(msg);
      else if (section === 'medical') setMedicalStatus(msg);
      else setNursingStatus({ success: true, message: msg });
      await showAlert(msg, '📁', 'success');
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errMsg = `خطأ: ${err.message}`;
      if (isDental) setDentalStatus(`❌ ${errMsg}`);
      else if (section === 'medical') setMedicalStatus(`❌ ${errMsg}`);
      else setNursingStatus({ success: false, message: `❌ ${errMsg}` });
      await showAlert(errMsg, '❌', 'error');
    } finally {
      if (isDental) {
        setUploadingDental(false);
        if (dentalFileInputRef.current) dentalFileInputRef.current.value = '';
      } else if (section === 'medical') {
        setUploadingMedical(false);
        if (medicalFileInputRef.current) medicalFileInputRef.current.value = '';
      } else {
        setUploadingNursing(false);
        if (nursingFileInputRef.current) nursingFileInputRef.current.value = '';
      }
    }
  };

  const handleClearCache = async () => {
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
      await showAlert('تم مسح كاش المتصفح بنجاح!\nجاري إعادة التشغيل...', '🧹', 'success');
      window.location.href = window.location.origin + '/dashboard?reload=' + Date.now();
    } catch {
      window.location.reload();
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return usersList;
    const q = searchQuery.toLowerCase();
    return usersList.filter(u => u.email?.toLowerCase().includes(q));
  }, [usersList, searchQuery]);

  // Stats
  const stats = useMemo(() => {
    const totalUsers = usersList.length;
    const vipUsers = usersList.filter(u => u.isVip).length;
    const totalAnswered = usersList.reduce((sum, u) => sum + (u.questionCount || 0), 0);
    const totalPoints = usersList.reduce((sum, u) => sum + (u.totalPoints || 0), 0);
    const activeUsers = usersList.filter(u => (u.questionCount || 0) > 0).length;
    return { totalUsers, vipUsers, totalAnswered, totalPoints, activeUsers };
  }, [usersList]);

  const isPinAuthed = typeof window !== 'undefined' && sessionStorage.getItem('admin_pin_auth') === 'true';

  if (loading || !user || (!isPinAuthed && profile?.role !== 'admin' && user.email !== 'drsayedsoudnew@gmail.com')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">
        ⏳ جاري التحقق من صلاحيات الإدارة...
      </div>
    );
  }

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'stats', label: 'الإحصائيات', icon: '📊' },
    { id: 'files', label: 'بنك الأسئلة', icon: '📁' },
    { id: 'users', label: 'المستخدمين', icon: '👥' },
    { id: 'tools', label: 'أدوات النظام', icon: '🔧' },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-cyan-500/30 flex flex-col">
      {AlertComponent}
      <ConfirmModal
        isOpen={confirmModal.open}
        message={`هل أنت متأكد من تصفير عداد أسئلة\n${confirmModal.email}؟`}
        icon="⚠️"
        type="danger"
        confirmText="نعم، تصفير"
        cancelText="إلغاء"
        onConfirm={confirmReset}
        onCancel={() => setConfirmModal({ open: false, uid: '', email: '' })}
      />

      <main className="flex-grow container mx-auto px-3 sm:px-4 py-5 sm:py-8 max-w-5xl">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-5 sm:mb-8 gap-3">
          <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold flex items-center gap-2 sm:gap-3 min-w-0">
            <span className="text-2xl sm:text-3xl shrink-0">⚙️</span>
            <span className="text-gradient truncate">لوحة التحكم</span>
          </h1>
          <Link
            href="/dashboard"
            className="shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition"
          >
            ← الرئيسية
          </Link>
        </div>
        
        {/* Tabs - Mobile Scrollable */}
        <div className="flex gap-2 mb-5 sm:mb-8 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm transition font-bold flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* ====== STATS TAB ====== */}
        <AnimatePresence mode="wait">
        {activeTab === 'stats' && (
          <motion.div key="stats" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
              {[
                { label: 'إجمالي المستخدمين', value: stats.totalUsers, icon: '👥', color: 'cyan' },
                { label: 'مستخدمين VIP', value: stats.vipUsers, icon: '⭐', color: 'yellow' },
                { label: 'مستخدمين نشطين', value: stats.activeUsers, icon: '🟢', color: 'green' },
                { label: 'إجمالي الأسئلة المحلولة', value: stats.totalAnswered.toLocaleString(), icon: '📝', color: 'blue' },
                { label: 'إجمالي النقاط', value: stats.totalPoints.toLocaleString(), icon: '🏆', color: 'amber' },
              ].map((stat, i) => {
                const colorMap: Record<string, string> = {
                  cyan: 'border-cyan-500/30 from-cyan-950/40',
                  yellow: 'border-yellow-500/30 from-yellow-950/40',
                  green: 'border-green-500/30 from-green-950/40',
                  blue: 'border-blue-500/30 from-blue-950/40',
                  amber: 'border-amber-500/30 from-amber-950/40',
                };
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className={`bg-gradient-to-b ${colorMap[stat.color]} to-[#0a0a0a] border ${colorMap[stat.color].split(' ')[0]} rounded-2xl p-3 sm:p-4 text-center`}
                  >
                    <div className="text-2xl sm:text-3xl mb-1">{stat.icon}</div>
                    <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
                    <div className="text-[10px] sm:text-xs text-gray-400 mt-1 leading-tight">{stat.label}</div>
                  </motion.div>
                );
              })}
            </div>

            {/* Top Users Leaderboard */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <h3 className="text-sm sm:text-base font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span> أكثر المستخدمين نشاطاً
              </h3>
              <div className="space-y-2">
                {usersList
                  .sort((a, b) => (b.questionCount || 0) - (a.questionCount || 0))
                  .slice(0, 5)
                  .map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3 bg-white/5 rounded-xl p-3 border border-white/5">
                      <span className="text-lg sm:text-xl shrink-0">
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-white font-semibold truncate">{u.email}</p>
                        <p className="text-[10px] sm:text-xs text-gray-500">{u.questionCount || 0} سؤال محلول</p>
                      </div>
                      {u.isVip && <span className="text-yellow-400 text-xs shrink-0">⭐ VIP</span>}
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ====== FILES TAB ====== */}
        {activeTab === 'files' && (
          <motion.div key="files" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-5 sm:space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
              <h2 className="text-sm sm:text-lg font-bold text-white mb-1">📊 إدارة ملفات الأسئلة</h2>
              <p className="text-gray-400 text-[10px] sm:text-xs">
                تنزيل الملف الحالي للتعديل أو رفع ملف جديد ليحل محله مباشرة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Dental Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-cyan-950/50 via-[#0c1822] to-[#080f14] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">🦷</span>
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                      طب الأسنان
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-cyan-300 mb-1 sm:mb-2">Dental Prometric</h3>
                  <p className="text-[10px] sm:text-xs text-cyan-100/70 mb-4 sm:mb-6 leading-relaxed">
                    الملف: <code className="bg-cyan-950/60 px-1.5 py-0.5 rounded text-cyan-200 border border-cyan-800/40 text-[10px]">dental_questions.csv</code>
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-cyan-500/20">
                  <a 
                    href="/dental_questions.csv" 
                    download="dental_questions.csv"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 text-xs sm:text-sm"
                  >
                    <span>⬇️</span>
                    <span>تنزيل ملف الأسنان</span>
                  </a>

                  <input
                    ref={dentalFileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'dental');
                    }}
                  />

                  <button
                    onClick={() => dentalFileInputRef.current?.click()}
                    disabled={uploadingDental}
                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-[0.98] border border-cyan-500/40 text-cyan-300 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <span>⬆️</span>
                    <span>{uploadingDental ? '⏳ جاري الرفع...' : 'رفع ملف جديد'}</span>
                  </button>

                  {dentalStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`text-[10px] sm:text-xs p-2.5 sm:p-3 rounded-xl border ${
                        dentalStatus.includes('✅') 
                          ? 'bg-cyan-500/15 border-cyan-500/30 text-cyan-200' 
                          : 'bg-red-500/15 border-red-500/30 text-red-200'
                      }`}
                    >
                      {dentalStatus}
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Medical Section */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-2xl sm:rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-emerald-950/50 via-[#0c2017] to-[#08140e] border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl">👨‍⚕️</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-1 rounded-full">
                      الطب البشري
                    </span>
                  </div>

                  <h3 className="text-base sm:text-xl font-bold text-emerald-300 mb-1 sm:mb-2">Medical Prometric</h3>
                  <p className="text-[10px] sm:text-xs text-emerald-100/70 mb-4 sm:mb-6 leading-relaxed">
                    الملف: <code className="bg-emerald-950/60 px-1.5 py-0.5 rounded text-emerald-200 border border-emerald-800/40 text-[10px]">medical_questions.csv</code>
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-emerald-500/20">
                  <a 
                    href="/medical_questions.csv" 
                    download="medical_questions.csv"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 text-xs sm:text-sm"
                  >
                    <span>⬇️</span>
                    <span>تنزيل ملف البشري</span>
                  </a>

                  <input
                    ref={medicalFileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'medical');
                    }}
                  />

                  <button
                    onClick={() => medicalFileInputRef.current?.click()}
                    disabled={uploadingMedical}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] border border-emerald-500/40 text-emerald-300 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <span>⬆️</span>
                    <span>{uploadingMedical ? '⏳ جاري الرفع...' : 'رفع ملف جديد'}</span>
                  </button>

                  {medicalStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`text-[10px] sm:text-xs p-2.5 sm:p-3 rounded-xl border ${
                        medicalStatus.includes('✅') 
                          ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-200' 
                          : 'bg-red-500/15 border-red-500/30 text-red-200'
                      }`}
                    >
                      {medicalStatus}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ====== USERS TAB ====== */}
        {activeTab === 'users' && (
          <motion.div key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Search Bar */}
            <div className="mb-4 sm:mb-6">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 بحث بالإيميل..."
                  className="w-full bg-white/5 border border-white/15 rounded-2xl px-4 py-3 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition"
                  dir="ltr"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-lg"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                إجمالي: {filteredUsers.length} مستخدم {searchQuery ? `(من أصل ${usersList.length})` : ''}
              </p>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-10">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-4xl mb-3 inline-block">⏳</motion.div>
                <p className="text-gray-400 text-sm">جاري تحميل المستخدمين...</p>
              </div>
            ) : (
              <>
                {/* Mobile: Card Layout */}
                <div className="block lg:hidden space-y-3">
                  {filteredUsers.map((u) => (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs sm:text-sm text-white font-bold font-mono truncate flex-1 min-w-0" dir="ltr">{u.email}</p>
                        <button 
                          onClick={() => handleToggleVip(u.id, u.isVip || false)}
                          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold border transition active:scale-95 ${u.isVip ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/40'}`}
                        >
                          {u.isVip ? '⭐ VIP' : 'عادي'}
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>📝 <span className="text-white font-bold">{u.questionCount || 0}</span> سؤال</span>
                        <span>🏆 <span className="text-yellow-400 font-bold">{u.totalPoints || 0}</span> نقطة</span>
                      </div>
                      <button 
                        onClick={() => handleResetCount(u.id, u.email)}
                        className="w-full px-3 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition text-xs font-semibold active:scale-95"
                      >
                        🔄 تصفير عداد الأسئلة
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Desktop: Table Layout */}
                <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-xl overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead>
                      <tr className="border-b border-white/20 text-gray-400">
                        <th className="pb-3">الإيميل</th>
                        <th className="pb-3 text-center">الأسئلة المحلولة</th>
                        <th className="pb-3 text-center">النقاط</th>
                        <th className="pb-3 text-center">الحالة</th>
                        <th className="pb-3 text-center">إجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                          <td className="py-4 font-mono text-xs">{u.email}</td>
                          <td className="py-4 text-center font-mono">{u.questionCount || 0}</td>
                          <td className="py-4 text-center font-mono text-yellow-400">{u.totalPoints || 0}</td>
                          <td className="py-4 text-center">
                            <button 
                              onClick={() => handleToggleVip(u.id, u.isVip || false)}
                              className={`px-3 py-1 rounded-full text-xs font-bold border ${u.isVip ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50' : 'bg-gray-500/20 text-gray-400 border-gray-500/50 hover:bg-gray-500/40'}`}
                            >
                              {u.isVip ? '⭐ VIP' : 'عادي'}
                            </button>
                          </td>
                          <td className="py-4 text-center">
                            <button 
                              onClick={() => handleResetCount(u.id, u.email)}
                              className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition text-xs"
                            >
                              تصفير الأسئلة
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* ====== TOOLS TAB ====== */}
        {activeTab === 'tools' && (
          <motion.div key="tools" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {/* Clear Cache */}
              <button
                onClick={handleClearCache}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-right hover:bg-white/10 transition active:scale-[0.98] group"
              >
                <div className="text-3xl sm:text-4xl mb-3">🧹</div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">مسح كاش المتصفح</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">حذف جميع الملفات المؤقتة وإعادة تشغيل التطبيق بنسخة محدثة</p>
              </button>

              {/* Refresh Users */}
              <button
                onClick={fetchUsers}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-right hover:bg-white/10 transition active:scale-[0.98] group"
              >
                <div className="text-3xl sm:text-4xl mb-3">🔄</div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">تحديث بيانات المستخدمين</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">إعادة جلب أحدث بيانات ونتائج جميع المستخدمين المسجلين</p>
              </button>

              {/* WhatsApp Support */}
              <a
                href={`https://wa.me/201066415005?text=${encodeURIComponent('السلام عليكم، رسالة من لوحة تحكم الإدارة')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500/5 border border-green-500/20 rounded-2xl p-5 sm:p-6 text-right hover:bg-green-500/10 transition active:scale-[0.98]"
              >
                <div className="text-3xl sm:text-4xl mb-3">💬</div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">الدعم الفني (واتساب)</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-relaxed">تواصل مباشر مع فريق الدعم الفني والتطوير عبر واتساب</p>
              </a>

              {/* App Info */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 sm:p-6 text-right">
                <div className="text-3xl sm:text-4xl mb-3">ℹ️</div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-1">معلومات التطبيق</h3>
                <div className="space-y-1.5 mt-3 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>الإصدار</span>
                    <span className="font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-md">2.0.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>المنصة</span>
                    <span className="font-mono text-white">Vercel + Next.js</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>قاعدة البيانات</span>
                    <span className="font-mono text-white">Firebase Firestore</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>الأسئلة</span>
                    <span className="font-mono text-white">Google Sheets + CSV</span>
                  </div>
                </div>

            {/* Nursing Upload Card */}
            <div className="bg-[#0f172a]/80 backdrop-blur border border-purple-500/20 rounded-3xl overflow-hidden shadow-2xl relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-fuchsia-400" />
              
              <div className="p-4 sm:p-8 flex flex-col h-full">
                <div className="flex-1">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-4 sm:mb-6 border border-purple-500/20 shadow-inner">
                    👩‍⚕️
                  </div>
                  
                  <h3 className="text-base sm:text-xl font-bold text-purple-300 mb-1 sm:mb-2">Nursing Prometric</h3>
                  <p className="text-[10px] sm:text-xs text-purple-100/70 mb-4 sm:mb-6 leading-relaxed">
                    الملف: <code className="bg-purple-950/60 px-1.5 py-0.5 rounded text-purple-200 border border-purple-800/40 text-[10px]">nursing_questions.csv</code>
                  </p>
                </div>

                <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-purple-500/20">
                  <a 
                    href="/nursing_questions.csv" 
                    download="nursing_questions.csv"
                    className="w-full bg-purple-600 hover:bg-purple-500 active:scale-[0.98] text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 text-xs sm:text-sm"
                  >
                    <span>⬇️</span>
                    <span>تنزيل ملف التمريض</span>
                  </a>

                  <input
                    ref={nursingFileInputRef}
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'nursing');
                    }}
                  />

                  <button
                    onClick={() => nursingFileInputRef.current?.click()}
                    disabled={uploadingNursing}
                    className="w-full bg-purple-500/10 hover:bg-purple-500/20 active:scale-[0.98] border border-purple-500/40 text-purple-300 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-xs sm:text-sm"
                  >
                    <span>⬆️</span>
                    <span>{uploadingNursing ? '⏳ جاري الرفع...' : 'رفع ملف جديد'}</span>
                  </button>
                </div>

                {nursingStatus && (
                  <div className={`mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm ${
                    nursingStatus.success ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {nursingStatus.message}
                  </div>
                )}
              </div>
            </div>
              </div>
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </main>
    </div>
  );
}
