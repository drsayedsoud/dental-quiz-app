"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AdminPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || profile?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, profile, loading, router]);

  if (loading || !user || profile?.role !== 'admin') {
    return <div className="min-h-screen flex items-center justify-center text-white">جاري التحقق من الصلاحيات...</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-blue-500/30 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-4xl pt-24">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <span className="text-4xl">⚙️</span> لوحة التحكم
        </h1>
        
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4">قاعدة الأسئلة الحالية</h2>
          <p className="text-gray-400 mb-6">
            الموقع يقرأ الأسئلة حالياً من الملف المحلي المدمج معه لضمان السرعة القصوى وتجنب قيود جوجل. يمكنك تحميل النسخة الحالية من الأسئلة هنا:
          </p>
          <a 
            href="/questions.csv" 
            download="dental_quiz_questions.csv"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-blue-500/20"
          >
            ⬇️ تحميل ملف الأسئلة (CSV)
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
}