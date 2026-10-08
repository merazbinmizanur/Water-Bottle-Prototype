import React, { useState, useEffect } from 'react';
import { 
  X, 
  Store, 
  Droplet, 
  CheckCircle2, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { Restaurant, InterestStatus, BottleSize, RestaurantType } from '../../types';
import { StickyActionBar } from '../common/StickyActionBar';

interface RestaurantFormModalProps {
  isOpen: boolean;
  initialData?: Restaurant | null;
  onClose: () => void;
  onSave: (restaurant: Restaurant) => void;
}

const COMMON_AREAS = [
  'Dhanmondi', 'Gulshan', 'Banani', 'Uttara', 'Mirpur',
  'Mohakhali', 'Baily Road', 'Khilgaon', 'Motijheel',
  'Chattogram', 'Sylhet', 'অন্যান্য (Other)'
];

const COMMON_TYPES: RestaurantType[] = [
  'Kacchi / Biryani',
  'Dine-in / Traditional',
  'Cafe & Bistro',
  'Fast Food / Burger',
  'Chinese & Thai',
  'Fine Dining',
  'Bakery & Sweets',
  'Office Canteen',
  'Other'
];

const COMMON_BRANDS = [
  'Mum (মুম)',
  'Kinley (কিনলে)',
  'Pran (প্রাণ)',
  'Spa (স্পা)',
  'Fresh (ফ্রেশ)',
  'Aquafina (একুয়াফিনা)',
  'স্থানীয় / অন্যান্য'
];

export const RestaurantFormModal: React.FC<RestaurantFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSave,
}) => {
  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [area, setArea] = useState('Dhanmondi');
  const [customArea, setCustomArea] = useState('');
  const [restaurantType, setRestaurantType] = useState<RestaurantType>('Dine-in / Traditional');
  const [branches, setBranches] = useState('১টি');

  // Demand State
  const [approxDailyCustomers, setApproxDailyCustomers] = useState<number | ''>(250);
  const [currentWaterBrand, setCurrentWaterBrand] = useState('Mum (মুম)');
  const [bottleSize, setBottleSize] = useState<BottleSize>('500ml');
  const [dailyBottleUsage, setDailyBottleUsage] = useState<number | ''>(150);
  const [currentPurchasePrice, setCurrentPurchasePrice] = useState<number | ''>(12.0);

  // Interest State
  const [interested, setInterested] = useState<InterestStatus>('হ্যাঁ');
  const [preferredBottleSize, setPreferredBottleSize] = useState<BottleSize>('500ml');
  const [expectedPrice, setExpectedPrice] = useState<number | ''>(10.5);
  const [expectedMonthlyQuantity, setExpectedMonthlyQuantity] = useState<number | ''>(4500);
  const [deliveryPreference, setDeliveryPreference] = useState('দৈনিক');

  // Contact & Advanced State (Collapsible)
  const [showContactSection, setShowContactSection] = useState(true);
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setLocation(initialData.location || '');
      if (COMMON_AREAS.includes(initialData.area)) {
        setArea(initialData.area);
        setCustomArea('');
      } else {
        setArea('অন্যান্য (Other)');
        setCustomArea(initialData.area || '');
      }
      setRestaurantType((initialData.restaurantType as RestaurantType) || 'Dine-in / Traditional');
      setBranches(initialData.branches || '১টি');
      setApproxDailyCustomers(initialData.approxDailyCustomers ?? '');
      setCurrentWaterBrand(initialData.currentWaterBrand || 'Mum (মুম)');
      setBottleSize(initialData.bottleSize || '500ml');
      setDailyBottleUsage(initialData.dailyBottleUsage ?? '');
      setCurrentPurchasePrice(initialData.currentPurchasePrice ?? '');
      setInterested(initialData.interested || 'হ্যাঁ');
      setPreferredBottleSize(initialData.preferredBottleSize || '500ml');
      setExpectedPrice(initialData.expectedPrice ?? '');
      setExpectedMonthlyQuantity(initialData.expectedMonthlyQuantity ?? '');
      setDeliveryPreference(initialData.deliveryPreference || 'দৈনিক');
      setContactPerson(initialData.contactPerson || '');
      setPhone(initialData.phone || '');
      setNotes(initialData.notes || '');
    } else {
      // Defaults for brand new record
      setName('');
      setLocation('');
      setArea('Dhanmondi');
      setCustomArea('');
      setRestaurantType('Dine-in / Traditional');
      setBranches('১টি');
      setApproxDailyCustomers(250);
      setCurrentWaterBrand('Mum (মুম)');
      setBottleSize('500ml');
      setDailyBottleUsage(150);
      setCurrentPurchasePrice(12.0);
      setInterested('হ্যাঁ');
      setPreferredBottleSize('500ml');
      setExpectedPrice(10.5);
      setExpectedMonthlyQuantity(4500);
      setDeliveryPreference('দৈনিক');
      setContactPerson('');
      setPhone('');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  // Auto calculate monthly qty when daily bottle usage changes
  const handleDailyUsageChange = (val: number) => {
    setDailyBottleUsage(val);
    if (!expectedMonthlyQuantity || expectedMonthlyQuantity === 0) {
      setExpectedMonthlyQuantity(val * 30);
    }
  };

  const handleSave = () => {
    const errs: { [key: string]: string } = {};
    if (!name.trim()) errs.name = 'রেস্টুরেন্টের নাম আবশ্যক';
    if (!location.trim()) errs.location = 'লোকেশন বা ঠিকানা লিখুন';
    if (area === 'অন্যান্য (Other)' && !customArea.trim()) {
      errs.area = 'এলাকার নাম লিখুন';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const finalArea = area === 'অন্যান্য (Other)' ? customArea.trim() : area;

    const record: Restaurant = {
      id: initialData ? initialData.id : `rest-${Date.now()}`,
      createdAt: initialData ? initialData.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      name: name.trim(),
      location: location.trim(),
      area: finalArea,
      restaurantType,
      branches,
      approxDailyCustomers: Number(approxDailyCustomers) || 0,
      currentWaterBrand,
      bottleSize,
      dailyBottleUsage: Number(dailyBottleUsage) || 0,
      currentPurchasePrice: Number(currentPurchasePrice) || 0,
      interested,
      preferredBottleSize,
      expectedPrice: (interested === 'হ্যাঁ' || interested === 'সম্ভবত') ? Number(expectedPrice) || 0 : undefined,
      expectedMonthlyQuantity: (interested === 'হ্যাঁ' || interested === 'সম্ভবত') ? Number(expectedMonthlyQuantity) || 0 : undefined,
      deliveryPreference: (interested === 'হ্যাঁ' || interested === 'সম্ভবত') ? deliveryPreference : undefined,
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
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
          <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center">
            <Store className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-none">
              {initialData ? 'রেস্টুরেন্ট তথ্য এডিট' : 'দ্রুত রেস্টুরেন্ট ডাটা এন্ট্রি'}
            </h2>
            <p className="text-[11px] text-stone-500 font-medium mt-0.5">
              ১–২ মিনিটের ফিল্ড রিসার্চ ফরম
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

      {/* 2. SCROLLABLE FORM BODY (Single column, thumb friendly) */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-28">
        {/* SECTION 1: BASIC INFORMATION */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              মৌলিক তথ্য (Basic Information)
            </h3>
            <span className="text-[10px] text-stone-500 font-medium">১ম ধাপ</span>
          </div>

          {/* Restaurant Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              রেস্টুরেন্টের নাম <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="যেমন: ক্যাফে ধানমন্ডি, বিরিয়ানি হাউজ..."
              className={`touch-target w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
              }`}
            />
            {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
          </div>

          {/* Area & Location */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                এলাকা (Area)
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                {COMMON_AREAS.map(a => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                রেস্টুরেন্ট টাইপ
              </label>
              <select
                value={restaurantType}
                onChange={(e) => setRestaurantType(e.target.value as RestaurantType)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                {COMMON_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {area === 'অন্যান্য (Other)' && (
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                অন্যান্য এলাকার নাম লিখুন
              </label>
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="এলাকা লিখুন..."
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm"
              />
            </div>
          )}

          {/* Specific Location / Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              ঠিকানা বা ল্যান্ডমার্ক <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="রোড / ব্লক / মোড় (যেমন: রোড ২৭, রবীন্দ্র সরোবরের কাছে)"
              className={`touch-target w-full rounded-xl bg-white border px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 ${
                errors.location ? 'border-rose-400 bg-rose-50/20' : 'border-stone-200'
              }`}
            />
            {errors.location && <p className="text-[11px] text-rose-500 mt-1">{errors.location}</p>}
          </div>

          {/* Branches Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              শাখা সংখ্যা (Branches)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['১টি', '২-৩টি', '৪+টি'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBranches(b)}
                  className={`touch-target py-2 rounded-xl text-xs font-semibold transition ${
                    branches === b
                      ? 'bg-cyan-700 text-white shadow-xs'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: DEMAND & CURRENT WATER DATA */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              চাহিদা ও বর্তমান অবস্থা (Demand)
            </h3>
            <span className="text-[10px] text-stone-500 font-medium">২য় ধাপ</span>
          </div>

          {/* Daily Customers */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-800">
                দৈনিক আনুমানিক কাস্টমার (Daily Customers)
              </label>
              <div className="flex gap-1">
                {[150, 300, 600].map(cnt => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => setApproxDailyCustomers(cnt)}
                    className="text-[10px] font-medium bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 hover:bg-stone-200"
                  >
                    +{cnt}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              inputMode="numeric"
              value={approxDailyCustomers}
              onChange={(e) => setApproxDailyCustomers(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="যেমন: ৩০০"
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 font-medium"
            />
          </div>

          {/* Current Water Brand & Bottle Size */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                বর্তমান ব্র্যান্ড
              </label>
              <select
                value={currentWaterBrand}
                onChange={(e) => setCurrentWaterBrand(e.target.value)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-2.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              >
                {COMMON_BRANDS.map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                বোতলের সাইজ
              </label>
              <select
                value={bottleSize}
                onChange={(e) => setBottleSize(e.target.value as BottleSize)}
                className="touch-target w-full rounded-xl bg-white border border-stone-200 px-2.5 py-2.5 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 font-medium"
              >
                <option value="250ml">250ml</option>
                <option value="330ml">330ml</option>
                <option value="500ml">500ml</option>
                <option value="1000ml">1000ml</option>
              </select>
            </div>
          </div>

          {/* Daily Bottle Usage */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-stone-800">
                দৈনিক বোতল বিক্রি / ব্যবহার (বোতল)
              </label>
              <div className="flex gap-1">
                {[100, 200, 400].map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleDailyUsageChange(u)}
                    className="text-[10px] font-medium bg-stone-100 px-1.5 py-0.5 rounded text-stone-600 hover:bg-stone-200"
                  >
                    +{u}
                  </button>
                ))}
              </div>
            </div>
            <input
              type="number"
              inputMode="numeric"
              value={dailyBottleUsage}
              onChange={(e) => handleDailyUsageChange(e.target.value === '' ? 0 : Number(e.target.value))}
              placeholder="যেমন: ১৫০"
              className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 font-bold"
            />
          </div>

          {/* Current Purchase Price */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              বর্তমান ক্রয়ের দর (৳ / বোতল)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm">৳</span>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={currentPurchasePrice}
                onChange={(e) => setCurrentPurchasePrice(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="যেমন: ১২.০০"
                className="touch-target w-full rounded-xl bg-white border border-stone-200 pl-8 pr-3.5 py-2.5 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 font-semibold"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: BUSINESS INTEREST (Primary Feasibility Factor) */}
        <div className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-stone-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              ব্যবসার আগ্রহ (Business Interest)
            </h3>
            <span className="text-[10px] text-stone-500 font-medium">৩য় ধাপ</span>
          </div>

          {/* Segmented Big Buttons: হ্যাঁ / সম্ভবত / না */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              আমাদের ব্র্যান্ড / কাস্টম বোতল নিতে আগ্রহী কি?
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setInterested('হ্যাঁ')}
                className={`touch-target py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  interested === 'হ্যাঁ'
                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>🟢 হ্যাঁ (Yes)</span>
              </button>

              <button
                type="button"
                onClick={() => setInterested('সম্ভবত')}
                className={`touch-target py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  interested === 'সম্ভবত'
                    ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-600/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>🟡 সম্ভবত</span>
              </button>

              <button
                type="button"
                onClick={() => setInterested('না')}
                className={`touch-target py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 ${
                  interested === 'না'
                    ? 'bg-stone-800 text-white shadow-sm ring-2 ring-stone-800/30'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                }`}
              >
                <span>🔴 না (No)</span>
              </button>
            </div>
          </div>

          {/* If হ্যাঁ or সম্ভবত -> show extended demand fields */}
          {(interested === 'হ্যাঁ' || interested === 'সম্ভবত') && (
            <div className="space-y-3 pt-2 border-t border-stone-100 animate-in fade-in">
              {/* Preferred Size */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  পছন্দের বোতল সাইজ
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['250ml', '330ml', '500ml', '1000ml'] as BottleSize[]).map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setPreferredBottleSize(sz)}
                      className={`touch-target py-2 rounded-xl text-xs font-semibold transition ${
                        preferredBottleSize === sz
                          ? 'bg-cyan-700 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Expected Price & Monthly Quantity */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    প্রত্যাশিত দর (৳)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={expectedPrice}
                    onChange={(e) => setExpectedPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="১০.৫০"
                    className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 font-semibold focus:ring-2 focus:ring-cyan-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    মাসিক চাহিদা (বোতল)
                  </label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={expectedMonthlyQuantity}
                    onChange={(e) => setExpectedMonthlyQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="৪৫০০"
                    className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm text-stone-900 font-bold focus:ring-2 focus:ring-cyan-600"
                  />
                </div>
              </div>

              {/* Delivery Preference */}
              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ডেলিভারির পছন্দ
                </label>
                <select
                  value={deliveryPreference}
                  onChange={(e) => setDeliveryPreference(e.target.value)}
                  className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-xs text-stone-900 font-medium"
                >
                  <option value="দৈনিক">দৈনিক (Daily morning)</option>
                  <option value="সপ্তাহে ৩ দিন">সপ্তাহে ৩ দিন (Alternate days)</option>
                  <option value="সাপ্তাহিক">সাপ্তাহিক (Weekly bulk)</option>
                  <option value="অন-কল / প্রয়োজন অনুসারে">অন-কল / প্রয়োজন অনুসারে</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: CONTACT & NOTES (Collapsible for quick 1-min speed) */}
        <div className="liquid-glass-card rounded-2xl border border-stone-200/90 overflow-hidden">
          <button
            type="button"
            onClick={() => setShowContactSection(!showContactSection)}
            className="w-full p-4 flex items-center justify-between text-left touch-target hover:bg-stone-50/50"
          >
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-700 inline-block" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
                যোগাযোগ ও ফিল্ড নোট (Contact & Notes)
              </h3>
            </div>
            {showContactSection ? <ChevronUp className="w-4 h-4 text-stone-500" /> : <ChevronDown className="w-4 h-4 text-stone-500" />}
          </button>

          {showContactSection && (
            <div className="p-4 pt-0 space-y-3 animate-in fade-in">
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    দায়িত্বপ্রাপ্ত ব্যক্তি
                  </label>
                  <input
                    type="text"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="মালিক / ম্যানেজার"
                    className="touch-target w-full rounded-xl bg-white border border-stone-200 px-3 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    ফোন নম্বর (Phone)
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

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  ফিল্ড ভিজিট নোট ও পর্যবেক্ষণ
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="যেমন: নিজস্ব লোগোর বোতল প্রিফার করে, ক্রেডিট লাগবে ১৫ দিন..."
                  className="w-full rounded-xl bg-white border border-stone-200 p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-cyan-600 resize-none"
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
        saveLabel={initialData ? 'আপডেট করুন (Save)' : 'ডাটা সংরক্ষণ করুন (Save)'}
        cancelLabel="বাতিল"
      />
    </div>
  );
};
