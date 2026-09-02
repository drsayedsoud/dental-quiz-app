/* eslint-disable */
import {
  doc, getDoc, setDoc, updateDoc, collection,
  addDoc, query, where, getDocs, orderBy, limit,
  serverTimestamp, increment, Timestamp, deleteDoc
} from 'firebase/firestore';
import { db } from './firebase';
import { isAdminUser } from './admin';

// ===== Users =====
export interface UserProfile {
  email: string;
  isVip: boolean;
  questionCount: number;
  createdAt: Timestamp;
  role?: string;
  totalPoints?: number;
  devices?: string[];
  displayName?: string;
  photoURL?: string;
  major?: string; // 'dental', 'medical', 'pharmacy', 'nursing'
  fcmTokens?: string[];
  lastReadNotifications?: any;
}

export async function createUserProfile(userId: string, email: string) {
  const profileRef = doc(db, 'users', userId);
  await setDoc(profileRef, {
    email,
    isVip: false,
    questionCount: 0,
    createdAt: serverTimestamp(),
  }, { merge: true });
}

export async function addFcmToken(userId: string, token: string) {
  const profileRef = doc(db, 'users', userId);
  const snap = await getDoc(profileRef);
  if (snap.exists()) {
    const data = snap.data() as UserProfile;
    const tokens = data.fcmTokens || [];
    if (!tokens.includes(token)) {
      await updateDoc(profileRef, {
        fcmTokens: [...tokens, token]
      });
    }
  }
}

export async function updateUserMajor(userId: string, major: string) {
  const profileRef = doc(db, 'users', userId);
  await setDoc(profileRef, { major }, { merge: true });
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
  section: 'dental' | 'medical' | 'quran' | string;
}

export async function saveQuizSession(
  userId: string,
  session: Omit<QuizSession, 'date'>
) {
  // 1. Save the session
  await addDoc(collection(db, 'users', userId, 'sessions'), {
    ...session,
    date: serverTimestamp(),
  });
  
  // 2. Increment user's total points globally for leaderboard
  if (session.score > 0) {
    await updateDoc(doc(db, 'users', userId), {
      totalPoints: increment(session.score)
    }).catch(e => console.error("Error updating total points:", e));
  }
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
  section?: string | null;
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


// ===== Device Binding =====
export async function checkAndRegisterDevice(uid: string, deviceId: string): Promise<boolean> {
  const userRef = doc(db, 'users', uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return true;

  const data = snap.data() as UserProfile;
  // Admin bypass
  if (isAdminUser({ email: data.email, role: data.role })) return true;

  const devices = data.devices || [];
  
  if (devices.includes(deviceId)) {
    return true; // Already registered
  }

  // Max 2 devices allowed
  if (devices.length >= 2) {
    return false; // Limit reached!
  }

  await updateDoc(userRef, {
    devices: [...devices, deviceId]
  });
  return true;
}

export async function resetUserDevices(uid: string) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, { devices: [] });
}

// ==========================================
// REPORTS (بلاغات الأخطاء)
// ==========================================

export interface QuestionReport {
  id?: string;
  userId: string;
  userEmail: string;
  section: string;
  track: string;
  subject: string;
  questionIndex: number;
  questionText: string;
  createdAt: any;
  resolved: boolean;
}

export const reportQuestionError = async (data: Omit<QuestionReport, 'id' | 'createdAt' | 'resolved'>) => {
  try {
    const reportsRef = collection(db, 'reports');
    await addDoc(reportsRef, {
      ...data,
      resolved: false,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error reporting question:', error);
    return false;
  }
};

export const getUnresolvedReports = async (): Promise<QuestionReport[]> => {
  try {
    const q = query(collection(db, 'reports'), where('resolved', '==', false));
    const snapshot = await getDocs(q);
    const reports: QuestionReport[] = [];
    snapshot.forEach(doc => {
      reports.push({ id: doc.id, ...doc.data() } as QuestionReport);
    });
    // Sort manually if needed, or we can just return
    return reports.sort((a, b) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0));
  } catch (error) {
    console.error('Error fetching reports:', error);
    return [];
  }
};

export const resolveReport = async (reportId: string) => {
  try {
    const reportRef = doc(db, 'reports', reportId);
    await updateDoc(reportRef, { resolved: true });
    return true;
  } catch (error) {
    console.error('Error resolving report:', error);
    return false;
  }
};

// ==========================================
// MULTIPLAYER LIVE CHALLENGE (تحدي الأصدقاء)
// ==========================================

export interface ChallengePlayer {
  uid: string;
  name: string;
  photoURL: string;
  score: number;
  isReady: boolean;
  hasFinished: boolean;
}

export interface ChallengeRoom {
  roomId: string;
  hostId: string;
  status: 'waiting' | 'playing' | 'finished';
  section: string;
  track: string;
  questions: any[]; 
  players: Record<string, ChallengePlayer>;
  createdAt: any;
}

// إنشاء غرفة جديدة
export const createChallengeRoom = async (roomId: string, host: ChallengePlayer, section: string, track: string, questions: any[]) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await setDoc(roomRef, {
      roomId,
      hostId: host.uid,
      status: 'waiting',
      section,
      track,
      questions,
      players: {
        [host.uid]: host
      },
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error creating room:', error);
    return false;
  }
};

// الانضمام لغرفة
export const joinChallengeRoom = async (roomId: string, player: ChallengePlayer) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    const roomSnap = await getDoc(roomRef);
    if (!roomSnap.exists()) return { success: false, message: 'الغرفة غير موجودة' };
    
    const roomData = roomSnap.data() as ChallengeRoom;
    if (roomData.status !== 'waiting') {
      if (roomData.players && roomData.players[player.uid]) {
        return { success: true, message: 'موجود مسبقاً' };
      }
      return { success: false, message: 'المسابقة بدأت بالفعل!' };
    }

    await updateDoc(roomRef, {
      [`players.${player.uid}`]: player
    });
    return { success: true };
  } catch (error) {
    console.error('Error joining room:', error);
    return { success: false, message: 'حدث خطأ أثناء الانضمام' };
  }
};

// تحديث حالة الغرفة (بدء اللعب)
export const updateRoomStatus = async (roomId: string, status: 'playing' | 'finished') => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, { status });
    return true;
  } catch (error) {
    console.error('Error updating status:', error);
    return false;
  }
};

// تحديث سكور اللاعب
export const updatePlayerScore = async (roomId: string, uid: string, newScore: number, hasFinished: boolean = false) => {
  try {
    const roomRef = doc(db, 'rooms', roomId);
    await updateDoc(roomRef, {
      [`players.${uid}.score`]: newScore,
      [`players.${uid}.hasFinished`]: hasFinished
    });
    return true;
  } catch (error) {
    console.error('Error updating score:', error);
    return false;
  }
};


// ===== Leaderboard =====
export async function getGlobalLeaderboard(limitCount: number = 50) {
  try {
    const q = query(collection(db, 'users'), orderBy('totalPoints', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as UserProfile & { id: string })).filter(u => (u.totalPoints || 0) > 0);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return [];
  }
}

// ===== Notifications =====
export async function getSentNotifications(limitCount: number = 20) {
  try {
    const q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'), limit(limitCount));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Error fetching sent notifications:', error);
    return [];
  }
}
