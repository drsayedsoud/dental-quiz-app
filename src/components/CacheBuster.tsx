'use client';

import { useEffect } from 'react';

const CURRENT_VERSION = 'v27';

export default function CacheBuster() {
  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version');
    
    if (storedVersion !== CURRENT_VERSION) {
      console.log('🔄 إصدار جديد متاح! جاري مسح الكاش وتحديث التطبيق...');
      
      // 1. Clear Browser Caches (Service Worker / PWA Caches)
      if ('caches' in window) {
        caches.keys().then((names) => {
          names.forEach((name) => {
            caches.delete(name);
          });
        });
      }

      // 2. Clear Session Storage (Guest data, temporary states)
      sessionStorage.clear();

      // 3. Update the version marker in LocalStorage
      // Note: We avoid localStorage.clear() so we don't accidentally log the user out if Firebase uses it, 
      // but Firebase usually uses IndexedDB. Just updating the version is safe.
      localStorage.setItem('app_version', CURRENT_VERSION);

      // 4. Force a hard reload from the server
      window.location.reload();
    }
  }, []);

  return null;
}
