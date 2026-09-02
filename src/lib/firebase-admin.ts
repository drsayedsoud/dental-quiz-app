/* eslint-disable */
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getMessaging, Messaging } from 'firebase-admin/messaging';
import { getAuth, Auth } from 'firebase-admin/auth';
import { isAdminUser } from './admin';

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
  adminAuth: Auth;
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
    adminAuth: getAuth(app),
    FieldValue: require('firebase-admin/firestore').FieldValue,
  };
}

/**
 * Verifies the Firebase ID token from an Authorization: Bearer <token> header
 * and confirms the caller is an admin (role === 'admin' or the hardcoded
 * owner email). Throws on any failure — callers should catch and return 401/403.
 */
export async function requireAdmin(req: { headers: { get(name: string): string | null } }) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    throw new Error('UNAUTHENTICATED');
  }

  const { adminAuth, adminDb } = getFirebaseAdmin();
  const decoded = await adminAuth.verifyIdToken(token);

  const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
  const role = userDoc.exists ? userDoc.data()?.role : undefined;

  if (!isAdminUser({ email: decoded.email, role })) {
    throw new Error('FORBIDDEN');
  }

  return decoded;
}

// Backward compatibility exports
export const adminAuth = null;
export const adminDb = null;
export const adminMessaging = null;

