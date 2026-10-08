import React, { useState, useEffect } from 'react';
import { 
  X, 
  Factory as FactoryIcon, 
  Coins, 
  Layers, 
  ShieldCheck, 
  Check, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { Factory, FactoryCostBreakdown, BottleSize } from '../../types';
import { StickyActionBar } from '../common/StickyActionBar';
import { formatBDT } from '../../utils/calculations';

interface FactoryFormModalProps {
  isOpen: boolean;
  initialData?: Factory | null;
  onClose: () => void;
  onSave: (factory: Factory) => void;
}

const COMMON_LOCATIONS = [
  'টঙ্গী, গাজীপুর', 'হেমায়েতপুর, সাভার', 'কাঁচপুর, নারায়ণগঞ্জ',
  'আশুলিয়া, সাভার', 'কেরানীগঞ্জ, ঢাকা', 'কালিয়াকৈর, গাজীপুর',
  'সীতাকুণ্ড, চট্টগ্রাম', 'অন্যান্য (Other)'
];

const DEFAULT_COSTS: FactoryCostBreakdown = {
  bottle: 2.10,
  cap: 0.65,
  waterFilling: 0.75,
  label: 0.60,
  printing: 0.15,
  packaging: 0.35,
  carton: 0.70,
  delivery: 0.85,
  other: 0.30,
};

export const FactoryFormModal: React.FC<FactoryFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  // Basic info
  const [name, setName] = useState('');
  const [location, setLocation] = useState('টঙ্গী, গাজীপুর');
  const [customLocation, setCustomLocation] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');

  // Production
  const [bottleSize, setBottleSize] = useState<BottleSize>('500ml');
  const [bottleType, setBottleType] = useState('Standard PET');
  const [moq, setMoq] = useState<number | ''>(5000);
  const [dailyCapacity, setDailyCapacity] = useState<number | ''>(30000);
  const [monthlyCapacity, setMonthlyCapacity] = useState<number | ''>(800000);

  // Costs
  const [costs, setCosts] = useState<FactoryCostBreakdown>(DEFAULT_COSTS);

  // Private Label
  const [customLabel, setCustomLabel] = useState(true);
  const [customBottle, setCustomBottle] = useState(false);
  const [privateLabel, setPrivateLabel] = useState(true);
  const [plateCylinderCost, setPlateCylinderCost] = useState<number | ''>(18000);

  // Quality
  const [certifications, setCertifications] = useState<string[]>(['BSTI', 'ISO 22000']);
  const [waterTesting, setWaterTesting] = useState(true);
  const [productionProcess, setProductionProcess] = useState('');

  // Commercial
  const [paymentTerms, setPaymentTerms] = useState('৫০% অগ্রিম + ৫০% ডেলিভারিতে');
  const [leadTimeDays, setLeadTimeDays] = useState<number | ''>(4);
  const [priceNegotiable, setPriceNegotiable] = useState(true);
  const [notes, setNotes] = useState('');

  // Collapsibles for speed
  const [showQualitySection, setShowQualitySection] = useState(false);
  const [showCommercialSection, setShowCommercialSection] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Auto calculate total unit cost
  const totalUnitCost = Number((
    (Number(costs.bottle) || 0) +
    (Number(costs.cap) || 0) +
    (Number(costs.waterFilling) || 0) +
    (Number(costs.label) || 0) +
    (Number(costs.printing) || 0) +
    (Number(costs.packaging) || 0) +
    (Number(costs.carton) || 0) +
    (Number(costs.delivery) || 0) +
    (Number(costs.other) || 0)
  ).toFixed(2));

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      if (COMMON_LOCATIONS.includes(initialData.location)) {
        setLocation(initialData.location);
        setCustomLocation('');
      } else {
        setLocation('অন্যান্য (Other)');
        setCustomLocation(initialData.location || '');
      }
      setContactPerson(initialData.contactPerson || '');
      setPhone(initialData.phone || '');
      setBottleSize(initialData.bottleSize || '500ml');
      setBottleType(initialData.bottleType || 'Standard PET');
      setMoq(initialData.moq ?? 5000);
      setDailyCapacity(initialData.dailyCapacity ?? 30000);
      setMonthlyCapacity(initialData.monthlyCapacity ?? 800000);
      setCosts(initialData.costs || DEFAULT_COSTS);
      setCustomLabel(initialData.customLabel ?? true);
      setCustomBottle(initialData.customBottle ?? false);
      setPrivateLabel(initialData.privateLabel ?? true);
      setPlateCylinderCost(initialData.plateCylinderCost ?? '');
      setCertifications(initialData.certifications || ['BSTI']);
      setWaterTesting(initialData.waterTesting ?? true);
      setProductionProcess(initialData.productionProcess || '');
      setPaymentTerms(initialData.paymentTerms || '৫০% অগ্রিম + ৫০% ডেলিভারিতে');
      setLeadTimeDays(initialData.leadTimeDays ?? 4);
      setPriceNegotiable(initialData.priceNegotiable ?? true);
      setNotes(initialData.notes || '');
    } else {
      setName('');
      setLocation('টঙ্গী, গাজীপুর');
      setCustomLocation('');
      setContactPerson('');
      setPhone('');
      setBottleSize('500ml');
      setBottleType('Standard PET');
      setMoq(5000);
      setDailyCapacity(30000);
      setMonthlyCapacity(800000);
      setCosts(DEFAULT_COSTS);
      setCustomLabel(true);
      setCustomBottle(false);
      setPrivateLabel(true);
      setPlateCylinderCost(18000);
      setCertifications(['BSTI', 'ISO 22000']);
      setWaterTesting(true);
      setProductionProcess('');
      setPaymentTerms('৫০% অগ্রিম + ৫০% ডেলিভারিতে');
      setLeadTimeDays(4);
      setPriceNegotiable(true);
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const updateCost = (key: keyof FactoryCostBreakdown, value: number) => {
    setCosts(prev => ({ ...prev, [key]: value }));
  };

  const toggleCert = (cert: string) => {
    setCertifications(prev =>
      prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]
    );
  };

  const handleSave = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'ফ্যাক্টরির নাম লিখুন';
    if (location === 'অন্যান্য (Other)' && !customLocation.trim()) {
      errs.location = 'লোকেশন লিখুন';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const finalLocation = location === 'অন্যান্য (Other)' ? customLocation.trim() : location;

    const record: Factory = {
      id: initialData ? initialData.id : `fact-${Date.now()}`,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: name.trim(),
      location: finalLocation,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      bottleSize,
      bottleType,
      moq: Number(moq) || 0,
      dailyCapacity: Number(dailyCapacity) || 0,
      monthlyCapacity: Number(monthlyCapacity) || 0,
      costs: {
        bottle: Number(costs.bottle) || 0,
        cap: Number(costs.cap) || 0,
        waterFilling: Number(costs.waterFilling) || 0,
        label: Number(costs.label) || 0,
        printing: Number(costs.printing) || 0,
        packaging: Number(costs.packaging) || 0,
        carton: Number(costs.carton) || 0,
        delivery: Number(costs.delivery) || 0,
        other: Number(costs.other) || 0,
      },
      unitCost: totalUnitCost,
      customLabel,
      customBottle,
      privateLabel,
      plateCylinderCost: plateCylinderCost ? Number(plateCylinderCost) : undefined,
      certifications,
      waterTesting,
      productionProcess: productionProcess.trim(),
      paymentTerms,
      leadTimeDays: Number(leadTimeDays) || 3,
      priceNegotiable,
      notes: notes.trim(),
    };

    onSave(record);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#faf8f5] overflow-hidden animate-in fade-in">
      {/* 1. COMPACT MODAL HEADER */}
      <div className="liquid-glass border-b border-stone-200/80 px-4 h-14 flex items-center justify-between shrink-0 safe-top">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-700 text-white flex items-center justify-center">
            <FactoryIcon className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-none">
              {initialData ? 'ফ্যাক্টরি খরচ এডিট' : 'নতুন OEM ফ্যাক্টরি ও খরচ এন্ট্রি'}
            </h2>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              বোতল প্রতি উৎপাদন ও সরবরাহ খরচ হিসাব
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

      {/* 2. SCROLLABLE FORM BODY */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        {/* LIVE UNIT COST BANNER */}
        <div className="liquid-glass rounded-2xl p-3.5 border border-teal-300 bg-teal-50/70 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800 block">
              মোট ইউনিট উৎপাদন খরচ (Total Unit Cost)
            </span>
            <span className="text-[10px] text-teal-600">সবগুলো উপাদানের স্বয়ংক্রিয় যোগফল</span>
          </div>
          <div className="text-right">
            <span className="text-xl font-bold text-teal-900">
              {formatBDT(totalUnitCost, true)}
            </span>
            <span className="text-[10px] text-teal-700 block">/বোতল</span>
          </div>
        </div>

        {/* SECTION 1: FACTORY INFO */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              ফ্যাক্টরি পরিচিতি (Factory Information)
            </h3>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              ফ্যাক্টরি / কোম্পানির নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: মেঘনা বেভারেজ ও একুয়া OEM"
              className={`touch-target w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              অবস্থান / শিল্পাঞ্চল (Location)
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-teal-600"
            >
              {COMMON_LOCATIONS.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          {location === 'অন্যান্য (Other)' && (
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                নির্দিষ্ট এলাকার নাম লিখুন
              </label>
              <input
                type="text"
                value={customLocation}
                onChange={(e) => setCustomLocation(e.target.value)}
                placeholder="এলাকা লিখুন..."
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                যোগাযোগ ব্যক্তি
              </label>
              <input
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder="ম্যানেজার / সেলস"
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                ফোন নম্বর
              </label>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01XXXXXXXXX"
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: PRODUCTION SPECS & MOQ */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              উৎপাদন ও ক্যাপাসিটি (Production)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                বোতল সাইজ
              </label>
              <select
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value as BottleSize)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-xs text-stone-900 font-semibold"
              >
                <option value="250ml">250ml</option>
                <option value="330ml">330ml</option>
                <option value="500ml">500ml</option>
                <option value="1000ml">1000ml</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                বোতল ধরণ
              </label>
              <select
                value={bottleType}
                onChange={(e) => setBottleType(e.target.value)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-xs text-stone-900"
              >
                <option value="Standard PET">Standard PET</option>
                <option value="Heavy Premium">Heavy Premium</option>
                <option value="Square Sleek">Square Sleek</option>
                <option value="Lightweight Eco">Lightweight Eco</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                নূন্যতম MOQ (বোতল)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={moq}
                onChange={(e) => setMoq(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="5000"
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                দৈনিক ক্যাপাসিটি
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={dailyCapacity}
                onChange={(e) => setDailyCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="30000"
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: 9-ITEM COST BREAKDOWN (Direct requirement 7) */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              বোতল প্রতি খরচ বিভাজন (Cost Breakdown - BDT ৳)
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ১. বোতল / প্রিফর্ম (Bottle)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.bottle}
                onChange={(e) => updateCost('bottle', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ২. ক্যাপ ও সিল (Cap)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.cap}
                onChange={(e) => updateCost('cap', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৩. পানি ও ফিলিং (Water/Fill)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.waterFilling}
                onChange={(e) => updateCost('waterFilling', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৪. লেবেল / স্টিকার (Label)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.label}
                onChange={(e) => updateCost('label', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৫. ব্যাচ প্রিন্টিং (Printing)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.printing}
                onChange={(e) => updateCost('printing', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৬. বান্ডেল প্যাকেজিং (Wrap)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.packaging}
                onChange={(e) => updateCost('packaging', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৭. কার্টন বক্স শেয়ার (Carton)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.carton}
                onChange={(e) => updateCost('carton', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৮. পরিবহন / ডেলিভারি
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.delivery}
                onChange={(e) => updateCost('delivery', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                ৯. অন্যান্য ও অপচয় ওভারহেড (Other)
              </label>
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={costs.other}
                onChange={(e) => updateCost('other', Number(e.target.value))}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: PRIVATE LABEL OPTIONS */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              প্রাইভেট লেবেল সুবিধা (Private Label)
            </h3>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={customLabel}
                onChange={(e) => setCustomLabel(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600"
              />
              <span>কাস্টম লেবেল ডিজাইন প্রিন্ট করতে পারবে (Custom Label)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={customBottle}
                onChange={(e) => setCustomBottle(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600"
              />
              <span>কাস্টম মোল্ড / নিজস্ব শেপের বোতল সম্ভব (Custom Bottle)</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
              <input
                type="checkbox"
                checked={privateLabel}
                onChange={(e) => setPrivateLabel(e.target.checked)}
                className="w-4 h-4 rounded text-teal-700 focus:ring-teal-600"
              />
              <span>প্রাইভেট লেবেল / হোয়াইট লেবেলিং চুক্তি অনুমোদিত</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              এককালীন সিলিন্ডার / ডাই খরচ (৳)
            </label>
            <input
              type="number"
              inputMode="numeric"
              value={plateCylinderCost}
              onChange={(e) => setPlateCylinderCost(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="18000"
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm"
            />
          </div>
        </div>

        {/* SECTION 5: QUALITY & CERTIFICATIONS (Collapsible) */}
        <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowQualitySection(!showQualitySection)}
            className="w-full p-4 flex items-center justify-between text-left touch-target hover:bg-stone-50/50"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                মান ও অনুমোদন (Quality & Certifications)
              </h3>
            </div>
            {showQualitySection ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>

          {showQualitySection && (
            <div className="p-4 pt-0 space-y-3 animate-in fade-in">
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  অনুমোদনসমূহ:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['BSTI', 'ISO 22000', 'HACCP', 'Halal', 'FDA'].map(cert => (
                    <button
                      key={cert}
                      type="button"
                      onClick={() => toggleCert(cert)}
                      className={`touch-target px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                        certifications.includes(cert)
                          ? 'bg-teal-700 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {cert}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-center gap-2.5 text-xs text-stone-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={waterTesting}
                  onChange={(e) => setWaterTesting(e.target.checked)}
                  className="w-4 h-4 rounded text-teal-700"
                />
                <span>প্রতি লটের ওয়াটার টেস্টিং ল্যাব রিপোর্ট প্রদান করবে</span>
              </label>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ফিল্টারিং ও উৎপাদন প্রযুক্তি
                </label>
                <input
                  type="text"
                  value={productionProcess}
                  onChange={(e) => setProductionProcess(e.target.value)}
                  placeholder="যেমন: RO + UV + Ozonation + Automated Microfiltration"
                  className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 6: COMMERCIAL TERMS (Collapsible) */}
        <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowCommercialSection(!showCommercialSection)}
            className="w-full p-4 flex items-center justify-between text-left touch-target hover:bg-stone-50/50"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-700 inline-block" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                বাণিজ্যিক শর্তাবলী (Commercial Terms)
              </h3>
            </div>
            {showCommercialSection ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>

          {showCommercialSection && (
            <div className="p-4 pt-0 space-y-3 animate-in fade-in">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    লিড টাইম (দিন)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={leadTimeDays}
                    onChange={(e) => setLeadTimeDays(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="4"
                    className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    দাম আলোচনা সাপেক্ষ?
                  </label>
                  <select
                    value={priceNegotiable ? 'yes' : 'no'}
                    onChange={(e) => setPriceNegotiable(e.target.value === 'yes')}
                    className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-xs"
                  >
                    <option value="yes">হ্যাঁ (Negotiable)</option>
                    <option value="no">না (Fixed Rate)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  পেমেন্ট শর্ত (Payment Terms)
                </label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  placeholder="৫০% অগ্রিম, ৫০% ডেলিভারি চেকিং শেষে"
                  className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  নোট বা পর্যবেক্ষণ
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="অর্ডার ভলিউম বাড়লে প্রতি বোতলে ১৫ পয়সা ছাড়..."
                  className="w-full rounded-xl bg-white border border-stone-200 p-2.5 text-xs resize-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. STICKY MOBILE SAVE ACTION (Requirement 8) */}
      <StickyActionBar
        onCancel={onClose}
        onSave={handleSave}
        saveLabel={initialData ? 'আপডেট করুন (Save)' : 'ফ্যাক্টরি ডাটা সেভ করুন'}
        cancelLabel="বাতিল"
      />
    </div>
  );
};
