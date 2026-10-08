import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, don't show
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        type="button"
        className={`touch-target flex items-center justify-center gap-1.5 font-medium rounded-xl transition active:scale-[0.98] ${
          compact
            ? 'px-3 py-1.5 text-xs bg-cyan-700 text-white shadow-xs hover:bg-cyan-800'
            : 'px-4 py-2.5 text-sm bg-cyan-700 text-white shadow-md hover:bg-cyan-800 w-full'
        }`}
      >
        <Download className="w-4 h-4" />
        <span>অ্যাপ ইনস্টল করুন (Install)</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          type="button"
          className={`touch-target flex items-center justify-center gap-1.5 font-medium rounded-xl transition active:scale-[0.98] border border-stone-300 bg-white text-stone-700 shadow-xs hover:bg-stone-50 ${
            compact
              ? 'px-3 py-1.5 text-xs'
              : 'px-4 py-2.5 text-sm w-full'
          }`}
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-700" />
          <span>আইফোনে ইনস্টল</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-stone-200">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
                <h3 className="text-base font-bold text-stone-900">
                  আইফোন / আইপ্যাডে ইনস্টল করুন
                </h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex items-start gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-xs shrink-0">
                    ১
                  </div>
                  <div>
                    Safari ব্রাউজারের নিচের বারে <strong>Share</strong> (শেয়ার <Share2 className="w-3.5 h-3.5 inline text-blue-600" />) আইকনে চাপুন।
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-xs shrink-0">
                    ২
                  </div>
                  <div>
                    নিচে স্ক্রল করে <strong>Add to Home Screen</strong> (<PlusSquare className="w-3.5 h-3.5 inline text-stone-700" />) অপশন নির্বাচন করুন।
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  <div className="w-6 h-6 rounded-full bg-cyan-100 text-cyan-800 font-bold flex items-center justify-center text-xs shrink-0">
                    ৩
                  </div>
                  <div>
                    উপরে ডানপাশে <strong>Add</strong> বাটনে ট্যাপ করলেই ফোনের হোম স্ক্রিনে অ্যাপ যুক্ত হয়ে যাবে!
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full touch-target rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-black transition"
              >
                বুঝেছি (Done)
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
