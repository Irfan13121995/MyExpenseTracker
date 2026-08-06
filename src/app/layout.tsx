import type { Metadata, Viewport } from 'next';
import './globals.css';
import { OfflineSyncProvider } from '@/components/providers/OfflineSyncProvider';

export const metadata: Metadata = {
  title: 'Web Expense Tracker | Cloud & PWA Financial Dashboard',
  description: 'Mobile-responsive cloud expense tracker PWA with real-time sync, OCR receipt scanning, multi-currency support, and visual budget limits.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ExpenseTracker',
  },
};

export const viewport: Viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0b0f19] text-slate-100 min-h-screen">
        <OfflineSyncProvider>{children}</OfflineSyncProvider>
      </body>
    </html>
  );
}
