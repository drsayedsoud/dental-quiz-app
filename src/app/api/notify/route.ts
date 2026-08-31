import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { targetUid, targetMajor, title, body, url } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'يرجى كتابة عنوان وتفاصيل الإشعار أولاً' }, { status: 400 });
    }

    if (!adminMessaging || !adminDb) {
      return NextResponse.json({ error: 'لم يتم تفعيل Firebase Admin على السيرفر (تأكد من المتغيرات البيئية FIREBASE_ADMIN_PRIVATE_KEY)' }, { status: 500 });
    }

    let allTokens: string[] = [];

    if (targetUid) {
      // Send to specific user
      const userDoc = await adminDb.collection('users').doc(targetUid).get();
      if (userDoc.exists) {
        const tokens = userDoc.data()?.fcmTokens || [];
        allTokens.push(...tokens);
      }
    } else if (targetMajor) {
      // Send to specific major or all
      let usersSnapshot;
      if (targetMajor === 'all') {
        usersSnapshot = await adminDb.collection('users').get();
      } else {
        usersSnapshot = await adminDb.collection('users').where('major', '==', targetMajor).get();
      }

      usersSnapshot.forEach(doc => {
        const tokens = doc.data().fcmTokens || [];
        allTokens.push(...tokens);
      });
    } else {
      return NextResponse.json({ error: 'يجب تحديد القسم المستهدف أو المستخدم' }, { status: 400 });
    }

    // Deduplicate tokens
    allTokens = Array.from(new Set(allTokens.filter(Boolean)));

    if (allTokens.length === 0) {
      return NextResponse.json({ 
        error: 'لا توجد أجهزة مفعلة لاستقبال الإشعارات في هذا القسم حتى الآن. يجب أن يضغط المستخدم أولاً على زر (🔔 تفعيل الإشعارات) في صفحته الرئيسية.' 
      }, { status: 400 });
    }

    // Firebase sendEachForMulticast accepts max 500 tokens at a time.
    const chunks = [];
    for (let i = 0; i < allTokens.length; i += 500) {
      chunks.push(allTokens.slice(i, i + 500));
    }

    let successCount = 0;
    let failureCount = 0;

    for (const chunk of chunks) {
      const message = {
        notification: { title, body },
        data: { url: url || '/' },
        tokens: chunk,
      };
      const response = await adminMessaging.sendEachForMulticast(message);
      successCount += response.successCount;
      failureCount += response.failureCount;
    }

    return NextResponse.json({ success: true, successCount, failureCount, totalSent: allTokens.length });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: error?.message || 'حدث خطأ غير متوقع أثناء إرسال الإشعار' }, { status: 500 });
  }
}
