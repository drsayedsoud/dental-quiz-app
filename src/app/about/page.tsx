'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutPage() {
  const phoneNumber = '01066415005';
  const whatsappMessage = 'السلام عليكم احدثكم بخصوص برنامج الاسئلة';
  const whatsappUrl = `https://wa.me/201066415005?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] px-4 py-8 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-cyan-500/5 rounded-full blur-[150px]" />

      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="glass rounded-3xl p-6 sm:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 text-4xl mb-3">
              <span>🩺</span>
              <span className="text-cyan-400 font-light text-2xl">|</span>
              <span>🦷</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gradient leading-tight">
              منصة Prometric الطبية المتخصصة
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm mt-2">
              المنظومة الأكاديمية الرائدة للتحضير لاختبارات مزاولة المهنة والترخيص الطبي في طب الأسنان والطب البشري
            </p>
          </div>

          {/* Body Content */}
          <div className="text-gray-300 leading-relaxed space-y-6 text-sm">
            {/* Vision & Mission */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h2 className="text-base font-bold text-cyan-400 mb-2 flex items-center gap-2">
                <span>🎯</span> الرؤية والرسالة الأكاديمية
              </h2>
              <p className="text-justify leading-7 text-xs sm:text-sm text-gray-200">
                أُسست المنصة لتكون مرجعاً تدريبياً إكلينيكياً متطوراً يهدف إلى تأهيل الأطباء البشريين وأطباء الأسنان لاجتياز اختبارات الكفاءة المهنية والترخيص الطبي (مثل امتحانات الهيئة السعودية للتخصصات الصحية <span className="text-cyan-300 font-semibold">SCFHS</span>، هيئة الصحة بدبي <span className="text-cyan-300 font-semibold">DHA</span>، وزارة الصحة الإماراتية <span className="text-cyan-300 font-semibold">MOH</span>، دائرة الصحة بأبوظبي <span className="text-cyan-300 font-semibold">DoH/HAAD</span>، واللجان الطبية بقطر وعُمان) وفق أحدث المعايير والبروتوكولات الطبية المعتمدة.
              </p>
            </div>

            {/* Specialization Tracks */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>🔬</span> المسارات الأكاديمية المتاحة بالمنصة:
              </h3>

              {/* Dental Track */}
              <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-sm">
                <h4 className="font-bold text-cyan-300 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span>🦷</span> مسار طب وجراحة الفم والأسنان (Dental Prometric)
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  يشتمل على بنك أسئلة إكلينيكي واسع ومحدث دورياً يغطي كافة فروع طب الأسنان التخصصية:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-cyan-100/80">
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">⚡ علاج الجذور واللب (Endodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">💎 التحفظي والترميم (Operative)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">✂️ جراحة الفم والفكين (Oral Surgery)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">🌿 أمراض اللثة (Periodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">👑 التركيبات الثابتة (Fixed Prostho)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">👄 التركيبات المتحركة (Removable)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">🧸 أسنان الأطفال (Pedodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">📐 تقويم الأسنان (Orthodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">🔬 علم الأمراض (Oral Pathology)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20">🩻 الأشعة والتشخيص (Radiology)</div>
                </div>
              </div>

              {/* Medical Track */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-sm">
                <h4 className="font-bold text-emerald-300 text-sm sm:text-base mb-2 flex items-center gap-2">
                  <span>👨‍⚕️</span> مسار الطب البشري العام والتخصصي (Medical Prometric)
                </h4>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  منظومة تدريبية شاملة للأطباء البشريين مبنية على سيناريوهات إكلينيكية واقعية تغطي:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-emerald-100/80">
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">🩺 الأمراض الباطنة (Internal Medicine)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">🔪 الجراحة العامة (General Surgery)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">👶 طب الأطفال (Pediatrics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">🤰 النساء والتوليد (Obstetrics & Gyn)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">🚑 طب الطوارئ (Emergency Medicine)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-emerald-500/20">🧬 العلوم الأساسية (Basic Sciences)</div>
                </div>
              </div>
            </div>

            {/* Platform Advantages */}
            <div className="space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>✨</span> الميزات المنهجية والتقنية للمنصة:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✔</span>
                  <span>محاكاة مطابقة لنظام وتوقيت الامتحان الفعلي</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✔</span>
                  <span>خوارزمية خلط عشوائي للأسئلة والخيارات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✔</span>
                  <span>تفسيرات علمية دقيقة لكل إجابة</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✔</span>
                  <span>خاصية الشاشة الدائمة (Always-On) أثناء المذاكرة</span>
                </div>
              </div>
            </div>

            {/* Direct Contact & WhatsApp */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-xs font-medium">الإشراف العام والتطوير الطبي</p>
                <p className="text-white font-extrabold text-lg mt-0.5">د/ السيد أبوالسعود</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {/* Phone Call */}
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-white/5 border border-white/20 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-white/10 transition"
                  dir="ltr"
                >
                  <span className="text-lg">📞</span>
                  <span>{phoneNumber}</span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-l from-green-600 to-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-green-900/30 hover:from-green-500 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>محادثة واتساب مباشرة</span>
                </a>
              </div>
            </div>
          </div>

          {/* Return Button */}
          <Link
            href="/dashboard"
            className="block mt-6 text-center bg-white/5 border border-white/10 rounded-2xl py-3.5 text-gray-300 hover:text-white hover:bg-white/10 transition text-sm font-bold"
          >
            ← العودة للرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
