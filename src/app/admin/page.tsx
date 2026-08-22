'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
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
  
  const [activeTab, setActiveTab] = useState<'users' | 'files'>('users');
  const [usersList, setUsersList] = useState<(UserProfile & { id: string })[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.replace('/login');
    }
  }, [user, profile, loading, router]);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [activeTab]);

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    const data = await getAllUsers();
    setUsersList(data);
    setIsLoadingUsers(false);
  };

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

  if (loading || !user || profile?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-white">جاري التحقق...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl pt-24">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">⚙️</span> لوحة التحكم والإدارة
        </h1>
        
        {/* Tabs */}
        <div className="flex gap-4 mb-8 bg-white/5 p-2 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-xl transition ${activeTab === 'users' ? 'bg-cyan-600 font-bold' : 'hover:bg-white/10'}`}
          >
            👥 المستخدمين
          </button>
          <button 
            onClick={() => setActiveTab('files')}
            className={`px-6 py-2 rounded-xl transition ${activeTab === 'files' ? 'bg-cyan-600 font-bold' : 'hover:bg-white/10'}`}
          >
            📁 بنك الأسئلة (Data Hub)
          </button>
        </div>

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
                      <td className="py-4">{u.email}</td>
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

        {activeTab === 'files' && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
             <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-cyan-400">النسخة المحلية للأسئلة</h2>
                <p className="text-gray-400 text-sm mt-1">الأسئلة تعمل الآن بشكل فائق السرعة من داخل خوادم الموقع</p>
              </div>
              <a 
                href="/questions.csv" 
                download="prometric_dental_questions.csv"
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold transition shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                ⬇️ تحميل الشيت
              </a>
            </div>
            
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
              <h3 className="text-green-400 font-bold mb-2">✅ حالة النظام</h3>
              <p className="text-sm text-green-200/70">
                الموقع متصل بالنسخة المستقرة، ويستخدم أرقام السطور القديمة لتقسيم التخصصات بنجاح. في حال رغبت بتعديل الأسئلة مستقبلاً، يمكنك تعديل الشيت وإرساله للمطور لدمجه.
              </p>
            </div>
          </div>
        )}
      </main>
          </div>
  );
}


