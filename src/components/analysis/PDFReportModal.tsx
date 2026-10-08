import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileText, 
  Share2, 
  Check, 
  Coins, 
  TrendingUp, 
  Target, 
  CheckCircle2, 
  ShieldCheck,
  Building2,
  Store,
  Calendar,
  Sparkles
} from 'lucide-react';
import { Restaurant, Factory, FeasibilityMetrics } from '../../types';
import { toBengaliNumber, formatBDT } from '../../utils/calculations';
import { printPDFReport, downloadOfflineReportFile } from '../../utils/pdfReportGenerator';

interface PDFReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics: FeasibilityMetrics;
  restaurants: Restaurant[];
  factories: Factory[];
  onShowToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const PDFReportModal: React.FC<PDFReportModalProps> = ({
  isOpen,
  onClose,
  metrics,
  restaurants,
  factories,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const bestFactory = factories.length > 0
    ? [...factories].sort((a, b) => a.unitCost - b.unitCost)[0]
    : null;

  const handlePrint = () => {
    printPDFReport(metrics, restaurants, factories);
    onShowToast('পিডিএফ প্রিন্ট / সেভ উইন্ডো ওপেন হচ্ছে...', 'info');
  };

  const handleDownloadFile = () => {
    downloadOfflineReportFile(metrics, restaurants, factories);
    onShowToast('অফলাইন পূর্ণাঙ্গ রিপোর্ট ডাউনলোড হয়েছে', 'success');
  };

  const handleCopySummary = () => {
    const text = `📊 পানিশিল্প — ফিজিবিলিটি ও ফিল্ড রিসার্চ সারসংক্ষেপ (${currentDate})
সিদ্ধান্ত: ${metrics.statusTextBengali}
• মোট রেস্টুরেন্ট রিসার্চ: ${toBengaliNumber(metrics.totalRestaurants)}টি
• নিশ্চিত আগ্রহী: ${toBengaliNumber(metrics.interestedRestaurants)}টি
• বোতল প্রতি নিট লাভ: ${formatBDT(metrics.profitPerBottle, true)} (${toBengaliNumber(metrics.profitMarginPercent)}% মার্জিন)
• সম্ভাব্য মাসিক নিট লাভ: ${formatBDT(metrics.estimatedMonthlyNetProfit, true)}
• মাসিক ব্রেক-ইভেন টার্গেট: ${toBengaliNumber(metrics.breakEvenBottles)} বোতল
• ফ্যাক্টরি ইউনিট উৎপাদন খরচ: ${formatBDT(metrics.minFactoryUnitCost, true)}/বোতল`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    onShowToast('সারসংক্ষেপ টেক্সট ক্লিপবোর্ডে কপি হয়েছে', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#faf8f5] overflow-hidden animate-in fade-in">
      {/* 1. TOP ACTION BAR */}
      <div className="liquid-glass border-b border-stone-200/80 px-4 h-15 flex items-center justify-between shrink-0 safe-top no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900 leading-tight">
              পিডিএফ রিপোর্ট প্রিভিউ ও ডাউনলোড
            </h2>
            <p className="text-[11px] text-stone-500 font-medium">
              সম্পূর্ণ বাংলায় প্রফেশনাল ফিজিবিলিটি কপি
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

      {/* 2. STICKY DOWNLOAD BUTTONS BAR */}
      <div className="bg-white/95 backdrop-blur-md px-4 py-2.5 border-b border-stone-200 shadow-xs flex items-center justify-between gap-2 shrink-0 no-print">
        <div className="flex items-center gap-1.5 flex-1">
          <button
            type="button"
            onClick={handlePrint}
            className="touch-target flex-1 rounded-xl bg-cyan-700 text-white py-2 px-3 text-xs font-bold shadow-md hover:bg-cyan-800 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>পিডিএফ ডাউনলোড / প্রিন্ট</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadFile}
            className="touch-target rounded-xl border border-stone-300 bg-white py-2 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 active:scale-[0.98] transition flex items-center justify-center gap-1 shadow-2xs"
            title="অফলাইন ফাইল ডাউনলোড"
          >
            <Download className="w-3.5 h-3.5 text-stone-600" />
            <span className="hidden sm:inline">অফলাইন ফাইল</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopySummary}
          className="touch-target rounded-xl border border-stone-300 bg-white py-2 px-3 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition flex items-center gap-1"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-500" />}
          <span>{copied ? 'কপি হয়েছে' : 'কপি সামারি'}</span>
        </button>
      </div>

      {/* 3. REPORT DOCUMENT CONTAINER (Crisp A4 document styling) */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-4 pb-16">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-stone-200/90 space-y-5 text-stone-800 print-page">
          
          {/* DOCUMENT HEADER */}
          <div className="border-b-2 border-cyan-700 pb-3 flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-100 text-cyan-800 uppercase tracking-wider">
                  অফিসিয়াল ফিল্ড সমীক্ষা রিপোর্ট
                </span>
                <span className="text-[10px] text-stone-400">·</span>
                <span className="text-[11px] text-stone-500 font-medium">{currentDate}</span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-cyan-900 leading-tight">
                পানিশিল্প (PaniShilpa) — ফিজিবিলিটি ও ফিল্ড রিসার্চ রিপোর্ট
              </h1>
              <p className="text-xs text-stone-600 mt-0.5 font-medium">
                রেস্টুরেন্ট চাহিদা এবং OEM বোটলিং ফ্যাক্টরি বিশ্লেষণ ভিত্তিক বিনিয়োগ ফিজিবিলিটি
              </p>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">ডাটা কনফিডেন্স</div>
              <div className="text-lg font-bold text-cyan-700">{toBengaliNumber(metrics.dataConfidencePercent)}%</div>
            </div>
          </div>

          {/* 1. FEASIBILITY DECISION SUMMARY */}
          <div className={`p-4 rounded-2xl border ${
            metrics.feasibilityStatus === 'profitable' 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
              : metrics.feasibilityStatus === 'moderate'
              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
              : 'bg-sky-50/70 border-sky-200 text-sky-950'
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-4 h-4 text-cyan-700" />
              <h2 className="text-sm font-bold uppercase tracking-wider">
                ফিজিবিলিটি সিদ্ধান্ত: {metrics.statusTextBengali}
              </h2>
            </div>
            <p className="text-xs text-stone-700 leading-relaxed">
              {metrics.recommendationBengali}
            </p>
          </div>

          {/* 2. THE CORE 6 QUESTION ANSWERS */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ১. ফিল্ড রিসার্চের মূল ৬টি প্রশ্নের সুনির্দিষ্ট উত্তর
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">১. মোট রেস্টুরেন্ট ভিজিট</span>
                <span className="text-base font-bold text-stone-900">{toBengaliNumber(metrics.totalRestaurants)} টি</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">দৈনিক ব্যবহার {toBengaliNumber(metrics.dailyTotalBottleDemand)} বোতল</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">২. আগ্রহী রেস্টুরেন্ট</span>
                <span className="text-base font-bold text-emerald-700">{toBengaliNumber(metrics.interestedRestaurants)} টি নিশ্চিত</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">{toBengaliNumber(metrics.maybeRestaurants)} টি সম্ভবত আগ্রহী</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">৩. প্রতি বোতলে নিট লাভ</span>
                <span className="text-base font-bold text-amber-700">{formatBDT(metrics.profitPerBottle, true)}</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">{toBengaliNumber(metrics.profitMarginPercent)}% গ্রস মার্জিন</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">৪. সম্ভাব্য মাসিক লাভ</span>
                <span className="text-base font-bold text-emerald-800">{formatBDT(metrics.estimatedMonthlyNetProfit, true)}</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">সব স্থায়ী খরচ বাদ দিয়ে</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">৫. ব্রেক-ইভেন টার্গেট</span>
                <span className="text-base font-bold text-indigo-700">{toBengaliNumber(metrics.breakEvenBottles)} বোতল</span>
                <span className="text-[10px] text-stone-500 block mt-0.5">মাসে মাত্র {toBengaliNumber(metrics.breakEvenDays)} দিনে কভার</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">৬. গবেষণা স্থিতি</span>
                <span className="text-base font-bold text-cyan-800">
                  {metrics.feasibilityStatus === 'profitable' ? 'উচ্চ সম্ভাবনাময়' : 'সতর্ক পরিচালনা'}
                </span>
                <span className="text-[10px] text-stone-500 block mt-0.5">{toBengaliNumber(metrics.totalFactories)}টি ফ্যাক্টরি ডাটা</span>
              </div>
            </div>
          </div>

          {/* 3. UNIT ECONOMICS & FACTORY COST TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ২. বোতল প্রতি ৯-উপাদান উৎপাদন ও ডেলিভারি খরচ
            </h3>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-700 uppercase font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2.5">উপাদান (Cost Head)</th>
                    <th className="p-2.5">স্পেসিফিকেশন</th>
                    <th className="p-2.5 text-right">একক খরচ (BDT)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  <tr>
                    <td className="p-2 font-medium">১. PET বোতল / প্রিফর্ম</td>
                    <td className="p-2 text-stone-500">ফুড গ্রেড ভার্জিন পেট বোতল</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.bottle || 2.10, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">২. ক্যাপ ও সিল</td>
                    <td className="p-2 text-stone-500">টেম্পার-প্রুফ ড্রপ ক্যাপ</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.cap || 0.65, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৩. পানি ও ফিলিং</td>
                    <td className="p-2 text-stone-500">৮-ধাপের RO, ওজোন ও UV ফিল্টারিং</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.waterFilling || 0.75, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৪. BOPP লেবেল</td>
                    <td className="p-2 text-stone-500">র্যাপ-অ্যারাউন্ড কাস্টম ব্র্যান্ড লেবেল</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.label || 0.60, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৫. প্রিন্টিং</td>
                    <td className="p-2 text-stone-500">লেজার এক্সপায়ারি ও ব্যাচ প্রিন্ট</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.printing || 0.15, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৬. বান্ডেল প্যাকেজিং</td>
                    <td className="p-2 text-stone-500">২৪ বোতল থার্মাল শ্রিঙ্ক প্যাক</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.packaging || 0.35, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৭. কার্টন বক্স শেয়ার</td>
                    <td className="p-2 text-stone-500">মাস্টার কার্টন বক্স আনুপাতিক অংশ</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.carton || 0.70, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৮. পরিবহন ও ট্রাকিং</td>
                    <td className="p-2 text-stone-500">ফ্যাক্টরি থেকে ঢাকা সেন্ট্রাল ডিপো</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.delivery || 0.85, true)}</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-medium">৯. অপচয় ও ওভারহেড</td>
                    <td className="p-2 text-stone-500">হ্যান্ডলিং ও ট্রানজিট বরাদ্দ</td>
                    <td className="p-2 text-right font-semibold">{formatBDT(bestFactory?.costs.other || 0.30, true)}</td>
                  </tr>
                  <tr className="bg-teal-50/80 font-bold text-teal-900 border-t border-teal-200">
                    <td className="p-2.5" colSpan={2}>মোট ফ্যাক্টরি ইউনিট উৎপাদন খরচ (Factory COGS):</td>
                    <td className="p-2.5 text-right">{formatBDT(metrics.minFactoryUnitCost, true)}</td>
                  </tr>
                  <tr className="bg-cyan-50/80 font-bold text-cyan-900">
                    <td className="p-2.5" colSpan={2}>রেস্টুরেন্টে প্রস্তাবিত পাইকারি বিক্রয় দর:</td>
                    <td className="p-2.5 text-right">{formatBDT(metrics.avgExpectedSellingPrice, true)}</td>
                  </tr>
                  <tr className="bg-emerald-100/70 font-bold text-emerald-900 text-sm">
                    <td className="p-2.5" colSpan={2}>প্রতি বোতলে গ্রস মুনাফা (Profit Per Bottle):</td>
                    <td className="p-2.5 text-right text-emerald-800">{formatBDT(metrics.profitPerBottle, true)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 4. FINANCIAL STATEMENT (P&L) */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ৩. মাসিক আর্থিক বিবরণী ও লাভ-ক্ষতি প্রক্ষেপণ (Monthly P&L)
            </h3>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-stone-200">
                <span className="text-stone-600">মাসিক মোট বিক্রয়ের বোতল সংখ্যা:</span>
                <span className="font-bold text-stone-900">{toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-stone-600">মোট বিক্রয় রাজস্ব (Gross Revenue):</span>
                <span className="font-bold text-stone-900">{formatBDT(metrics.estimatedMonthlyRevenue, true)}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-rose-700">
                <span>ফ্যাক্টরি বোতলিং খরচ (COGS):</span>
                <span className="font-semibold">- {formatBDT(metrics.estimatedMonthlyCost, true)}</span>
              </div>
              <div className="flex justify-between items-center py-1 font-semibold text-emerald-800 border-t border-stone-200">
                <span>মোট গ্রস মুনাফা (Gross Profit):</span>
                <span>{formatBDT(metrics.estimatedMonthlyGrossProfit, true)}</span>
              </div>
              <div className="flex justify-between items-center py-1 text-rose-700">
                <span>মাসিক নির্ধারিত পরিচালনা ব্যয় (Fixed Overhead):</span>
                <span className="font-semibold">- {formatBDT(metrics.fixedMonthlyOverhead, true)}</span>
              </div>
              <div className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-emerald-100 text-emerald-950 font-bold text-sm">
                <span>সম্ভাব্য নিট মাসিক লাভ (Net Profit):</span>
                <span className="text-base text-emerald-900">{formatBDT(metrics.estimatedMonthlyNetProfit, true)}</span>
              </div>
            </div>
          </div>

          {/* 5. RESTAURANT DATA SUMMARY TABLE */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ৪. ফিল্ডে ভিজিটকৃত রেস্টুরেন্টের ডাটা খতিয়ান
            </h3>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2">রেস্টুরেন্ট নাম</th>
                    <th className="p-2">এলাকা</th>
                    <th className="p-2">দৈনিক কাস্টমার</th>
                    <th className="p-2">বর্তমান দর</th>
                    <th className="p-2">আগ্রহ</th>
                    <th className="p-2 text-right">মাসিক চাহিদা</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {restaurants.map(r => (
                    <tr key={r.id}>
                      <td className="p-2 font-medium text-stone-900">{r.name}</td>
                      <td className="p-2 text-stone-600">{r.area}</td>
                      <td className="p-2 text-stone-600">{toBengaliNumber(r.approxDailyCustomers)} জন</td>
                      <td className="p-2 text-stone-600">{formatBDT(r.currentPurchasePrice, true)}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.interested === 'হ্যাঁ' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : r.interested === 'সম্ভবত'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {r.interested}
                        </span>
                      </td>
                      <td className="p-2 text-right font-bold text-stone-900">
                        {toBengaliNumber(r.expectedMonthlyQuantity || (r.dailyBottleUsage * 30))} বোতল
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. FACTORIES COMPARISON */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 border-b border-stone-200 pb-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ৫. OEM বোতলজাতকরণ ফ্যাক্টরি তুলনা
            </h3>

            <div className="overflow-x-auto rounded-xl border border-stone-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-50 text-stone-700 font-semibold border-b border-stone-200">
                  <tr>
                    <th className="p-2">ফ্যাক্টরি নাম</th>
                    <th className="p-2">অবস্থান</th>
                    <th className="p-2">সাইজ</th>
                    <th className="p-2">MOQ</th>
                    <th className="p-2 text-right">ইউনিট খরচ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {factories.map(f => (
                    <tr key={f.id}>
                      <td className="p-2 font-medium text-stone-900">{f.name}</td>
                      <td className="p-2 text-stone-600">{f.location}</td>
                      <td className="p-2 text-stone-600">{f.bottleSize}</td>
                      <td className="p-2 text-stone-600">{toBengaliNumber(f.moq)} বোতল</td>
                      <td className="p-2 text-right font-bold text-cyan-800">{formatBDT(f.unitCost, true)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. STRATEGIC NEXT STEPS */}
          <div className="p-4 rounded-2xl bg-stone-900 text-white space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
              ৬. পরবর্তী বাস্তবায়ন রূপরেখা ও সুপারিশ
            </h4>
            <ul className="text-xs space-y-1.5 text-stone-300 list-disc pl-4 leading-relaxed">
              <li>আগ্রহী রেস্টুরেন্টগুলোর জন্য ফ্যাক্টরি থেকে অবিলম্বে ৩০০০ বোতলের কাস্টম ব্র্যান্ডেড ট্রায়াল লট প্রস্তুত করুন।</li>
              <li>সুলতান'স ডাইন ও স্টার কাবাবের মতো বড় চেইনের সাথে ১৫ দিনের সাইক্লিক বিলিংয়ে লিখিত সমঝোতা চুক্তি (MoU) স্বাক্ষর করুন।</li>
              <li>ক্লাস্টারভিত্তিক ডেলিভারি শিডিউল (সোম-বুধ-শুক্র) নির্ধারণ করে পরিবহন খরচ ২৫% সাশ্রয় করুন।</li>
            </ul>
          </div>

          {/* FOOTER */}
          <div className="pt-3 border-t border-stone-200 text-[11px] text-stone-400 flex items-center justify-between">
            <span>পানিশিল্প ফিল্ড রিসার্চ সিস্টেম (PaniShilpa)</span>
            <span>পৃষ্ঠা ১/১ · পূর্ণাঙ্গ ব্যবসায়িক সম্ভাব্যতা রিপোর্ট</span>
          </div>
        </div>
      </div>
    </div>
  );
};
