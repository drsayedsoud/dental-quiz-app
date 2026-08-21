'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-8"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🔒</div>
            <h1 className="text-2xl font-bold text-gradient">سياسة الخصوصية</h1>
          </div>

          <div className="text-gray-300 leading-relaxed space-y-4 text-sm">
            <p>
              نحن نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية.
            </p>
            <p>
              <strong className="text-cyan-400">البيانات التي نجمعها:</strong><br />
              نحتفظ فقط ببريدك الإلكتروني لتتبع تقدمك في الأسئلة وعدد الأسئلة التي أجبت عليها.
            </p>
            <p>
              <strong className="text-cyan-400">ماذا نفعل بالبيانات:</strong><br />
              لا يتم مشاركة نتائجك أو بياناتك مع أي طرف ثالث. بياناتك مخزنة بشكل آمن على خوادم Firebase.
            </p>
            <p>
              <strong className="text-cyan-400">حقوقك:</strong><br />
              يمكنك طلب حذف حسابك وبياناتك في أي وقت عبر التواصل معنا.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="block mt-6 text-center bg-white/5 border border-white/10 rounded-xl py-3 text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            ← العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
