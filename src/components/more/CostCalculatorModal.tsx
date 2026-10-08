import React, { useState } from 'react';
import { X, Calculator, Coins, TrendingUp, Sparkles } from 'lucide-react';
import { formatBDT, toBengaliNumber } from '../../utils/calculations';

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCost?: number;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultCost = 6.45,
}) => {
  const [sellingPrice, setSellingPrice] = useState<number>(10.50);
  const [factoryCost, setFactoryCost] = useState<number>(defaultCost);
  const [monthlyBottles, setMonthlyBottles] = useState<number>(5000);
  const [extraLogisticsPerBottle, setExtraLogisticsPerBottle] = useState<number>(0.50);

  const netUnitCost = Number((factoryCost + extraLogisticsPerBottle).toFixed(2));
  const profitPerBottle = Number((sellingPrice - netUnitCost).toFixed(2));
  const marginPercent = sellingPrice > 0 ? Math.round((profitPerBottle / sellingPrice) * 100) : 0;
  const totalMonthlyProfit = Math.round(monthlyBottles * profitPerBottle);
  const totalAnnualProfit = totalMonthlyProfit * 12;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#faf8f5] overflow-hidden animate-in fade-in">
      {/* Header */}
      <div className="liquid-glass border-b border-stone-200/80 px-4 h-14 flex items-center justify-between shrink-0 safe-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-none">
              তাৎক্ষণিক কস্ট ও প্রফিট ক্যালকুলেটর
            </h2>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              রেস্টুরেন্টে দাঁড়িয়ে দ্রুত দরকষাকষির হিসাব
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="touch-target w-9 h-9 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-12">
        {/* Instant Result Box */}
        <div className="liquid-glass rounded-3xl p-4 border border-emerald-200 bg-emerald-500/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              হিসাবের ফলাফল (Instant Result)
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-200 text-emerald-900">
              {toBengaliNumber(marginPercent)}% মার্জিন
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-white/80 p-3 rounded-2xl border border-emerald-150">
              <span className="text-[11px] text-stone-500 block">প্রতি বোতলে নিট লাভ</span>
              <span className="text-xl font-bold text-emerald-800">
                {formatBDT(profitPerBottle, true)}
              </span>
            </div>

            <div className="bg-white/80 p-3 rounded-2xl border border-emerald-150">
              <span className="text-[11px] text-stone-500 block">এই চুক্তিতে মাসিক লাভ</span>
              <span className="text-xl font-bold text-emerald-800">
                {formatBDT(totalMonthlyProfit, true)}
              </span>
            </div>
          </div>

          <div className="text-center pt-1 text-xs text-emerald-900 font-medium">
            বাৎসরিক প্রজেকশন: <strong>{formatBDT(totalAnnualProfit, true)}</strong>
          </div>
        </div>

        {/* Inputs */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 pb-1 border-b border-stone-100">
            মূল্য ও খরচের উপাদানসমূহ
          </h3>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              রেস্টুরেন্টকে প্রস্তাবিত বিক্রয় মূল্য (৳)
            </label>
            <input
              type="number"
              step="0.1"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(Number(e.target.value))}
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-base font-bold text-cyan-900"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              ফ্যাক্টরি ইউনিট উৎপাদন খরচ (৳)
            </label>
            <input
              type="number"
              step="0.05"
              value={factoryCost}
              onChange={(e) => setFactoryCost(Number(e.target.value))}
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-base font-bold text-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              স্থানীয় ডেলিভারি ও লোডিং খরচ (৳ / বোতল)
            </label>
            <input
              type="number"
              step="0.05"
              value={extraLogisticsPerBottle}
              onChange={(e) => setExtraLogisticsPerBottle(Number(e.target.value))}
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              মাসিক সরবরাহ লক্ষ্যমাত্রা (বোতল)
            </label>
            <input
              type="number"
              step="500"
              value={monthlyBottles}
              onChange={(e) => setMonthlyBottles(Number(e.target.value))}
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-base font-bold text-stone-800"
            />
            <div className="flex gap-1.5 mt-2">
              {[2000, 5000, 10000, 20000].map(cnt => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setMonthlyBottles(cnt)}
                  className="touch-target flex-1 py-1 text-[11px] font-medium bg-stone-100 rounded-lg text-stone-700 hover:bg-stone-200"
                >
                  {toBengaliNumber(cnt)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full touch-target rounded-2xl bg-cyan-700 text-white font-semibold text-sm py-3 shadow-md hover:bg-cyan-800 transition"
        >
          হিসাব সম্পন্ন হয়েছে (Close)
        </button>
      </div>
    </div>
  );
};
