'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8">
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass rounded-3xl p-8"
        >
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">🦷</div>
            <h1 className="text-2xl font-bold text-gradient">من نحن</h1>
          </div>

          <div className="text-gray-300 leading-relaxed space-y-4 text-sm">
            <p>
              <strong className="text-cyan-400">Prometric Dent Said</strong> هو تطبيق تعليمي متخصص في اختبارات طب الأسنان البرومترك.
            </p>
            <p>
              يحتوي التطبيق على آلاف الأسئلة المنتقاة من امتحانات سابقة، كورسات مكثفة، وأسئلة مُولّدة بالذكاء الاصطناعي.
            </p>
            <p>
              الأسئلة تغطي جميع التخصصات: Endodontic, Operative, Oral Surgery, Periodontic, Fixed & Removable Prosthodontic, Pedodontic, Orthodontic, Pathology, Radiology, Oral Medicine.
            </p>

            <div className="border-t border-white/10 pt-4 mt-4">
              <p className="text-gray-400">
                للتواصل: <strong className="text-white">د/ السيد أبوالسعود</strong>
              </p>
              <a
                href="https://wa.me/201003760234"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-xl text-sm hover:bg-green-500/20 transition"
              >
                📱 واتساب: 002 01003760234
              </a>
            </div>
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
