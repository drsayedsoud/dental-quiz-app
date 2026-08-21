'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = localStorage.getItem('installDismissed');
      if (!dismissed) {
        setShowBanner(true);
      }
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('installDismissed', 'true');
  };

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 bg-gradient-to-r from-cyan-600 to-blue-700 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3"
        >
          <div className="flex-1">
            <p className="text-white font-bold text-sm">📲 ثبّت التطبيق على هاتفك</p>
            <p className="text-cyan-100 text-xs mt-1">وصول أسرع بدون متصفح</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleInstall}
              className="bg-white text-cyan-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-cyan-50 transition"
            >
              تثبيت
            </button>
            <button
              onClick={handleDismiss}
              className="text-white/70 hover:text-white text-xl px-2"
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
