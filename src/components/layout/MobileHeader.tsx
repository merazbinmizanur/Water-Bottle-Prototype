import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  quickAction?: React.ReactNode;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  quickAction,
}) => {
  return (
    <header className="sticky top-0 z-30 liquid-glass border-b border-stone-200/80 safe-top transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="touch-target -ml-2 w-10 h-10 rounded-full flex items-center justify-center text-stone-700 hover:bg-stone-100 active:bg-stone-200 transition"
              aria-label="Go back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
            </button>
          )}

          <div className="min-w-0">
            <h1 className="text-base font-bold text-stone-900 tracking-tight truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] text-stone-500 font-medium truncate leading-none mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {quickAction && (
          <div className="flex items-center gap-1.5 shrink-0">
            {quickAction}
          </div>
        )}
      </div>
    </header>
  );
};
