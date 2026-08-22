'use client';

import { useRouter } from 'next/navigation';

const subjects = [
  { name: 'Anatomy', icon: '🦴' },
  { name: 'Physiology', icon: '🧬' },
  { name: 'Pathology', icon: '🦠' },
  { name: 'Pharmacology', icon: '💊' },
  { name: 'Surgery', icon: '🔪' },
  { name: 'Internal Medicine', icon: '🩺' },
];

export default function MedicalPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 flex flex-col">
            <main className="flex-grow container mx-auto px-4 py-8 max-w-lg pt-24">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-emerald-400 to-teal-600 mb-2">
            الطب البشري
          </h1>
          <p className="text-gray-400 text-sm">اختر التخصص لبدء الامتحان</p>
        </div>

        <div className="space-y-3 mb-8">
          {subjects.map((subject) => (
            <button
              key={subject.name}
              onClick={() => router.push(`/quiz?subject=${subject.name}&type=medical`)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-right hover:bg-white/10 transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">{subject.icon}</span>
              <span className="flex-1 font-semibold">{subject.name}</span>
              <span className="text-emerald-500 text-xl">👈</span>
            </button>
          ))}
        </div>
      </main>
          </div>
  );
}

