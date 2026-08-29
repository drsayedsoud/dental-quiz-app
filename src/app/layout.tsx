import type { Metadata, Viewport } from 'next';
import { Cairo } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import InstallPrompt from '@/components/InstallPrompt';
import WakeLock from '@/components/WakeLock';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MedicalPro',
  description: 'تطبيق اختبارات طب الأسنان البرومترك',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MedicalPro',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#06b6d4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={cairo.className}>
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var currentVersion = '1787889510918';
                  var cachedVersion = localStorage.getItem('app_version');
                  if (cachedVersion !== currentVersion) {
                    console.log('New version detected! Clearing cache...');
                    localStorage.setItem('app_version', currentVersion);
                    
                    // Clear specific cached items or force reload if it's not the very first visit
                    if (cachedVersion) {
                       window.location.reload(true);
                    }
                  }
                } catch (e) {}
              })();
            `
          }}
        />
      </head>

      <body className="min-h-screen">
        <AuthProvider>
          <WakeLock />
          {children}
          <InstallPrompt />
        </AuthProvider>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
