'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const phoneNumber = '01066415005';
  const whatsappUrl = `https://wa.me/201066415005?text=${encodeURIComponent('أهلاً بكم، اتصل بكم بخصوص ')}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="max-w-xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 text-4xl mb-3">
              <span>🩺</span>
              <span className="text-cyan-400 font-light">|</span>
              <span>🦷</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-gradient">
              منصة Prometric الطبية
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              الوجهة الشاملة للتحضير لاختبارات طب الأسنان والطب البشري
            </p>
          </div>

          {/* Body Content */}
          <div className="text-gray-300 leading-relaxed space-y-6 text-sm">
            {/* Intro */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
              <p className="text-justify leading-7">
                منصة <strong className="text-cyan-400">Prometric</strong> هي منصة تعليمية وتدريبية متخصصة ومصممة خصيصاً لتأهيل الأطباء وأطباء الأسنان لاجتياز اختبارات البرومترك والترخيص المهني (مثل امتحانات الهيئة السعودية SCFHS، الإمارات DHA/MOH/HAAD، قطر QCHP، وعمان OMSB) بأعلى درجات الكفاءة ومن أول محاولة.
              </p>
            </div>

            {/* Sections Breakdown */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>📚</span> الأقسام المتاحة بالمنصة:
              </h3>

              <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                <h4 className="font-bold text-cyan-400 mb-1 flex items-center gap-1.5">
                  <span>🦷</span> قسم طب الأسنان (Dental Prometric)
                </h4>
                <p className="text-xs text-gray-300 leading-6">
                  يضم بنك أسئلة ضخم ومحدث باستمرار يغطي كافة التخصصات الدقيقة: علاج الجذور (Endodontics)، الحشو والتحفظي (Operative)، جراحة الفم (Oral Surgery)، أمراض اللثة (Periodontics)، الاستعاضة السنية الثابتة والمتحركة (Prosthodontics)، طب أسنان الأطفال (Pedodontics)، التقويم (Orthodontics)، علم الأمراض (Pathology)، الأشعة (Radiology)، وطب الفم (Oral Medicine).
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                <h4 className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                  <span>👨‍⚕️</span> قسم الطب البشري (Medical Prometric)
                </h4>
                <p className="text-xs text-gray-300 leading-6">
                  بنك أسئلة شامل وتدريب مكثف يغطي فروع الطب البشري المختلفة: الباطنة العامة، الجراحة، طب الأطفال، النساء والتوليد، وطب الطوارئ، مدعوم بشروحات مركزة ونماذج امتحانات تفاعلية تحاكي الاختبار الفعلي.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>✨</span> لماذا تختار منصتنا؟
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
                <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-cyan-400">✔</span> محاكاة واقعية لنظام الاختبارات
                </li>
                <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-cyan-400">✔</span> أسئلة دورات وتجميعات محدثة
                </li>
                <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-cyan-400">✔</span> تتبع دقيق لمستوى التقدم والنتائج
                </li>
                <li className="flex items-center gap-2 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  <span className="text-cyan-400">✔</span> تجربة استخدام سلسة وشاشة لا تنطفئ
                </li>
              </ul>
            </div>

            {/* Contact & WhatsApp */}
            <div className="border-t border-white/10 pt-5 mt-6">
              <div className="text-center mb-3">
                <p className="text-gray-400 text-xs">الإشراف العام والتطوير</p>
                <p className="text-white font-bold text-base mt-0.5">د/ السيد أبوالسعود</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
                {/* Phone Call */}
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/15 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-white/10 transition"
                  dir="ltr"
                >
                  <span>📞</span>
                  <span>{phoneNumber}</span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-l from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-green-900/20 hover:from-green-500 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>محادثة واتساب</span>
                </a>
              </div>
            </div>
          </div>

          {/* Return button */}
          <Link
            href="/dashboard"
            className="block mt-6 text-center bg-white/5 border border-white/10 rounded-xl py-3 text-gray-400 hover:text-white hover:bg-white/10 transition text-sm font-semibold"
          >
            ← العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
