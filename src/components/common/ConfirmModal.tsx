import React from 'react';
import { AlertCircle, Trash2 } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'হ্যাঁ, মুছুন',
  cancelLabel = 'বাতিল',
  isDanger = true,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-stone-200/90 liquid-glass-card mb-2 sm:mb-0">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isDanger ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}>
            {isDanger ? <Trash2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-semibold text-stone-900 leading-tight">
              {title}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              মুছে ফেলার পর এই ডাটা ফিরে পাওয়া যাবে না
            </p>
          </div>
        </div>

        <p className="text-sm text-stone-700 leading-relaxed bg-stone-50/80 p-3 rounded-xl border border-stone-100 my-4">
          {message}
        </p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="touch-target w-full rounded-xl border border-stone-300 bg-white py-2.5 px-4 text-sm font-medium text-stone-700 shadow-xs hover:bg-stone-50 active:scale-[0.98] transition flex items-center justify-center"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`touch-target w-full rounded-xl py-2.5 px-4 text-sm font-semibold text-white shadow-sm active:scale-[0.98] transition flex items-center justify-center ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-600 hover:bg-emerald-700'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
