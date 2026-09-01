/* eslint-disable */
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getMessaging, Messaging } from 'firebase-admin/messaging';

function formatPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let formatted = key.trim();
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    formatted = formatted.slice(1, -1);
  }
  return formatted.replace(/\\n/g, '\n');
}

export function getFirebaseAdmin(): {
  adminDb: Firestore;
  adminMessaging: Messaging;
  FieldValue: any;
} {
  if (getApps().length === 0) {
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = formatPrivateKey(process.env.FIREBASE_ADMIN_PRIVATE_KEY);

    if (!projectId || !clientEmail || !privateKey) {
      const missing: string[] = [];
      if (!projectId) missing.push('PROJECT_ID');
      if (!clientEmail) missing.push('FIREBASE_ADMIN_CLIENT_EMAIL');
      if (!privateKey) missing.push('FIREBASE_ADMIN_PRIVATE_KEY');
      throw new Error(`يرجى إضافة متغيرات Firebase Admin الناقصة في إعدادات Vercel: (${missing.join(', ')})`);
    }

    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  }

  const app = getApps()[0];
  return {
    adminDb: getFirestore(app),
    adminMessaging: getMessaging(app),
    FieldValue: require('firebase-admin/firestore').FieldValue,
  };
}

// Backward compatibility exports
export const adminAuth = null;
export const adminDb = null;
export const adminMessaging = null;

