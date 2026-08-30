import { NextRequest, NextResponse } from 'next/server';
import { adminMessaging, adminDb } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
  try {
    const { targetUid, title, body, url } = await req.json();

    if (!targetUid || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!adminMessaging || !adminDb) {
      return NextResponse.json({ error: 'Firebase Admin not initialized' }, { status: 500 });
    }

    // Fetch the target user's FCM tokens
    const userDoc = await adminDb.collection('users').doc(targetUid).get();
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDoc.data();
    const fcmTokens: string[] = userData?.fcmTokens || [];

    if (fcmTokens.length === 0) {
      return NextResponse.json({ error: 'User has no registered devices for notifications' }, { status: 400 });
    }

    // Send the message to all user's tokens (Multicast)
    const message = {
      notification: {
        title,
        body,
      },
      data: {
        url: url || '/',
      },
      tokens: fcmTokens,
    };

    const response = await adminMessaging.sendEachForMulticast(message);
    
    // Optional: Remove invalid tokens if response.failureCount > 0

    return NextResponse.json({ success: true, response });
  } catch (error: any) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
