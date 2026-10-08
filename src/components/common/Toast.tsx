import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'warning' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-sm transition-all animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="liquid-glass rounded-2xl p-3.5 shadow-xl flex items-center justify-between gap-3 border border-stone-200/90 bg-white/95 backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          {toast.type === 'success' ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <span className="text-sm font-medium text-stone-800 leading-snug truncate">
            {toast.text}
          </span>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 touch-target shrink-0 transition"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
