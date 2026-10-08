import React, { useState } from 'react';
import { 
  Factory as FactoryIcon, 
  Plus, 
  Phone, 
  MapPin, 
  Coins, 
  Award, 
  Check, 
  ChevronRight, 
  Edit3, 
  Trash2,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';
import { Factory } from '../../types';
import { toBengaliNumber, formatBDT } from '../../utils/calculations';

interface FactoryListViewProps {
  factories: Factory[];
  onOpenCreate: () => void;
  onEdit: (factory: Factory) => void;
  onDeleteRequest: (factory: Factory) => void;
}

export const FactoryListView: React.FC<FactoryListViewProps> = ({
  factories,
  onOpenCreate,
  onEdit,
  onDeleteRequest,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Sort by lowest unit cost
  const sortedFactories = [...factories].sort((a, b) => a.unitCost - b.unitCost);

  return (
    <div className="space-y-3 pb-24">
      {/* 1. TOP HEADER SUMMARY */}
      <div className="liquid-glass-card rounded-2xl p-3.5 border border-stone-200/90 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-700 flex items-center justify-center shrink-0">
            <FactoryIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-stone-900 leading-tight">
              OEM বোটলিং ফ্যাক্টরি ডাটাবেজ
            </h3>
            <p className="text-[11px] text-stone-500 mt-0.5">
              মোট {toBengaliNumber(factories.length)}টি ফ্যাক্টরির উৎপাদন খরচ সংরক্ষিত
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCreate}
          className="touch-target px-3 py-1.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-xs hover:bg-cyan-800 transition flex items-center gap-1 active:scale-[0.98]"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ নতুন ফ্যাক্টরি</span>
        </button>
      </div>

      {/* 2. FACTORY CARDS */}
      {sortedFactories.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-8 text-center space-y-3 my-6 border border-dashed border-stone-300">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mx-auto">
            <FactoryIcon className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-900">
            কোনো ফ্যাক্টরি ডাটা নেই
          </h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            গাজীপুর, সাভার বা নারায়ণগঞ্জের বোতলজাতকরণ ফ্যাক্টরির ইউনিট খরচ যুক্ত করুন।
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="touch-target px-5 py-2.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-sm hover:bg-cyan-800 transition inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + প্রথম ফ্যাক্টরি খরচ যোগ করুন
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sortedFactories.map((factory, index) => {
            const isExpanded = expandedId === factory.id;
            const isLowestCost = index === 0;

            return (
              <div
                key={factory.id}
                className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 shadow-xs hover:border-teal-200/80 transition-all space-y-3"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h3 className="text-base font-bold text-stone-900 leading-snug truncate">
                        {factory.name}
                      </h3>
                      {isLowestCost && (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                          🏆 সাশ্রয়ী দর
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-teal-700" />
                      <span className="truncate">{factory.location}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-stone-500 block leading-none">ইউনিট উৎপাদন খরচ</span>
                    <span className="text-base font-bold text-teal-800 leading-tight">
                      {formatBDT(factory.unitCost, true)}
                    </span>
                    <span className="text-[10px] text-stone-500 block">/বোতল</span>
                  </div>
                </div>

                {/* Key Production Stats Grid */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50/90 p-2.5 rounded-xl border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">বোতলের সাইজ</span>
                    <span className="text-xs font-bold text-stone-800">
                      {factory.bottleSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">নূন্যতম MOQ</span>
                    <span className="text-xs font-bold text-stone-800">
                      {toBengaliNumber(factory.moq)} বোতল
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">লিড টাইম</span>
                    <span className="text-xs font-bold text-stone-800">
                      {toBengaliNumber(factory.leadTimeDays)} দিন
                    </span>
                  </div>
                </div>

                {/* Private Label Badges */}
                <div className="flex items-center gap-2 flex-wrap text-[11px] text-stone-600">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${factory.customLabel ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    কাস্টম লেবেল
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${factory.customBottle ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    কাস্টম ডাই বোতল
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${factory.privateLabel ? 'bg-emerald-500' : 'bg-stone-300'}`} />
                    প্রাইভেট লেবেল প্রস্তুত
                  </span>
                </div>

                {/* Detailed Breakdown Collapse */}
                {isExpanded && (
                  <div className="pt-2 border-t border-stone-100 space-y-3 text-xs text-stone-700 animate-in fade-in">
                    {/* 9-Point Cost Table */}
                    <div className="bg-white/80 p-3 rounded-xl border border-stone-150 space-y-1.5">
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-600 mb-1 flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-600" />
                        প্রতি বোতলের বিস্তারিত খরচ বিভাজন (Cost Breakdown)
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-500">PET বোতল:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.bottle, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">ক্যাপ ও সিল:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.cap, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">ফিল্টারিং ও ফিলিং:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.waterFilling, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">BOPP লেবেল:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.label, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">প্রিন্টিং ও এক্সপায়ারি:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.printing, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">প্যাকেজিং ও র্যাপিং:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.packaging, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">কার্টন বক্স শেয়ার:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.carton, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">ঢাকায় ডেলিভারি:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.delivery, true)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">অন্যান্য / অপচয়:</span>
                          <span className="font-semibold">{formatBDT(factory.costs.other, true)}</span>
                        </div>
                      </div>
                      <div className="pt-1.5 mt-1 border-t border-stone-200 flex justify-between font-bold text-teal-900 text-xs">
                        <span>মোট উৎপাদন খরচ (Net Cost):</span>
                        <span>{formatBDT(factory.unitCost, true)}</span>
                      </div>
                    </div>

                    {/* Quality & Certifications */}
                    <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-stone-500">সার্টিফিকেশন:</span>
                        <span className="font-semibold text-stone-800">
                          {factory.certifications?.join(', ') || 'কোনোটি উল্লেখিত নেই'}
                        </span>
                      </div>
                      {factory.plateCylinderCost && (
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-500">সিলিন্ডার / প্লেট খরচ (এককালীন):</span>
                          <span className="font-semibold text-stone-800">{formatBDT(factory.plateCylinderCost, true)}</span>
                        </div>
                      )}
                      {factory.paymentTerms && (
                        <div className="flex justify-between text-xs">
                          <span className="text-stone-500">পেমেন্ট টার্মস:</span>
                          <span className="font-semibold text-stone-800">{factory.paymentTerms}</span>
                        </div>
                      )}
                    </div>

                    {/* Contact Person Card */}
                    {factory.contactPerson && (
                      <div className="flex justify-between items-center bg-teal-50/80 p-2.5 rounded-xl border border-teal-100">
                        <div>
                          <span className="text-[10px] text-stone-500 block">ফ্যাক্টরি ইনচার্জ / সেলস</span>
                          <span className="font-bold text-teal-950 text-xs">{factory.contactPerson}</span>
                        </div>
                        {factory.phone && (
                          <a
                            href={`tel:${factory.phone}`}
                            className="touch-target px-3 py-1.5 rounded-lg bg-teal-700 text-white font-medium flex items-center gap-1 hover:bg-teal-800 text-xs shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল দিন ({factory.phone})</span>
                          </a>
                        )}
                      </div>
                    )}

                    {factory.notes && (
                      <div className="bg-stone-50 p-2 rounded-xl text-stone-600 text-xs italic">
                        {factory.notes}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions Bottom Bar */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : factory.id)}
                    className="touch-target text-xs text-stone-600 font-medium px-2 py-1 rounded-lg hover:bg-stone-100 transition flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'সংক্ষেপ করুন' : 'খরচ ব্রেকডাউন দেখুন'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {factory.phone && !isExpanded && (
                      <a
                        href={`tel:${factory.phone}`}
                        className="touch-target w-9 h-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-teal-700 hover:bg-teal-50 transition"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEdit(factory)}
                      className="touch-target px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1 transition shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRequest(factory)}
                      className="touch-target w-9 h-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-rose-500 hover:bg-rose-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
