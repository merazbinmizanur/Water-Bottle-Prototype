import React, { useRef, useState } from 'react';
import { 
  Calculator, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RefreshCw, 
  Trash2, 
  Info, 
  Sliders, 
  Smartphone, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  HardDriveDownload,
  Database,
  FileText
} from 'lucide-react';
import { Storage, AppSettings } from '../../utils/storage';
import { toBengaliNumber } from '../../utils/calculations';
import { PWAInstallButton } from '../common/PWAInstallButton';

interface MoreViewProps {
  restaurantCount: number;
  factoryCount: number;
  settings: AppSettings;
  onOpenCalculator: () => void;
  onOpenPDFReport: () => void;
  onRefreshData: () => void;
  onResetAllRequest: () => void;
  onShowToast: (message: string, type?: 'success' | 'warning' | 'info') => void;
}

export const MoreView: React.FC<MoreViewProps> = ({
  restaurantCount,
  factoryCount,
  settings,
  onOpenCalculator,
  onOpenPDFReport,
  onRefreshData,
  onResetAllRequest,
  onShowToast,
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export JSON
  const handleExportJSON = () => {
    const jsonStr = Storage.exportAllAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `panishilpa_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('ব্যাকআপ ফাইল সফলভাবে ডাউনলোড হয়েছে', 'success');
  };

  // Export CSV
  const handleExportCSV = () => {
    const csvStr = Storage.exportRestaurantsCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `restaurants_field_data_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onShowToast('রেস্টুরেন্ট এক্সেল CSV ডাউনলোড হয়েছে', 'success');
  };

  // Import JSON
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = Storage.importFromJSON(content);
      if (success) {
        onRefreshData();
        onShowToast('ডাটা সফলভাবে রিস্টোর হয়েছে', 'success');
      } else {
        onShowToast('ভুল ফাইল ফরম্যাট। সঠিক JSON ফাইল দিন।', 'warning');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Preload Sample Data
  const handleLoadSample = () => {
    Storage.loadSampleData();
    onRefreshData();
    onShowToast('নমুনা ফিল্ড ডাটা লোড করা হয়েছে', 'success');
  };

  return (
    <div className="space-y-4 pb-24">
      {/* 1. APP / DATA SUMMARY CARD */}
      <div className="liquid-glass-card rounded-3xl p-4 border border-stone-200/90 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-cyan-700 text-white flex items-center justify-center font-bold text-lg shadow-sm">
            প
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              পানিশিল্প (PaniShilpa)
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              বোতলজাত পানি ভেঞ্চারের ফিল্ড রিসার্চ ও ফিজিবিলিটি টুল
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-stone-100">
          <div className="bg-stone-50/80 p-2 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block">সংরক্ষিত রেস্টুরেন্ট</span>
            <span className="text-sm font-bold text-stone-900">{toBengaliNumber(restaurantCount)}টি</span>
          </div>
          <div className="bg-stone-50/80 p-2 rounded-xl border border-stone-100">
            <span className="text-[10px] text-stone-500 block">সংরক্ষিত OEM ফ্যাক্টরি</span>
            <span className="text-sm font-bold text-stone-900">{toBengaliNumber(factoryCount)}টি</span>
          </div>
        </div>

        {/* PWA Install Button banner */}
        <PWAInstallButton />
      </div>

      {/* 2. FIELD TOOLS GROUP */}
      <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden divide-y divide-stone-100">
        <div className="p-3 bg-stone-50/60 text-[11px] font-bold uppercase tracking-wider text-stone-500">
          ফিল্ড টুলস ও ক্যালকুলেটর (Field Tools)
        </div>

        <button
          type="button"
          onClick={onOpenCalculator}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-stone-900 block leading-tight">
                তাৎক্ষণিক কস্ট ক্যালকুলেটর
              </span>
              <span className="text-xs text-stone-500">
                রেস্টুরেন্টে দাঁড়িয়ে দরকষাকষির সময় ইউনিট মার্জিন যাচাই
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* 3. DATA BACKUP & EXPORT GROUP */}
      <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden divide-y divide-stone-100">
        <div className="p-3 bg-stone-50/60 text-[11px] font-bold uppercase tracking-wider text-stone-500">
          ডাটা ব্যাকআপ ও রিপোর্ট এক্সপোর্ট (Reports & Data)
        </div>

        {/* Complete PDF Report */}
        <button
          type="button"
          onClick={onOpenPDFReport}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-cyan-50/50 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-cyan-950 block leading-tight">
                পূর্ণাঙ্গ ফিজিবিলিটি রিপোর্ট (PDF)
              </span>
              <span className="text-xs text-stone-500">
                সম্পূর্ণ বাংলায় সাজানো প্রফেশনাল রিপোর্ট ডাউনলোড ও প্রিন্ট
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-cyan-600" />
        </button>

        {/* Export CSV */}
        <button
          type="button"
          onClick={handleExportCSV}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block leading-tight">
                এক্সেল শিট এক্সপোর্ট (CSV)
              </span>
              <span className="text-xs text-stone-500">
                সব রেস্টুরেন্টের তথ্য এক্সেল বা গুগল শিটে খুলুন
              </span>
            </div>
          </div>
          <Download className="w-4 h-4 text-stone-400" />
        </button>

        {/* Export JSON */}
        <button
          type="button"
          onClick={handleExportJSON}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block leading-tight">
                সম্পূর্ণ ব্যাকআপ ডাউনলোড (JSON)
              </span>
              <span className="text-xs text-stone-500">
                মোবাইল পরিবর্তন বা অফলাইন সংরক্ষণের জন্য ফাইল সেভ করুন
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Import JSON */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block leading-tight">
                ব্যাকআপ রিস্টোর করুন (Import Data)
              </span>
              <span className="text-xs text-stone-500">
                পূর্বে সংরক্ষিত JSON ফাইল থেকে ডাটা পুনরুদ্ধার
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />

        {/* Load Sample Data */}
        <button
          type="button"
          onClick={handleLoadSample}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block leading-tight">
                ফিল্ড নমুনা ডাটা রিলোড (Sample Data)
              </span>
              <span className="text-xs text-stone-500">
                ঢাকা শহরের বাস্তবসম্মত ৬টি রেস্টুরেন্ট ও ৩টি ফ্যাক্টরি ডাটা
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>
      </div>

      {/* 4. SETTINGS & ABOUT GROUP */}
      <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden divide-y divide-stone-100">
        <button
          type="button"
          onClick={() => setShowAboutModal(true)}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-stone-50/80 touch-target transition"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-stone-900 block leading-tight">
                অ্যাপ সম্পর্কে ও অফলাইন গাইড
              </span>
              <span className="text-xs text-stone-500">
                PWA গাইড, অফলাইন নিরাপত্তা ও ফিল্ড টিপস
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400" />
        </button>

        {/* Clear / Reset All Data */}
        <button
          type="button"
          onClick={onResetAllRequest}
          className="w-full p-3.5 flex items-center justify-between text-left hover:bg-rose-50/50 touch-target transition text-rose-600"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold text-rose-700 block leading-tight">
                সব ডাটা রিসেট করুন (Clear All Data)
              </span>
              <span className="text-xs text-rose-500">
                লোকাল মেমোরি থেকে সমস্ত তথ্য মুছে ফেলুন
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-rose-400" />
        </button>
      </div>

      {/* ABOUT MODAL */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-3xl bg-white p-5 shadow-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                পানিশিল্প (PaniShilpa) গাইড
              </h3>
              <button
                type="button"
                onClick={() => setShowAboutModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:text-stone-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-stone-600 leading-relaxed max-h-[70vh] overflow-y-auto pr-1">
              <p>
                <strong>উদ্দেশ্য:</strong> এটি একটি পিউর মোবাইল-ফার্স্ট ফিল্ড রিসার্চ এবং ফিজিবিলিটি টুল। নতুন উদ্যোক্তা যখন রেস্টুরেন্ট ও ফ্যাক্টরিতে শারীরিকভাবে যান, তখন এক হাতে ফোন নিয়ে ১–২ মিনিটে ডাটা সংগ্রহ করে তাৎক্ষণিক সিদ্ধান্ত নেওয়া সম্ভব হয়।
              </p>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 space-y-1">
                <strong className="text-stone-900 block">অফলাইন সুবিধা:</strong>
                <p>
                  অ্যাপটি পুরোপুরি ব্রাউজারের লোকাল স্টোরেজে চলে। ইন্টারনেটের সংযোগ না থাকলেও ডাটা এন্ট্রি, এডিট বা হিসাব দেখতে কোনো বাধা নেই।
                </p>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-150 space-y-1">
                <strong className="text-stone-900 block">ডাটা নিরাপত্তা:</strong>
                <p>
                  প্রতিটি সেভ হওয়ার সাথে সাথে লোকাল ড্রাইভে ব্যাকআপ থাকে। ফিল্ড ভিজিট শেষে CSV ডাউনলোড করে এক্সেলে অ্যানালাইসিস করতে পারেন।
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAboutModal(false)}
              className="w-full touch-target rounded-xl bg-cyan-700 text-white font-semibold text-xs py-2.5 hover:bg-cyan-800 transition"
            >
              বন্ধ করুন (Close)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
