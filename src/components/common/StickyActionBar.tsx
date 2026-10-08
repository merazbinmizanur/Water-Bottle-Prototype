import React from 'react';
import { Check, X } from 'lucide-react';

interface StickyActionBarProps {
  onCancel: () => void;
  onSave: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  onCancel,
  onSave,
  saveLabel = 'সংরক্ষণ করুন (Save)',
  cancelLabel = 'বাতিল',
  isSubmitting = false,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-stone-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-3 safe-bottom transition-all">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="col-span-2 touch-target rounded-2xl border border-stone-300 bg-white py-3 px-4 text-sm font-medium text-stone-700 shadow-xs hover:bg-stone-50 active:bg-stone-100 flex items-center justify-center gap-1.5 transition active:scale-[0.98]"
        >
          <X className="w-4 h-4 text-stone-500" />
          <span>{cancelLabel}</span>
        </button>

        <button
          type="button"
          onClick={onSave}
          disabled={isSubmitting}
          className="col-span-3 touch-target rounded-2xl bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white py-3 px-5 text-sm font-semibold shadow-md shadow-cyan-950/20 flex items-center justify-center gap-2 transition active:scale-[0.98]"
        >
          {isSubmitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>{saveLabel}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
