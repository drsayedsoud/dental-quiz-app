'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { 
  getAllUsers, 
  toggleUserVip, 
  resetUserQuestionCount,
  UserProfile
} from '@/lib/firestore';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'files' | 'users'>('files');
  const [usersList, setUsersList] = useState<(UserProfile & { id: string })[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  // Upload states
  const [uploadingDental, setUploadingDental] = useState(false);
  const [uploadingMedical, setUploadingMedical] = useState(false);
  const [dentalStatus, setDentalStatus] = useState<string | null>(null);
  const [medicalStatus, setMedicalStatus] = useState<string | null>(null);

  const dentalFileInputRef = useRef<HTMLInputElement | null>(null);
  const medicalFileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!loading) {
      const isPinAuth = typeof window !== 'undefined' && sessionStorage.getItem('admin_pin_auth') === 'true';
      if (!user || (!isPinAuth && profile?.role !== 'admin' && user.email !== 'drsayedsoudnew@gmail.com')) {
        router.replace('/login');
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
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const handleToggleVip = async (uid: string, currentStatus: boolean) => {
    const success = await toggleUserVip(uid, currentStatus);
    if (success) setUsersList(prev => prev.map(u => u.id === uid ? { ...u, isVip: !currentStatus } : u));
  };

  const handleResetCount = async (uid: string) => {
    if (confirm('هل أنت متأكد من تصفير أسئلة هذا المستخدم؟')) {
      const success = await resetUserQuestionCount(uid);
      if (success) setUsersList(prev => prev.map(u => u.id === uid ? { ...u, questionCount: 0 } : u));
    }
  };

  const handleFileUpload = async (file: File, section: 'dental' | 'medical') => {
    const isDental = section === 'dental';
    if (isDental) {
      setUploadingDental(true);
      setDentalStatus(null);
    } else {
      setUploadingMedical(true);
      setMedicalStatus(null);
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

      const msg = `✅ تم رفع وتحديث ملف أسئلة ${isDental ? 'طب الأسنان' : 'الطب البشري'} بنجاح!`;
      if (isDental) setDentalStatus(msg);
      else setMedicalStatus(msg);
    } catch (err: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
      const errMsg = `❌ خطأ: ${err.message}`;
      if (isDental) setDentalStatus(errMsg);
      else setMedicalStatus(errMsg);
    } finally {
      if (isDental) {
        setUploadingDental(false);
        if (dentalFileInputRef.current) dentalFileInputRef.current.value = '';
      } else {
        setUploadingMedical(false);
        if (medicalFileInputRef.current) medicalFileInputRef.current.value = '';
      }
    }
  };

  const isPinAuthed = typeof window !== 'undefined' && sessionStorage.getItem('admin_pin_auth') === 'true';

  if (loading || !user || (!isPinAuthed && profile?.role !== 'admin' && user.email !== 'drsayedsoudnew@gmail.com')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-cyan-400">
        ⏳ جاري التحقق من صلاحيات الإدارة...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070707] text-white selection:bg-cyan-500/30 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl">
        {/* Top bar with back button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <span className="text-gradient">لوحة التحكم والإدارة</span>
          </h1>
          <Link
            href="/dashboard"
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
          >
            ← العودة للرئيسية
          </Link>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-3 mb-8 bg-white/5 p-1.5 rounded-2xl w-fit border border-white/10">
          <button 
            onClick={() => setActiveTab('files')}
            className={`px-5 py-2.5 rounded-xl text-sm transition font-bold ${
              activeTab === 'files' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📁 بنك الأسئلة وإدارة الملفات
          </button>
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-xl text-sm transition font-bold ${
              activeTab === 'users' 
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/30' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👥 إدارة المستخدمين
          </button>
        </div>

        {/* Files Tab */}
        {activeTab === 'files' && (
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
              <h2 className="text-lg font-bold text-white mb-1">📊 إدارة ملفات الأسئلة (Excel / CSV)</h2>
              <p className="text-gray-400 text-xs">
                يمكنك تنزيل ملف الأسئلة الحالي لكل قسم للتعديل عليه، أو رفع ملف جديد ليحل محل الملف الحالي ويستخدمه التطبيق مباشرة.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dental Section - Distinct Cyan/Blue Theme */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-b from-cyan-950/50 via-[#0c1822] to-[#080f14] border-2 border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.15)] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">🦷</span>
                    <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-full">
                      قسم طب الأسنان
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-cyan-300 mb-2">Dental Prometric</h3>
                  <p className="text-xs text-cyan-100/70 mb-6 leading-relaxed">
                    الملف المستخدم حالياً: <code className="bg-cyan-950/60 px-2 py-0.5 rounded text-cyan-200 border border-cyan-800/40">questions.csv</code>
                    <br />
                    يحتوي على كافة أسئلة وتخصصات طب الأسنان.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-cyan-500/20">
                  {/* Download Button */}
                  <a 
                    href="/questions.csv" 
                    download="prometric_dental_questions.csv"
                    className="w-full bg-cyan-600 hover:bg-cyan-500 active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 text-sm"
                  >
                    <span>⬇️</span>
                    <span>تنزيل ملف إكسيل / أسئلة الأسنان</span>
                  </a>

                  {/* Hidden File Input */}
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

                  {/* Upload Button */}
                  <button
                    onClick={() => dentalFileInputRef.current?.click()}
                    disabled={uploadingDental}
                    className="w-full bg-cyan-500/10 hover:bg-cyan-500/20 active:scale-[0.98] border border-cyan-500/40 text-cyan-300 py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <span>⬆️</span>
                    <span>{uploadingDental ? '⏳ جاري رفع وتحديث الملف...' : 'رفع ملف جديد ليحل محل الحالي'}</span>
                  </button>

                  {dentalStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`text-xs p-3 rounded-xl border ${
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

              {/* Medical Section - Distinct Emerald/Green Theme */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-b from-emerald-950/50 via-[#0c2017] to-[#08140e] border-2 border-emerald-500/40 shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col justify-between"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-4xl">👨‍⚕️</span>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full">
                      قسم الطب البشري
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-emerald-300 mb-2">Medical Prometric</h3>
                  <p className="text-xs text-emerald-100/70 mb-6 leading-relaxed">
                    الملف المستخدم حالياً: <code className="bg-emerald-950/60 px-2 py-0.5 rounded text-emerald-200 border border-emerald-800/40">questions_medical.csv</code>
                    <br />
                    يحتوي على كافة أسئلة وفروع الطب البشري.
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-emerald-500/20">
                  {/* Download Button */}
                  <a 
                    href="/questions_medical.csv" 
                    download="prometric_medical_questions.csv"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 text-sm"
                  >
                    <span>⬇️</span>
                    <span>تنزيل ملف إكسيل / أسئلة البشري</span>
                  </a>

                  {/* Hidden File Input */}
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

                  {/* Upload Button */}
                  <button
                    onClick={() => medicalFileInputRef.current?.click()}
                    disabled={uploadingMedical}
                    className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-[0.98] border border-emerald-500/40 text-emerald-300 py-3 px-4 rounded-xl font-bold transition flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                  >
                    <span>⬆️</span>
                    <span>{uploadingMedical ? '⏳ جاري رفع وتحديث الملف...' : 'رفع ملف جديد ليحل محل الحالي'}</span>
                  </button>

                  {medicalStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className={`text-xs p-3 rounded-xl border ${
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
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl overflow-x-auto">
            {isLoadingUsers ? (
              <p className="text-cyan-400">جاري تحميل المستخدمين...</p>
            ) : (
              <table className="w-full text-right text-sm">
                <thead>
                  <tr className="border-b border-white/20 text-gray-400">
                    <th className="pb-3">الإيميل</th>
                    <th className="pb-3 text-center">عدد الأسئلة المجابة</th>
                    <th className="pb-3 text-center">النقاط</th>
                    <th className="pb-3 text-center">حالة VIP</th>
                    <th className="pb-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition">
                      <td className="py-4 font-mono">{u.email}</td>
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
                      <td className="py-4 text-center flex justify-center gap-2">
                        <button 
                          onClick={() => handleResetCount(u.id)}
                          className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition text-xs"
                        >
                          تصفير الأسئلة
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
