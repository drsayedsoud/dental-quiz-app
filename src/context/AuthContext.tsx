'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { createUserProfile, getUserProfile, UserProfile, checkAndRegisterDevice } from '@/lib/firestore';
import { isAdminUser } from '@/lib/admin';

// Routes a signed-in user may visit without having picked a "major" (specialty) yet.
// Everything else requires a major, because notification targeting and question
// filtering are keyed off it — a user who never sets one silently misses any
// specialty-targeted admin message.
const MAJOR_EXEMPT_PATHS = ['/dashboard', '/admin', '/login', '/signup', '/about', '/privacy'];

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signupWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Auto clear cache on session start
  useEffect(() => {
    if (typeof window !== 'undefined' && !sessionStorage.getItem('cache_cleared_auto')) {
      sessionStorage.setItem('cache_cleared_auto', 'true');
      if ('caches' in window) {
        window.caches.keys().then(keys => {
          Promise.all(keys.map(key => window.caches.delete(key))).catch(() => {});
        }).catch(() => {});
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(regs => {
          regs.forEach(reg => reg.unregister());
        }).catch(() => {});
      }
    }
  }, []);

  const refreshProfile = async () => {
    if (user) {
      const p = await getUserProfile(user.uid);
      setProfile(p);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const p = await getUserProfile(firebaseUser.uid);
        if (!p) {
          await createUserProfile(firebaseUser.uid, firebaseUser.email || '');
          const newP = await getUserProfile(firebaseUser.uid);
          setProfile(newP);
        } else {
          setProfile(p);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Force any user without a saved specialty ("major") back to /dashboard to pick one.
  // Without this, a user who signed up before the major feature existed — or who
  // deep-links straight into a subject page — can keep `major` unset forever, which
  // makes them invisible to any specialty-targeted admin notification.
  useEffect(() => {
    if (loading || !user || !profile) return;
    if (isAdminUser({ email: user.email, role: profile.role }) || profile.major) return;
    if (MAJOR_EXEMPT_PATHS.some((p) => pathname === p || pathname?.startsWith(p + '/'))) return;
    router.replace('/dashboard');
  }, [user, profile, loading, pathname, router]);

  const loginWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createUserProfile(cred.user.uid, email);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, googleProvider);
    const existing = await getUserProfile(cred.user.uid);
    if (!existing) {
      await createUserProfile(cred.user.uid, cred.user.email || '');
    }
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, loginWithEmail, signupWithEmail, loginWithGoogle, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
