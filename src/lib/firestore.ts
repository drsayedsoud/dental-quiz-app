import {
  doc, getDoc, setDoc, updateDoc, collection,
  addDoc, query, where, getDocs, orderBy, limit,
  serverTimestamp, increment, Timestamp, deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';

// ===== Users =====
export interface UserProfile {
  email: string;
  isVip: boolean;
  questionCount: number;
  createdAt: Timestamp;
  role?: string;
  totalPoints?: number;
}

export async function createUserProfile(userId: string, email: string) {
  await setDoc(doc(db, 'users', userId), {
    email,
    isVip: false,
    questionCount: 0,
    createdAt: serverTimestamp(),
  });
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function incrementQuestionCount(userId: string) {
  await updateDoc(doc(db, 'users', userId), {
    questionCount: increment(1),
  });
}

export async function setVipStatus(userId: string, isVip: boolean) {
  await updateDoc(doc(db, 'users', userId), { isVip });
}

// ===== Sessions =====
export interface QuizSession {
  date: Timestamp;
  subject: string | null;
  score: number;
  attempted: number;
  lastQuestionIndex: number;
  section: 'dental' | 'quran';
}

export async function saveQuizSession(
  userId: string,
  session: Omit<QuizSession, 'date'>
) {
  await addDoc(collection(db, 'users', userId, 'sessions'), {
    ...session,
    date: serverTimestamp(),
  });
}

export async function getUserSessions(
  userId: string,
  limitCount: number = 50
): Promise<QuizSession[]> {
  const q = query(
    collection(db, 'users', userId, 'sessions'),
    orderBy('date', 'desc'),
    limit(limitCount)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as QuizSession);
}

export async function getAllUserSessions(userId: string): Promise<QuizSession[]> {
  const q = query(
    collection(db, 'users', userId, 'sessions'),
    orderBy('date', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as QuizSession);
}

export async function getLastSessionForSubject(
  userId: string,
  subject: string
): Promise<QuizSession | null> {
  const q = query(
    collection(db, 'users', userId, 'sessions'),
    where('subject', '==', subject),
    orderBy('date', 'desc'),
    limit(1)
  );
  const snap = await getDocs(q);
  return snap.empty ? null : (snap.docs[0].data() as QuizSession);
}

// ===== Admin =====
export async function getAllUsers() {
  const snap = await getDocs(collection(db, 'users'));
  return snap.docs.map(d => ({ id: d.id, ...d.data() as UserProfile }));
}

export async function toggleUserVip(userId: string, currentStatus: boolean) {
  try {
    await updateDoc(doc(db, 'users', userId), { isVip: !currentStatus });
    return true;
  } catch (e) {
    return false;
  }
}

export async function resetUserQuestionCount(userId: string) {
  try {
    await updateDoc(doc(db, 'users', userId), { questionCount: 0 });
    return true;
  } catch (e) {
    return false;
  }
}

// ===== Bookmarks =====
export interface Bookmark {
  id?: string;
  question: string;
  choices: string[];
  correct: string;
  explanation: string;
  detailed: string;
  metadata: string;
  savedAt: Timestamp;
}

export async function toggleBookmark(userId: string, questionData: Omit<Bookmark, 'savedAt' | 'id'>) {
  // Use a simple hash of the question text as the document ID to prevent duplicates
  const hash = questionData.question.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
  const docRef = doc(db, 'users', userId, 'bookmarks', hash);
  const snap = await getDoc(docRef);
  
  if (snap.exists()) {
    await deleteDoc(docRef);
    return false; // unbookmarked
  } else {
    await setDoc(docRef, {
      ...questionData,
      savedAt: serverTimestamp(),
    });
    return true; // bookmarked
  }
}

export async function getBookmarks(userId: string): Promise<Bookmark[]> {
  const q = query(
    collection(db, 'users', userId, 'bookmarks'),
    orderBy('savedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Bookmark));
}

export async function isBookmarked(userId: string, questionText: string): Promise<boolean> {
  const hash = questionText.substring(0, 50).replace(/[^a-zA-Z0-9]/g, '');
  const docRef = doc(db, 'users', userId, 'bookmarks', hash);
  const snap = await getDoc(docRef);
  return snap.exists();
}
