import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const section = (formData.get('section') as string) || 'dental';

    if (!file) {
      return NextResponse.json({ error: 'لم يتم اختيار أي ملف' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = section === 'medical' ? 'questions_medical.csv' : 'questions.csv';
    const filePath = path.join(process.cwd(), 'public', filename);

    await fs.writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      message: `تم رفع وتحديث ملف أسئلة ${section === 'medical' ? 'الطب البشري' : 'طب الأسنان'} بنجاح!`,
      filename
    });
  } catch (error: any) {
    console.error('Error saving uploaded questions:', error);
    return NextResponse.json({ error: 'فشل في حفظ الملف', details: error.message }, { status: 500 });
  }
}
