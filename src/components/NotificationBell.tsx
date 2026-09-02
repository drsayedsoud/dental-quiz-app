/* eslint-disable */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';

export default function NotificationBell() {
  const { user, profile } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [localLastRead, setLocalLastRead] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (profile && localLastRead === null) {
      setLocalLastRead(profile.lastReadNotifications ? profile.lastReadNotifications.toMillis() : 0);
    }
  }, [profile, localLastRead]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!user || !profile || localLastRead === null) return;

    const q = query(
      collection(db, 'notifications'),
      where('target', 'in', ['all', profile.major || 'dental', user.uid]),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      let newUnreadCount = 0;
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        const notifTime = data.createdAt ? data.createdAt.toMillis() : Date.now();
        notifs.push({ id: doc.id, ...data, time: notifTime });
        
        if (notifTime > localLastRead) {
          newUnreadCount++;
        }
      });

      const displayLimit = Math.max(4, newUnreadCount);
      setNotifications(notifs.slice(0, displayLimit));
      setUnreadCount(newUnreadCount);
      
      // Update the App Icon Badge (PWA)
      if (typeof navigator !== 'undefined' && 'setAppBadge' in navigator) {
        if (newUnreadCount > 0) {
          (navigator as any).setAppBadge(newUnreadCount).catch(console.error);
        } else {
          (navigator as any).clearAppBadge().catch(console.error);
        }
      }
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, [user, profile, localLastRead]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    
    if (!isOpen && unreadCount > 0 && user?.uid) {
      setUnreadCount(0);
      setLocalLastRead(Date.now());
      
      // Clear App Icon Badge
      if (typeof navigator !== 'undefined' && 'clearAppBadge' in navigator) {
        (navigator as any).clearAppBadge().catch(console.error);
      }

      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastReadNotifications: serverTimestamp()
        });
      } catch (err) {
        console.error('Error updating read status', err);
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={handleOpen}
        className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
        >
          <span className="text-lg">🔔</span>
        </motion.div>
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] font-bold w-3.5 h-3.5 flex items-center justify-center rounded-full border border-gray-900 shadow-md"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative w-full max-w-md bg-gradient-to-b from-[#1a1a2e] to-[#111122] rounded-2xl shadow-[0_0_40px_rgba(0,200,255,0.15)] border border-cyan-500/30 z-10 overflow-hidden flex flex-col max-h-[85vh]"
              style={{ direction: 'rtl' }}
            >
              {/* Header */}
              <div className="p-4 border-b border-cyan-500/20 bg-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🔔</span>
                  <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 m-0">الإشعارات</h3>
                  {unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow-lg shadow-red-500/30 mr-2 animate-pulse">{unreadCount} جديدة</span>
                  )}
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Body */}
              <div className="overflow-y-auto flex-1 p-3 custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="text-center py-12 text-gray-400 flex flex-col items-center">
                    <span className="text-6xl block mb-4 opacity-50 drop-shadow-lg">📭</span>
                    <span className="text-lg">لا توجد إشعارات حتى الآن</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {notifications.map((notif, index) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        key={notif.id} 
                        className={`p-4 rounded-xl transition-all duration-300 ${index < unreadCount ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/20 border border-cyan-400/30 shadow-lg shadow-cyan-900/20' : 'bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10'}`}
                      >
                        <h4 className={`font-bold text-base mb-2 ${index < unreadCount ? 'text-cyan-300' : 'text-gray-100'}`}>{notif.title}</h4>
                        <p className="text-gray-300 text-sm mb-3 leading-relaxed whitespace-pre-wrap">{notif.body}</p>
                        <span className="text-xs text-gray-500 block text-left w-full border-t border-white/5 pt-2 mt-2" dir="ltr">{formatDate(notif.time)}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
