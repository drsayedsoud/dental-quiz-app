import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { targetUid, targetMajor, title, body, url } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'يرجى كتابة عنوان وتفاصيل الإشعار أولاً' }, { status: 400 });
    }

    const { getFirebaseAdmin } = await import('@/lib/firebase-admin');
    const { adminMessaging, adminDb, FieldValue } = getFirebaseAdmin();

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

      usersSnapshot.forEach((doc: any) => {
        const tokens = doc.data().fcmTokens || [];
        if (Array.isArray(tokens)) {
          allTokens.push(...tokens);
        }
      });
    } else {
      return NextResponse.json({ error: 'يجب تحديد القسم المستهدف أو المستخدم' }, { status: 400 });
    }

    // Deduplicate tokens
    allTokens = Array.from(new Set(allTokens.filter(Boolean)));

    // 1. Save to Firestore (Database) FIRST
    const targetValue = targetUid ? targetUid : (targetMajor ? targetMajor : 'all');
    await adminDb.collection('notifications').add({
      target: targetValue,
      title,
      body,
      url: url || '/',
      createdAt: FieldValue.serverTimestamp(),
      sender: 'admin'
    });

    if (allTokens.length === 0) {
      return NextResponse.json({ 
        error: 'تم حفظ الرسالة في صندوق الوارد، لكن لا توجد أجهزة مفعلة لاستقبال الإشعار الفوري المزعج (Push) في هذا القسم حتى الآن.' 
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
