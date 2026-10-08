import React from 'react';
import { WifiOff, Database } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-40 max-w-xs w-[90%] transition animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/90 text-white px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur-md border border-amber-400">
        <WifiOff className="w-3.5 h-3.5 shrink-0" />
        <span>অফলাইন মোড — লোকাল মেমোরিতে সেভ হচ্ছে</span>
      </div>
    </div>
  );
};
