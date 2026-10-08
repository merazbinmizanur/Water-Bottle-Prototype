import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  Phone, 
  MapPin, 
  Droplet, 
  Calendar, 
  Edit3, 
  Trash2, 
  Filter, 
  TrendingUp, 
  ChevronRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Restaurant, InterestStatus } from '../../types';
import { toBengaliNumber, formatBDT } from '../../utils/calculations';

interface RestaurantListViewProps {
  restaurants: Restaurant[];
  onOpenCreate: () => void;
  onEdit: (restaurant: Restaurant) => void;
  onDeleteRequest: (restaurant: Restaurant) => void;
}

export const RestaurantListView: React.FC<RestaurantListViewProps> = ({
  restaurants,
  onOpenCreate,
  onEdit,
  onDeleteRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | InterestStatus>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'usage' | 'price'>('recent');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter & Search logic
  const filteredRestaurants = useMemo(() => {
    let result = [...restaurants];

    // Search query filter (name, location, area, current brand)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.area.toLowerCase().includes(q) ||
        r.currentWaterBrand.toLowerCase().includes(q) ||
        r.contactPerson.toLowerCase().includes(q)
      );
    }

    // Status filter
    if (selectedFilter !== 'all') {
      result = result.filter(r => r.interested === selectedFilter);
    }

    // Sort
    if (sortBy === 'usage') {
      result.sort((a, b) => (b.dailyBottleUsage || 0) - (a.dailyBottleUsage || 0));
    } else if (sortBy === 'price') {
      result.sort((a, b) => (b.expectedPrice || b.currentPurchasePrice || 0) - (a.expectedPrice || a.currentPurchasePrice || 0));
    } else {
      // Recent first
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return result;
  }, [restaurants, searchQuery, selectedFilter, sortBy]);

  return (
    <div className="space-y-3 pb-24">
      {/* 1. TOP MOBILE SEARCH BAR */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="রেস্টুরেন্টের নাম, এলাকা বা ব্র্যান্ড দিয়ে খুঁজুন..."
            className="touch-target w-full rounded-2xl bg-white/90 border border-stone-200/90 pl-10 pr-4 py-2.5 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-cyan-600 focus:border-cyan-600 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs px-1"
            >
              মুছুন
            </button>
          )}
        </div>

        {/* 2. FILTER & SORT SEGMENTED BUTTONS (Thumb friendly) */}
        <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-1.5 p-1 bg-stone-200/60 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setSelectedFilter('all')}
              className={`touch-target px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              সব ({toBengaliNumber(restaurants.length)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('হ্যাঁ')}
              className={`touch-target px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedFilter === 'হ্যাঁ'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🟢 আগ্রহী ({toBengaliNumber(restaurants.filter(r => r.interested === 'হ্যাঁ').length)})
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('সম্ভবত')}
              className={`touch-target px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedFilter === 'সম্ভবত'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🟡 সম্ভবত
            </button>
            <button
              type="button"
              onClick={() => setSelectedFilter('না')}
              className={`touch-target px-3 py-1 text-xs font-semibold rounded-lg transition ${
                selectedFilter === 'না'
                  ? 'bg-stone-700 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              🔴 না
            </button>
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="touch-target bg-white/90 border border-stone-200 text-xs rounded-xl px-2.5 py-1.5 text-stone-700 font-medium shrink-0 focus:outline-none"
            aria-label="Sort by"
          >
            <option value="recent">সর্বশেষ ভিজিট</option>
            <option value="usage">সর্বোচ্চ ব্যবহার</option>
            <option value="price">প্রত্যাশিত দর</option>
          </select>
        </div>
      </div>

      {/* 3. LIST OF STACKED MOBILE CARDS (Requirement 11) */}
      {filteredRestaurants.length === 0 ? (
        <div className="liquid-glass-card rounded-3xl p-8 text-center space-y-3 my-6 border border-dashed border-stone-300">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center mx-auto">
            <Droplet className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-stone-900">
            কোনো রেস্টুরেন্ট রেকর্ড পাওয়া যায়নি
          </h4>
          <p className="text-xs text-stone-500 max-w-xs mx-auto">
            {searchQuery
              ? 'অনুসন্ধানের সাথে কোনো মিল নেই। অন্য কী-ওয়ার্ড দিয়ে খুঁজুন।'
              : 'এখনই আপনার প্রথম রেস্টুরেন্ট ভিজিটের তথ্য যুক্ত করুন।'}
          </p>
          <button
            type="button"
            onClick={onOpenCreate}
            className="touch-target px-5 py-2.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-sm hover:bg-cyan-800 transition active:scale-[0.98] inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            + নতুন রেস্টুরেন্ট তথ্য যোগ করুন
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRestaurants.map((restaurant) => {
            const isExpanded = expandedId === restaurant.id;

            return (
              <div
                key={restaurant.id}
                className="liquid-glass-card rounded-2xl p-4 border border-stone-200/90 shadow-xs hover:border-cyan-200/80 transition-all space-y-3"
              >
                {/* Header Row: Name & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-base font-bold text-stone-900 leading-snug truncate">
                      {restaurant.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-cyan-700" />
                      <span className="font-medium text-stone-700">{restaurant.area}</span>
                      <span>·</span>
                      <span className="truncate">{restaurant.location}</span>
                    </div>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold shrink-0 ${
                      restaurant.interested === 'হ্যাঁ'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : restaurant.interested === 'সম্ভবত'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    {restaurant.interested === 'হ্যাঁ'
                      ? '🟢 আগ্রহী'
                      : restaurant.interested === 'সম্ভবত'
                      ? '🟡 সম্ভবত'
                      : '🔴 আগ্রহী নয়'}
                  </span>
                </div>

                {/* Key Demand & Usage Row */}
                <div className="grid grid-cols-3 gap-2 bg-stone-50/90 p-2.5 rounded-xl border border-stone-100 text-center">
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">দৈনিক কাস্টমার</span>
                    <span className="text-xs font-bold text-stone-800">
                      {toBengaliNumber(restaurant.approxDailyCustomers)} জন
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">বর্তমান ব্যবহার</span>
                    <span className="text-xs font-bold text-stone-800">
                      {toBengaliNumber(restaurant.dailyBottleUsage)} বোতল
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block leading-tight">বর্তমান দর</span>
                    <span className="text-xs font-bold text-stone-800">
                      {formatBDT(restaurant.currentPurchasePrice, true)}
                    </span>
                  </div>
                </div>

                {/* Second Metadata Line */}
                <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                  <span>
                    ব্র্যান্ড: <strong className="text-stone-800">{restaurant.currentWaterBrand}</strong> ({restaurant.bottleSize})
                  </span>

                  {restaurant.expectedPrice && (
                    <span className="text-cyan-800 font-semibold">
                      প্রত্যাশিত দর: {formatBDT(restaurant.expectedPrice, true)}
                    </span>
                  )}
                </div>

                {/* Expandable Details for one-handed toggle */}
                {isExpanded && (
                  <div className="pt-2 border-t border-stone-100 space-y-2 text-xs text-stone-600 animate-in fade-in">
                    {restaurant.expectedMonthlyQuantity && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">সম্ভাব্য মাসিক পরিমাণ:</span>
                        <span className="font-semibold text-stone-800">
                          {toBengaliNumber(restaurant.expectedMonthlyQuantity)} বোতল / মাস
                        </span>
                      </div>
                    )}

                    {restaurant.deliveryPreference && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">ডেলিভারি পছন্দ:</span>
                        <span className="font-medium text-stone-800">{restaurant.deliveryPreference}</span>
                      </div>
                    )}

                    {restaurant.restaurantType && (
                      <div className="flex justify-between">
                        <span className="text-stone-500">রেস্টুরেন্ট টাইপ ও শাখা:</span>
                        <span className="font-medium text-stone-800">{restaurant.restaurantType} ({restaurant.branches})</span>
                      </div>
                    )}

                    {restaurant.contactPerson && (
                      <div className="flex justify-between items-center bg-cyan-50/70 p-2 rounded-lg border border-cyan-100">
                        <div>
                          <span className="text-[11px] text-stone-500 block">যোগাযোগ ব্যক্তি</span>
                          <span className="font-bold text-cyan-950">{restaurant.contactPerson}</span>
                        </div>
                        {restaurant.phone && (
                          <a
                            href={`tel:${restaurant.phone}`}
                            className="touch-target px-3 py-1.5 rounded-lg bg-cyan-700 text-white font-medium flex items-center gap-1 hover:bg-cyan-800 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>কল করুন ({restaurant.phone})</span>
                          </a>
                        )}
                      </div>
                    )}

                    {restaurant.notes && (
                      <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                        <span className="text-[11px] font-semibold text-stone-500 block mb-0.5">ফিল্ড নোট ও পর্যবেক্ষণ:</span>
                        <p className="text-stone-700 italic">{restaurant.notes}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons Row */}
                <div className="flex items-center justify-between pt-1 gap-2">
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : restaurant.id)}
                    className="touch-target text-xs text-stone-600 font-medium px-2 py-1 rounded-lg hover:bg-stone-100 transition flex items-center gap-1"
                  >
                    <span>{isExpanded ? 'সংক্ষিপ্ত করুন' : 'বিস্তারিত দেখুন'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>

                  <div className="flex items-center gap-1.5">
                    {restaurant.phone && !isExpanded && (
                      <a
                        href={`tel:${restaurant.phone}`}
                        className="touch-target w-9 h-9 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-cyan-700 hover:bg-cyan-50 transition"
                        title="Call"
                      >
                        <Phone className="w-4 h-4" />
                      </a>
                    )}

                    <button
                      type="button"
                      onClick={() => onEdit(restaurant)}
                      className="touch-target px-3 py-1.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 flex items-center gap-1 transition shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                      <span>এডিট</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteRequest(restaurant)}
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
