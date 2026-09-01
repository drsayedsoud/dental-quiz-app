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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    if (!user || !profile) return;

    const q = query(
      collection(db, 'notifications'),
      where('target', 'in', ['all', profile.major || 'dental', user.uid]),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: any[] = [];
      let newUnreadCount = 0;
      
      const lastReadTime = profile.lastReadNotifications ? profile.lastReadNotifications.toMillis() : 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        const notifTime = data.createdAt ? data.createdAt.toMillis() : Date.now();
        notifs.push({ id: doc.id, ...data, time: notifTime });
        
        if (notifTime > lastReadTime) {
          newUnreadCount++;
        }
      });

      setNotifications(notifs);
      setUnreadCount(newUnreadCount);
    }, (error) => {
      console.error('Error fetching notifications:', error);
    });

    return () => unsubscribe();
  }, [user, profile]);

  const handleOpen = async () => {
    setIsOpen(!isOpen);
    
    if (!isOpen && unreadCount > 0 && user?.uid) {
      setUnreadCount(0);
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
        className="relative p-2 rounded-full hover:bg-white/10 transition-colors focus:outline-none"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
          transition={{ duration: 0.5, repeat: unreadCount > 0 ? Infinity : 0, repeatDelay: 3 }}
        >
          <span className="text-2xl">??</span>
        </motion.div>
        
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-gray-900 shadow-md"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 md:right-0 md:left-auto mt-2 w-72 md:w-80 bg-gray-800 rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden flex flex-col max-h-[400px]"
            style={{ direction: 'rtl' }}
          >
            <div className="p-4 border-b border-white/10 bg-gray-800/80 backdrop-blur-sm sticky top-0 flex justify-between items-center">
              <h3 className="text-lg font-bold text-white m-0">���������</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded-full">{unreadCount} �����</span>
              )}
            </div>
            
            <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <span className="text-4xl block mb-2 opacity-50">??</span>
                  �� ���� ������� ��� ����
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {notifications.map((notif, index) => (
                    <div 
                      key={notif.id} 
                      className={`p-3 rounded-lg transition-colors ${index < unreadCount ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-white/5 hover:bg-white/10'}`}
                    >
                      <h4 className="font-bold text-white text-sm mb-1">{notif.title}</h4>
                      <p className="text-gray-300 text-xs mb-2 leading-relaxed">{notif.body}</p>
                      <span className="text-[10px] text-gray-500 block text-left w-full" dir="ltr">{formatDate(notif.time)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
