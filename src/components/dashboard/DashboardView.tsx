import React from 'react';
import { 
  TrendingUp, 
  Store, 
  Factory as FactoryIcon, 
  Coins, 
  Target, 
  Calendar, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Restaurant, Factory, FeasibilityMetrics, ActiveTab } from '../../types';
import { toBengaliNumber, formatBDT } from '../../utils/calculations';

interface DashboardViewProps {
  metrics: FeasibilityMetrics;
  restaurants: Restaurant[];
  factories: Factory[];
  onNavigateTab: (tab: ActiveTab) => void;
  onOpenNewRestaurant: () => void;
  onOpenNewFactory: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  restaurants,
  factories,
  onNavigateTab,
  onOpenNewRestaurant,
  onOpenNewFactory,
}) => {
  // Status pill theme
  const getStatusTheme = () => {
    switch (metrics.feasibilityStatus) {
      case 'profitable':
        return {
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/30',
          text: 'text-emerald-800',
          indicator: 'bg-emerald-500',
          glow: 'shadow-emerald-500/10',
        };
      case 'moderate':
        return {
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/30',
          text: 'text-amber-800',
          indicator: 'bg-amber-500',
          glow: 'shadow-amber-500/10',
        };
      default:
        return {
          bg: 'bg-sky-500/10',
          border: 'border-sky-500/30',
          text: 'text-sky-900',
          indicator: 'bg-sky-500',
          glow: 'shadow-sky-500/10',
        };
    }
  };

  const statusTheme = getStatusTheme();

  return (
    <div className="space-y-4 pb-24">
      {/* 1. TOP BUSINESS STATUS CARD (Primary Decision Card) */}
      <section className="liquid-glass-card rounded-3xl p-4 sm:p-5 border border-stone-200/90 relative overflow-hidden shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${statusTheme.indicator} animate-pulse`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              ফিজিবিলিটি সিদ্ধান্ত (Viability Status)
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100/80 px-2 py-0.5 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-600" />
            <span>ডাটা কনফিডেন্স {toBengaliNumber(metrics.dataConfidencePercent)}%</span>
          </div>
        </div>

        <div className={`p-3.5 rounded-2xl ${statusTheme.bg} border ${statusTheme.border} mb-3`}>
          <h2 className={`text-lg sm:text-xl font-bold ${statusTheme.text} flex items-center gap-2`}>
            {metrics.statusTextBengali}
          </h2>
          <p className="text-xs sm:text-sm text-stone-700 mt-1 leading-relaxed">
            {metrics.recommendationBengali}
          </p>
        </div>

        {/* Progress bar towards statistical confidence */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-stone-500">
            <span>ফিল্ড রিসার্চ অগ্রগতি</span>
            <span>{toBengaliNumber(metrics.totalRestaurants)}/১০ রেস্টুরেন্ট · {toBengaliNumber(metrics.totalFactories)}/৩ ফ্যাক্টরি</span>
          </div>
          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-cyan-700 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, metrics.dataConfidencePercent)}%` }}
            />
          </div>
        </div>
      </section>

      {/* QUICK MOBILE ADD ACTIONS (For fast field visits) */}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={onOpenNewRestaurant}
          className="touch-target liquid-glass-card rounded-2xl p-3 border border-stone-200/90 flex items-center justify-center gap-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 active:scale-[0.98] transition shadow-xs"
        >
          <div className="w-7 h-7 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-left leading-tight truncate">
            + রেস্টুরেন্ট তথ্য<br />
            <span className="text-[10px] text-stone-500 font-normal">১ মিনিটে যোগ করুন</span>
          </span>
        </button>

        <button
          type="button"
          onClick={onOpenNewFactory}
          className="touch-target liquid-glass-card rounded-2xl p-3 border border-stone-200/90 flex items-center justify-center gap-2 text-xs font-semibold text-stone-800 hover:bg-stone-50 active:scale-[0.98] transition shadow-xs"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-700 text-white flex items-center justify-center shrink-0">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-left leading-tight truncate">
            + ফ্যাক্টরি খরচ<br />
            <span className="text-[10px] text-stone-500 font-normal">OEM ইউনিট রেট</span>
          </span>
        </button>
      </div>

      {/* 2. THE 6 CORE QUESTIONS KPI GRID (Compact 2-Column Grid) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            ফিল্ড রিসার্চের মূল ৬টি উত্তর (Core 6 KPIs)
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('analysis')}
            className="text-xs font-medium text-cyan-800 flex items-center gap-0.5 hover:underline"
          >
            বিস্তারিত <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Q1: কতগুলো Restaurant Research করেছি? */}
          <div 
            onClick={() => onNavigateTab('restaurants')}
            className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 cursor-pointer hover:border-cyan-200 transition active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">১. মোট রেস্টুরেন্ট</span>
              <Store className="w-4 h-4 text-cyan-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900 tracking-tight leading-none">
              {toBengaliNumber(metrics.totalRestaurants)}
              <span className="text-xs font-normal text-stone-500 ml-1">টি</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-2 flex items-center gap-1 truncate">
              <span>দৈনিক ব্যবহার: {toBengaliNumber(metrics.dailyTotalBottleDemand)} বোতল</span>
            </div>
          </div>

          {/* Q2: কতগুলো Restaurant আগ্রহী? */}
          <div 
            onClick={() => onNavigateTab('restaurants')}
            className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 cursor-pointer hover:border-emerald-200 transition active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">২. আগ্রহী রেস্টুরেন্ট</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-emerald-700 tracking-tight leading-none">
              {toBengaliNumber(metrics.interestedRestaurants)}
              <span className="text-xs font-normal text-stone-500 ml-1">টি নিশ্চিত</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-2 truncate">
              {toBengaliNumber(metrics.maybeRestaurants)} টি সম্ভবত আগ্রহী
            </div>
          </div>

          {/* Q3: প্রতি বোতলে কত লাভ? */}
          <div className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">৩. প্রতি বোতলে লাভ</span>
              <Coins className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900 tracking-tight leading-none">
              {formatBDT(metrics.profitPerBottle, true)}
            </div>
            <div className="text-[10px] text-stone-500 mt-2 truncate">
              বিক্রয় {formatBDT(metrics.avgExpectedSellingPrice, true)} - উৎপাদন {formatBDT(metrics.minFactoryUnitCost, true)}
            </div>
          </div>

          {/* Q4: মাসে আনুমানিক কত লাভ? */}
          <div className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 bg-emerald-500/5">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">৪. সম্ভাব্য মাসিক লাভ</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-emerald-800 tracking-tight leading-none truncate">
              {formatBDT(metrics.estimatedMonthlyNetProfit, true)}
            </div>
            <div className="text-[10px] text-stone-500 mt-2 truncate">
              নেট (খরচ বাদ দিয়ে)
            </div>
          </div>

          {/* Q5: Break-even কত? */}
          <div className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90">
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">৫. ব্রেক-ইভেন টার্গেট</span>
              <Target className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-stone-900 tracking-tight leading-none">
              {toBengaliNumber(metrics.breakEvenBottles)}
              <span className="text-xs font-normal text-stone-500 ml-1">বোতল/মাস</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-2 truncate">
              আনুমানিক {toBengaliNumber(metrics.breakEvenDays)} দিনের চাহিদায় কভার
            </div>
          </div>

          {/* Q6: Factory Research Summary */}
          <div 
            onClick={() => onNavigateTab('factories')}
            className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 cursor-pointer hover:border-teal-200 transition active:scale-[0.98]"
          >
            <div className="flex items-center justify-between text-stone-500 mb-1.5">
              <span className="text-[11px] font-medium leading-none">৬. ফ্যাক্টরি সন্ধান</span>
              <FactoryIcon className="w-4 h-4 text-teal-700" />
            </div>
            <div className="text-2xl font-bold text-stone-900 tracking-tight leading-none">
              {toBengaliNumber(metrics.totalFactories)}
              <span className="text-xs font-normal text-stone-500 ml-1">টি OEM</span>
            </div>
            <div className="text-[10px] text-stone-500 mt-2 truncate">
              সর্বনিম্ন খরচ: {formatBDT(metrics.minFactoryUnitCost, true)}/বোতল
            </div>
          </div>
        </div>
      </section>

      {/* MONTHLY DEMAND VS BREAK-EVEN SNAPSHOT CARD */}
      <section className="liquid-glass-card rounded-3xl p-4 border border-stone-200/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-700" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              মাসিক বিক্রয়ের লক্ষ্যমাত্রা বনাম ব্রেক-ইভেন
            </h4>
          </div>
          <span className="text-[11px] text-stone-500">
            {metrics.totalMonthlyBottleDemand >= metrics.breakEvenBottles ? '🟢 নিরাপদ সীমার উপরে' : '🟡 টার্গেটের নিচে'}
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-medium text-stone-700">
            <span>সম্ভাব্য চাহিদা: {toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল</span>
            <span>ব্রেক-ইভেন: {toBengaliNumber(metrics.breakEvenBottles)} বোতল</span>
          </div>

          <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex">
            {metrics.breakEvenBottles > 0 && (
              <div 
                className="bg-amber-500 h-full"
                style={{ 
                  width: `${Math.min(100, Math.round((metrics.breakEvenBottles / Math.max(metrics.totalMonthlyBottleDemand, metrics.breakEvenBottles * 1.2)) * 100))}%` 
                }}
                title="ব্রেক-ইভেন প্রয়োজন"
              />
            )}
            <div 
              className="bg-emerald-500 h-full"
              style={{ 
                width: `${Math.max(0, Math.min(100, 100 - Math.round((metrics.breakEvenBottles / Math.max(metrics.totalMonthlyBottleDemand, metrics.breakEvenBottles * 1.2)) * 100)))}%` 
              }}
              title="মুনাফা অঞ্চল"
            />
          </div>

          <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              স্থায়ী খরচ ওঠাতে প্রয়োজনীয় কোটা
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              নিখাদ লাভের অংশ
            </span>
          </div>
        </div>
      </section>

      {/* RECENT VISITS (Top 3 Restaurants Card Stack) */}
      <section className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            সাম্প্রতিক ফিল্ড ভিজিট (Recent Field Visits)
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTab('restaurants')}
            className="text-xs font-medium text-cyan-800 flex items-center gap-0.5 hover:underline"
          >
            সব দেখুন ({toBengaliNumber(restaurants.length)})
          </button>
        </div>

        <div className="space-y-2">
          {restaurants.slice(0, 3).map((r) => (
            <div
              key={r.id}
              onClick={() => onNavigateTab('restaurants')}
              className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 cursor-pointer active:scale-[0.99] transition hover:bg-stone-50/60"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-stone-900 truncate">
                    {r.name}
                  </h4>
                  <p className="text-xs text-stone-500 truncate mt-0.5">
                    {r.area} · {r.bottleSize} · দৈনিক {toBengaliNumber(r.dailyBottleUsage)} বোতল
                  </p>
                </div>

                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-medium shrink-0 ${
                    r.interested === 'হ্যাঁ'
                      ? 'bg-emerald-100 text-emerald-800'
                      : r.interested === 'সম্ভবত'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {r.interested === 'হ্যাঁ' ? '🟢 আগ্রহী' : r.interested === 'সম্ভবত' ? '🟡 সম্ভবত' : '🔴 আগ্রহী নয়'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
