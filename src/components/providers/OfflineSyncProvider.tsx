'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { offlineDB } from '@/lib/offline/db';

interface OfflineSyncContextType {
  isOnline: boolean;
  pendingSyncCount: number;
  syncOfflineData: () => Promise<void>;
}

const OfflineSyncContext = createContext<OfflineSyncContextType>({
  isOnline: true,
  pendingSyncCount: 0,
  syncOfflineData: async () => {},
});

export function OfflineSyncProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const checkPendingSyncs = async () => {
    try {
      const pending = await offlineDB.transactions.where('sync_status').equals('pending').count();
      setPendingSyncCount(pending);
    } catch {
      // Ignore if DB not initialized yet
    }
  };

  const syncOfflineData = async () => {
    if (!navigator.onLine || isSyncing) return;
    setIsSyncing(true);

    try {
      const pendingTransactions = await offlineDB.transactions
        .where('sync_status')
        .equals('pending')
        .toArray();

      for (const item of pendingTransactions) {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
        });

        if (res.ok) {
          await offlineDB.transactions.update(item.id, { sync_status: 'synced' });
        }
      }
      await checkPendingSyncs();
    } catch (err) {
      console.error('Failed to sync offline items:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    checkPendingSyncs();

    const handleOnline = () => {
      setIsOnline(true);
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      navigator.serviceWorker.register('/sw.js').catch((err) => console.log('SW registration failed:', err));
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineSyncContext.Provider value={{ isOnline, pendingSyncCount, syncOfflineData }}>
      {children}
      {/* Offline Status Banner */}
      {!isOnline && (
        <div className="fixed bottom-16 sm:bottom-4 right-4 z-50 flex items-center gap-2 bg-amber-500/90 text-slate-950 font-medium text-xs px-3 py-2 rounded-full shadow-lg backdrop-blur-md animate-pulse">
          <WifiOff className="w-4 h-4" />
          <span>Offline Mode (Local Saving Active)</span>
        </div>
      )}
      {isOnline && pendingSyncCount > 0 && (
        <button
          onClick={syncOfflineData}
          disabled={isSyncing}
          className="fixed bottom-16 sm:bottom-4 right-4 z-50 flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-3 py-2 rounded-full shadow-lg backdrop-blur-md transition-all"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>Syncing {pendingSyncCount} offline items</span>
        </button>
      )}
    </OfflineSyncContext.Provider>
  );
}

export const useOfflineSync = () => useContext(OfflineSyncContext);
