import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { targetUid, targetMajor, title, body, url } = await req.json();

    if (!title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!adminMessaging || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
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
      return NextResponse.json({ error: 'Must provide targetUid or targetMajor' }, { status: 400 });
    }

    // Deduplicate tokens
    allTokens = Array.from(new Set(allTokens));

    if (allTokens.length === 0) {
      return NextResponse.json({ error: 'No registered devices found for the target audience' }, { status: 400 });
    }

    // Firebase sendEachForMulticast accepts max 500 tokens at a time.
    // For simplicity, we chunk it into 500
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
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
