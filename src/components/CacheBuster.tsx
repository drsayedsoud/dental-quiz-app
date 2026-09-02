'use client';

import { useEffect } from 'react';

const CURRENT_VERSION = 'v44';

export default function CacheBuster() {
  useEffect(() => {
    const clearCacheAndReload = async () => {
      const storedVersion = localStorage.getItem('app_version');
      
      if (storedVersion !== CURRENT_VERSION) {
        console.log('🚀 إصدار جديد متاح! جاري مسح الذاكرة المؤقتة...');
        
        // 1. Clear Browser Caches (Service Worker / PWA Caches)
        if ('caches' in window) {
          try {
            const names = await caches.keys();
            await Promise.all(names.map(name => caches.delete(name)));
          } catch (e) {
            console.error('Error clearing caches', e);
          }
        }

        // 1.5 Unregister Service Workers
        if ('serviceWorker' in navigator) {
          try {
            const registrations = await navigator.serviceWorker.getRegistrations();
            await Promise.all(registrations.map(reg => reg.unregister()));
          } catch (e) {
            console.error('Error unregistering SW', e);
          }
        }

        // 2. Clear Session Storage
        sessionStorage.clear();

        // 3. Update the version marker in LocalStorage
        localStorage.setItem('app_version', CURRENT_VERSION);

        // 4. Force a hard reload from the server
        window.location.reload();
      }
    };

    clearCacheAndReload();
  }, []);

  return null;
}
