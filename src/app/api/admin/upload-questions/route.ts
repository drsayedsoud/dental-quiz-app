import { NextRequest, NextResponse } from 'next/server';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_OWNER = 'drsayedsoud';
const GITHUB_REPO = 'dental-quiz-app';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const section = (formData.get('section') as string) || 'dental';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار أي ملف' }, { status: 400 });
    }

    if (!GITHUB_TOKEN) {
      return NextResponse.json({ error: 'رمز GitHub (GITHUB_TOKEN) غير موجود في الإعدادات السحابية.' }, { status: 500 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Content = buffer.toString('base64');

    const filename = section === 'medical' ? 'medical_questions.csv' : 'dental_questions.csv';
    const filePath = `public/${filename}`;

    // 1. الحصول على الـ SHA الخاص بالملف الحالي (مطلوب لعمل تحديث لملف موجود في GitHub)
    let sha = '';
    const getRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (getRes.ok) {
      const data = await getRes.json();
      sha = data.sha;
    } else if (getRes.status !== 404) {
      throw new Error(`فشل في جلب الملف الحالي من GitHub: ${getRes.statusText}`);
    }

    // 2. رفع المحتوى الجديد لـ GitHub
    const updateRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: `Admin Panel: Update ${filename}`,
        content: base64Content,
        sha: sha || undefined
      })
    });

    if (!updateRes.ok) {
      const errorData = await updateRes.json();
      throw new Error(`GitHub API error: ${errorData.message}`);
    }

    return NextResponse.json({ 
      success: true, 
      message: `تم تحديث أسئلة ${section === 'medical' ? 'الطب البشري' : 'طب الأسنان'} بنجاح! الموقع يتحدث الآن تلقائياً...`,
      filename
    });
  } catch (error: any) {
    console.error('Error saving uploaded questions:', error);
    return NextResponse.json({ error: 'فشل في رفع الملف إلى GitHub', details: error.message }, { status: 500 });
  }
}
