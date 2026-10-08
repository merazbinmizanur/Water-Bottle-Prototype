import React, { useState } from 'react';
import { 
  BarChart3, 
  Coins, 
  TrendingUp, 
  Target, 
  PieChart, 
  ShieldCheck, 
  Sliders, 
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Building2,
  Store,
  FileText,
  Download,
  Printer
} from 'lucide-react';
import { Restaurant, Factory, FeasibilityMetrics } from '../../types';
import { toBengaliNumber, formatBDT } from '../../utils/calculations';

interface AnalysisViewProps {
  metrics: FeasibilityMetrics;
  restaurants: Restaurant[];
  factories: Factory[];
  onUpdateFixedCost: (cost: number) => void;
  onOpenPDFReport: () => void;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  metrics,
  restaurants,
  factories,
  onUpdateFixedCost,
  onOpenPDFReport,
}) => {
  const [interactiveOverhead, setInteractiveOverhead] = useState<number>(metrics.fixedMonthlyOverhead);
  const [customSellingPrice, setCustomSellingPrice] = useState<number>(metrics.avgExpectedSellingPrice);
  const [customUnitCost, setCustomUnitCost] = useState<number>(metrics.minFactoryUnitCost);

  // Dynamic simulation calculations
  const simProfitPerBottle = Number((customSellingPrice - customUnitCost).toFixed(2));
  const simMarginPercent = customSellingPrice > 0 ? Math.round((simProfitPerBottle / customSellingPrice) * 100) : 0;
  const simBreakEvenBottles = simProfitPerBottle > 0 ? Math.ceil(interactiveOverhead / simProfitPerBottle) : 0;
  const simGrossProfit = Math.round(metrics.totalMonthlyBottleDemand * simProfitPerBottle);
  const simNetProfit = simGrossProfit - interactiveOverhead;

  // Bottle size demand breakdown
  const sizeBreakdown: { [key: string]: number } = {};
  restaurants.forEach(r => {
    const size = r.preferredBottleSize || r.bottleSize;
    const monthlyAmt = r.expectedMonthlyQuantity || (r.dailyBottleUsage * 30);
    sizeBreakdown[size] = (sizeBreakdown[size] || 0) + (r.interested === 'হ্যাঁ' ? monthlyAmt : Math.round(monthlyAmt * 0.5));
  });

  // Area demand breakdown
  const areaBreakdown: { [key: string]: { count: number; bottles: number } } = {};
  restaurants.forEach(r => {
    if (!areaBreakdown[r.area]) {
      areaBreakdown[r.area] = { count: 0, bottles: 0 };
    }
    areaBreakdown[r.area].count += 1;
    const monthlyAmt = r.expectedMonthlyQuantity || (r.dailyBottleUsage * 30);
    if (r.interested === 'হ্যাঁ' || r.interested === 'সম্ভবত') {
      areaBreakdown[r.area].bottles += monthlyAmt;
    }
  });

  return (
    <div className="space-y-4 pb-24">
      {/* 1. TOP SUMMARY CARD */}
      <div className="liquid-glass-card rounded-3xl p-4 border border-stone-200/90 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-700" />
            <h2 className="text-base font-bold text-stone-900">
              ফিজিবিলিটি ও প্রফিট মডেল বিশ্লেষণ
            </h2>
          </div>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 font-bold">
            লাইভ সিমুলেশন
          </span>
        </div>
        <p className="text-xs text-stone-600 leading-relaxed">
          আপনার সংগৃহীত রেস্টুরেন্ট চাহিদা এবং ফ্যাক্টরি খরচের ওপর ভিত্তি করে স্বয়ংক্রিয় ব্যবসায়িক লাভ-ক্ষতির পূর্ণাঙ্গ হিসাব।
        </p>
      </div>

      {/* PDF REPORT DOWNLOAD ACTION BANNER */}
      <div className="liquid-glass rounded-2xl p-3.5 border border-cyan-200/80 bg-cyan-50/70 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0 shadow-xs">
            <FileText className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs font-bold text-cyan-950 leading-tight truncate">
              পূর্ণাঙ্গ ফিজিবিলিটি রিপোর্ট (PDF)
            </h3>
            <p className="text-[11px] text-cyan-800 truncate mt-0.5">
              সম্পূর্ণ বাংলায় বিস্তারিত ডাটা, হিসাব ও গ্রাফসহ সাজানো ডকুমেন্ট
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenPDFReport}
          className="touch-target px-3.5 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 shrink-0 active:scale-[0.98]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>পিডিএফ ডাউনলোড</span>
        </button>
      </div>

      {/* 2. UNIT ECONOMICS CARD */}
      <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-100">
          <Coins className="w-4 h-4 text-amber-600" />
          প্রতি বোতলে ইউনিট অর্থনীতি (Unit Economics)
        </h3>

        <div className="grid grid-cols-3 gap-2 bg-stone-50/90 p-3 rounded-2xl border border-stone-100 text-center">
          <div>
            <span className="text-[10px] text-stone-500 block leading-tight">বিক্রয় মূল্য</span>
            <span className="text-sm font-bold text-stone-800">
              {formatBDT(customSellingPrice, true)}
            </span>
            <span className="text-[9px] text-stone-400 block">পাইকারি রেট</span>
          </div>
          <div className="border-x border-stone-200">
            <span className="text-[10px] text-stone-500 block leading-tight">ফ্যাক্টরি খরচ</span>
            <span className="text-sm font-bold text-rose-700">
              {formatBDT(customUnitCost, true)}
            </span>
            <span className="text-[9px] text-stone-400 block">{metrics.bestFactoryName || 'OEM'}</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-500 block leading-tight">বোতলে লাভ</span>
            <span className="text-sm font-bold text-emerald-700">
              {formatBDT(simProfitPerBottle, true)}
            </span>
            <span className="text-[9px] text-emerald-600 font-medium block">{toBengaliNumber(simMarginPercent)}% মার্জিন</span>
          </div>
        </div>

        {/* Sliders for Interactive What-If Analysis */}
        <div className="bg-white/70 p-3 rounded-xl border border-stone-150 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-stone-600 font-medium">বিক্রয় দর সমন্বয় করুন:</span>
            <span className="font-bold text-stone-900">{formatBDT(customSellingPrice, true)}</span>
          </div>
          <input
            type="range"
            min="8.0"
            max="16.0"
            step="0.25"
            value={customSellingPrice}
            onChange={(e) => setCustomSellingPrice(Number(e.target.value))}
            className="w-full accent-cyan-700"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-stone-600 font-medium">ফ্যাক্টরি খরচ সমন্বয়:</span>
            <span className="font-bold text-stone-900">{formatBDT(customUnitCost, true)}</span>
          </div>
          <input
            type="range"
            min="5.0"
            max="9.0"
            step="0.1"
            value={customUnitCost}
            onChange={(e) => setCustomUnitCost(Number(e.target.value))}
            className="w-full accent-teal-700"
          />
        </div>
      </div>

      {/* 3. MONTHLY PROFIT & LOSS (P&L) PROJECTION */}
      <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-100">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          মাসিক আয়-ব্যয় প্রক্ষেপণ (Monthly P&L)
        </h3>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600">মাসিক চাহিদার বোতল সংখ্যা:</span>
            <span className="font-bold text-stone-800">
              {toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল
            </span>
          </div>

          <div className="flex justify-between items-center py-1">
            <span className="text-stone-600">মোট মাসিক রাজস্ব (Revenue):</span>
            <span className="font-bold text-stone-800">
              {formatBDT(Math.round(metrics.totalMonthlyBottleDemand * customSellingPrice), true)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 text-rose-700">
            <span>ফ্যাক্টরি বোতলিং খরচ (COGS):</span>
            <span className="font-semibold">
              - {formatBDT(Math.round(metrics.totalMonthlyBottleDemand * customUnitCost), true)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 border-t border-stone-200 font-medium text-stone-900">
            <span>মোট গ্রস প্রফিট (Gross Profit):</span>
            <span className="text-emerald-700 font-bold">{formatBDT(simGrossProfit, true)}</span>
          </div>

          {/* Interactive Fixed Overhead */}
          <div className="bg-stone-50/90 p-2.5 rounded-xl border border-stone-150 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-stone-600 text-[11px]">মাসিক নির্ধারিত ওভারহেড (ভ্যান, ডেলিভারি, অফিস):</span>
              <span className="font-bold text-rose-700 text-xs">
                - {formatBDT(interactiveOverhead, true)}
              </span>
            </div>
            <input
              type="range"
              min="10000"
              max="80000"
              step="5000"
              value={interactiveOverhead}
              onChange={(e) => {
                const val = Number(e.target.value);
                setInteractiveOverhead(val);
                onUpdateFixedCost(val);
              }}
              className="w-full accent-rose-600"
            />
          </div>

          <div className="flex justify-between items-center py-2 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-bold text-emerald-900 text-sm">
            <span>আনুমানিক নেট মাসিক লাভ (Net Profit):</span>
            <span className="text-base">{formatBDT(simNetProfit, true)}</span>
          </div>
        </div>
      </div>

      {/* 4. BREAK-EVEN ANALYSIS DEEP DIVE */}
      <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-100">
          <Target className="w-4 h-4 text-indigo-600" />
          ব্রেক-ইভেন ও ঝুঁকির পরিমাপ (Break-Even Analysis)
        </h3>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block">প্রয়োজনীয় ব্রেক-ইভেন বোতল</span>
            <span className="text-base font-bold text-stone-900">
              {toBengaliNumber(simBreakEvenBottles)}
            </span>
            <span className="text-[9px] text-stone-500 block">প্রতি মাসে</span>
          </div>

          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block">মার্জিন অফ সেফটি</span>
            <span className={`text-base font-bold ${metrics.totalMonthlyBottleDemand >= simBreakEvenBottles ? 'text-emerald-700' : 'text-rose-700'}`}>
              {toBengaliNumber(metrics.totalMonthlyBottleDemand - simBreakEvenBottles)}
            </span>
            <span className="text-[9px] text-stone-500 block">বোতল অতিরিক্ত</span>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/60 p-2.5 rounded-xl border border-amber-200/60">
          💡 <strong>ব্রেক-ইভেন কৌশল:</strong> মাসে {toBengaliNumber(simBreakEvenBottles)} বোতল বিক্রি করলে অফিসের সকল স্থায়ী খরচ উঠে আসবে। বর্তমান আগ্রহ অনুযায়ী দৈনিক মাত্র {toBengaliNumber(Math.round(simBreakEvenBottles / 30))} বোতল নিশ্চিত করতে পারলে আপনি নিরাপদ জোনে প্রবেশ করবেন।
        </p>
      </div>

      {/* 5. DEMAND SEGMENTATION (By Bottle Size & Area) */}
      <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5 pb-1 border-b border-stone-100">
          <PieChart className="w-4 h-4 text-cyan-700" />
          সাইজ ও এলাকা ভিত্তিক চাহিদা বিভাজন
        </h3>

        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-stone-600 block">বোতল সাইজ অনুযায়ী মাসিক চাহিদা:</span>
          {Object.entries(sizeBreakdown).map(([sz, qty]) => (
            <div key={sz} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-stone-800">{sz}</span>
                <span className="font-bold text-stone-900">{toBengaliNumber(qty)} বোতল</span>
              </div>
              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-700 rounded-full"
                  style={{ width: `${Math.min(100, Math.round((qty / Math.max(1, metrics.totalMonthlyBottleDemand)) * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-semibold text-stone-600 block">এলাকা ভিত্তিক রেস্টুরেন্ট ঘনত্ব:</span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(areaBreakdown).map(([ar, data]) => (
              <div key={ar} className="bg-stone-50 p-2 rounded-xl border border-stone-100">
                <span className="font-bold text-stone-900 block truncate">{ar}</span>
                <span className="text-[11px] text-stone-500">
                  {toBengaliNumber(data.count)}টি রেস্টুরেন্ট · {toBengaliNumber(data.bottles)} বোতল
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. PHYSICAL VISIT ACTION ADVICE */}
      <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-2 bg-stone-900 text-white">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
            ফিল্ড রিসার্চ পরামর্শ (Field Strategy)
          </h4>
        </div>

        <ul className="text-xs space-y-1.5 text-stone-300 leading-relaxed list-disc pl-4">
          <li>রেস্টুরেন্টে কথা বলার সময় সরাসরি দামের বদলে <strong>"নিজস্ব ব্র্যান্ডিংয়ের প্রিমিয়াম ওয়াটার"</strong> এর ভ্যালু তুলে ধরুন।</li>
          <li>ফ্যাক্টরির সাথে চুক্তির আগে নিশ্চিত করুন তাদের <strong>BSTI ও ল্যাব টেস্ট রিপোর্ট</strong> আপ-টু-ডেট আছে।</li>
          <li>ডেলিভারির ক্ষেত্রে প্রথম ৩ মাস দৈনিক ডেলিভারির বদলে সপ্তাহে ২-৩ দিন এককালীন ডেলিভারির চুক্তি করলে পরিবহন খরচ ৪০% কমে যাবে।</li>
        </ul>
      </div>
    </div>
  );
};
