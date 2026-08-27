'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
  const phoneNumber = '+201019028987';
  const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D9%85%D9%86%D8%B5%D8%A9%20Medical%20Prometric`;

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden pb-10">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-500/5 rounded-full blur-[150px] pointer-events-none" />
      
      <div className="container mx-auto px-4 pt-8 max-w-2xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-3">
              من نحن؟
            </h1>
            <p className="text-gray-400 text-sm">
              تعرف على رؤيتنا ومميزات منصة Medical Prometric
            </p>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/10">
            {/* Intro */}
            <div className="mb-8">
              <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-cyan-400">💡</span> منصة احترافية متكاملة
              </h2>
              <p className="text-gray-300 text-sm leading-relaxed text-justify">
                نحن منصة تعليمية وتدريبية متخصصة تهدف إلى توفير بيئة محاكاة دقيقة وشاملة لطلاب وخريجي القطاع الطبي. نقدم بنوك أسئلة متطورة لمساعدتك في الاستعداد لاجتياز امتحانات الزمالة، البورد، والتراخيص الطبية محلياً ودولياً.
              </p>
            </div>

            {/* Tracks */}
            <div className="space-y-4">
              <h3 className="font-bold text-white text-base border-b border-white/10 pb-2 mb-4">
                المسارات التدريبية المتوفرة:
              </h3>
              
              {/* Human Medicine Track */}
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/30 shadow-sm">
                <h4 className="font-bold text-blue-300 text-sm mb-2 flex items-center gap-2">
                  <span>👨‍⚕️</span> مسار الطب البشري
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed mb-3">
                  ينقسم مسار الطب البشري إلى قسمين رئيسيين:
                  <br/>
                  <span className="text-blue-400 font-bold">• قسم الطلبة:</span> نغطي فيه <strong>جميع الموديولات</strong> الأكاديمية والسريرية (النظام التكاملي) لتدريب الطالب وتسهيل مراجعته طوال سنوات الكلية.
                  <br/>
                  <span className="text-blue-400 font-bold">• قسم الدراسات العليا:</span> نغطي فيه كافة التخصصات الطبية للتحضير بقوة لاجتياز امتحانات الزمالة والبورد وتراخيص مزاولة المهنة.
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-blue-100/80">
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-500/20 text-center">موديولات العلوم الأساسية</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-500/20 text-center">موديولات الطب السريري</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-500/20 text-center">أكثر من 20 تخصص طبي</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-blue-500/20 text-center">تحديثات مستمرة للأسئلة</div>
                </div>
              </div>

              {/* Dental Track */}
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 shadow-sm">
                <h4 className="font-bold text-cyan-300 text-sm mb-2 flex items-center gap-2">
                  <span>🦷</span> مسار طب الأسنان
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-cyan-100/80 mt-2">
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20 text-center">علاج الجذور (Endodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20 text-center">طب أسنان الأطفال (Pedodontics)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20 text-center">الجراحة (Oral Surgery)</div>
                  <div className="bg-black/30 p-2 rounded-lg border border-cyan-500/20 text-center">والعديد من التخصصات الدقيقة</div>
                </div>
              </div>

              {/* Pharmacy Track */}
              <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 shadow-sm">
                <h4 className="font-bold text-emerald-300 text-sm mb-2 flex items-center gap-2">
                  <span>💊</span> مسار الصيدلة
                </h4>
                <p className="text-xs text-gray-300 leading-relaxed">
                  يتم حالياً تجهيز بنك أسئلة ضخم ومحدث للصيادلة لاجتياز امتحانات البرومترك بكل ثقة وسهولة. (قريباً جداً).
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="mt-8 space-y-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <span>⭐</span> مميزات المنصة:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>أسئلة متجددة ومطابقة لأحدث امتحانات الهيئات</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>تفسيرات علمية دقيقة لكل إجابة (Explanations)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>إحصائيات دقيقة لمتابعة تطور مستواك</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>نظام عشوائي ذكي (Shuffle) في كل اختبار عام</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="border-t border-white/10 pt-6 mt-6">
              <div className="text-center mb-4">
                <p className="text-gray-400 text-xs font-medium">المنصة تحت إشراف وتطوير</p>
                <p className="text-white font-extrabold text-lg mt-1">د/ سيد سعيد إسماعيل</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-white/5 border border-white/20 text-white px-5 py-3 rounded-2xl text-sm font-bold hover:bg-white/10 transition"
                  dir="ltr"
                >
                  <span className="text-lg">📞</span>
                  <span>{phoneNumber}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-l from-green-600 to-emerald-600 text-white px-5 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-green-900/30 hover:from-green-500 hover:to-emerald-500 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>تواصل معي عبر واتساب</span>
                </a>
              </div>
            </div>
          </div>

          {/* Return Button */}
          <Link
            href="/dashboard"
            className="block mt-6 text-center bg-white/5 border border-white/10 rounded-2xl py-3.5 text-gray-300 hover:text-white hover:bg-white/10 transition text-sm font-bold"
          >
            العودة للصفحة الرئيسية
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
