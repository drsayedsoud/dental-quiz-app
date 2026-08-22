const fs = require('fs');
const path = require('path');
const https = require('https');

async function downloadCSV() {
  const url = 'https://docs.google.com/spreadsheets/d/1dGa6lmOLy5a7Kkw3DNDh2uw4aPjOCSP9oA6AmTIbAa8/export?format=csv';
  const dest = path.join(__dirname, 'public', 'questions.csv');
  
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      // Handle redirects if any
      if (res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 307) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => { file.close(resolve); });
        }).on('error', reject);
      } else {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(resolve); });
      }
    }).on('error', reject);
  });
}

async function run() {
  console.log("1. Downloading CSV from Google Sheets...");
  await downloadCSV();
  console.log("CSV downloaded successfully!");

  console.log("2. Updating API route to read locally...");
  const apiRoutePath = path.join(__dirname, 'src/app/api/questions/route.ts');
  let apiCode = fs.readFileSync(apiRoutePath, 'utf8');
  
  // Replace the googleapis imports and getSheetData function
  apiCode = apiCode.replace(/import \{ google \} from 'googleapis';[\s\S]*?async function getSheetData\(range: string\) \{[\s\S]*?return response\.data\.values \|\| \[\];\n\}/m, `import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';

async function getLocalSheetData() {
  const filePath = path.join(process.cwd(), 'public', 'questions.csv');
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const parsed = Papa.parse(fileContent, { header: false });
  return parsed.data as string[][];
}`);

  // Replace the GET function logic
  apiCode = apiCode.replace(/if \(subject && subjectRanges\[subject\]\) \{[\s\S]*?questions = parseQuestions\(rows\)\.slice\(0, 50\);\n    \}/m, `const allRows = await getLocalSheetData();

    if (subject && subjectRanges[subject]) {
      const { start, end } = subjectRanges[subject];
      const startIndex = start - 1; // Google sheets row 1 is index 0
      const endIndex = end;
      const subjectRows = allRows.slice(startIndex, endIndex);
      questions = parseQuestions(subjectRows);
    } else if (mode === 'exam') {
      const all = parseQuestions(allRows);
      questions = shuffleArray(all).slice(0, 50);
    } else {
      questions = parseQuestions(allRows).slice(0, 50);
    }`);
  
  fs.writeFileSync(apiRoutePath, apiCode, 'utf8');

  console.log("3. Restoring Admin Panel...");
  const adminPagePath = path.join(__dirname, 'src/app/admin/page.tsx');
  if (!fs.existsSync(path.dirname(adminPagePath))) {
    fs.mkdirSync(path.dirname(adminPagePath), { recursive: true });
  }
  const adminCode = `"use client";
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
}`;
  fs.writeFileSync(adminPagePath, adminCode, 'utf8');

  console.log("4. Restoring UI Fixes (AuthContext, ScreenWake, etc)...");
  
  // Fix AuthContext loader
  const authContextPath = path.join(__dirname, 'src/context/AuthContext.tsx');
  let authCode = fs.readFileSync(authContextPath, 'utf8');
  authCode = authCode.replace(/if \(docSnap\.exists\(\)\) \{[\s\S]*?\} else \{/m, `if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {`);
  authCode = authCode.replace(/onAuthStateChanged\(auth, async \(currentUser\) => \{[\s\S]*?setLoading\(false\);\n    \}\);/m, `onAuthStateChanged(auth, async (currentUser) => {
      try {
        setUser(currentUser);
        if (currentUser) {
          const docRef = doc(db, 'users', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setProfile(docSnap.data() as UserProfile);
          } else {
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth context error:", error);
      } finally {
        setLoading(false);
      }
    });`);
  fs.writeFileSync(authContextPath, authCode, 'utf8');

  // Fix ScreenWake
  const screenWakePath = path.join(__dirname, 'src/components/ScreenWake.tsx');
  if (fs.existsSync(screenWakePath)) {
    let wakeCode = fs.readFileSync(screenWakePath, 'utf8');
    wakeCode = wakeCode.replace(/catch \(err: any\) \{/g, 'catch (err: unknown) {');
    wakeCode = wakeCode.replace(/if \('wakeLock' in navigator\) \{[\s\S]*?requestWakeLock\(\);/m, `if ('wakeLock' in navigator) {
      const requestWakeLock = async () => {
        try {
          if (document.visibilityState === 'visible') {
            wakeLockRef.current = await (navigator as any).wakeLock.request('screen');
          }
        } catch (err: unknown) {
          console.warn('Wake Lock error:', err);
        }
      };

      requestWakeLock();`);
    fs.writeFileSync(screenWakePath, wakeCode, 'utf8');
  }

  // Fix Result Unused variable
  const resultPath = path.join(__dirname, 'src/app/result/page.tsx');
  if (fs.existsSync(resultPath)) {
    let resultCode = fs.readFileSync(resultPath, 'utf8');
    resultCode = resultCode.replace(/const total = parseInt\(searchParams\.get\('total'\) \|\| '0'\);\n/g, '');
    fs.writeFileSync(resultPath, resultCode, 'utf8');
  }

  // Fix login/signup ESLint any
  ['login', 'signup'].forEach(page => {
    const p = path.join(__dirname, `src/app/${page}/page.tsx`);
    if (fs.existsSync(p)) {
      let code = fs.readFileSync(p, 'utf8');
      code = code.replace(/catch \(err: any\) \{/g, 'catch (err: unknown) {');
      fs.writeFileSync(p, code, 'utf8');
    }
  });

  // Fix Quiz ESLint & SessionSavedRef
  const quizPath = path.join(__dirname, 'src/app/quiz/page.tsx');
  if (fs.existsSync(quizPath)) {
    let quizCode = fs.readFileSync(quizPath, 'utf8');
    // Add sessionSavedRef
    quizCode = quizCode.replace(/const wrongSoundRef = useRef<HTMLAudioElement \| null>\(null\);/g, `const wrongSoundRef = useRef<HTMLAudioElement | null>(null);\n  const sessionSavedRef = useRef(false);`);
    // Wrap session save to prevent duplicate
    quizCode = quizCode.replace(/const saveSession = async \(\) => \{/g, `const saveSession = async () => {\n    if (sessionSavedRef.current) return;\n    sessionSavedRef.current = true;`);
    fs.writeFileSync(quizPath, quizCode, 'utf8');
  }

  console.log("All done!");
}
run();
