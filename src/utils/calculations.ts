import { Restaurant, Factory, FeasibilityMetrics } from '../types';

export function calculateFeasibilityMetrics(
  restaurants: Restaurant[],
  factories: Factory[],
  fixedMonthlyOverhead: number = 30000
): FeasibilityMetrics {
  const totalRestaurants = restaurants.length;
  const interestedRestaurants = restaurants.filter(r => r.interested === 'হ্যাঁ').length;
  const maybeRestaurants = restaurants.filter(r => r.interested === 'সম্ভবত').length;
  const notInterestedRestaurants = restaurants.filter(r => r.interested === 'না').length;

  const interestRate = totalRestaurants > 0
    ? Math.round(((interestedRestaurants + maybeRestaurants * 0.5) / totalRestaurants) * 100)
    : 0;

  // Monthly Bottle Demand Calculation:
  // From "হ্যাঁ": 100% of expectedMonthlyQuantity or (dailyBottleUsage * 30)
  // From "সম্ভবত": 50% probability weighting
  let totalMonthlyBottleDemand = 0;
  let dailyTotalBottleDemand = 0;

  restaurants.forEach(r => {
    const monthlyAmt = r.expectedMonthlyQuantity && r.expectedMonthlyQuantity > 0
      ? r.expectedMonthlyQuantity
      : (r.dailyBottleUsage || 0) * 30;

    dailyTotalBottleDemand += (r.dailyBottleUsage || 0);

    if (r.interested === 'হ্যাঁ') {
      totalMonthlyBottleDemand += monthlyAmt;
    } else if (r.interested === 'সম্ভবত') {
      totalMonthlyBottleDemand += Math.round(monthlyAmt * 0.5);
    }
  });

  // Factory Cost Analysis:
  const totalFactories = factories.length;
  let avgFactoryUnitCost = 0;
  let minFactoryUnitCost = 0;
  let bestFactoryName = '';

  if (factories.length > 0) {
    const sortedByCost = [...factories].sort((a, b) => a.unitCost - b.unitCost);
    minFactoryUnitCost = sortedByCost[0].unitCost;
    bestFactoryName = sortedByCost[0].name;
    const totalUnitCosts = factories.reduce((acc, f) => acc + f.unitCost, 0);
    avgFactoryUnitCost = Number((totalUnitCosts / factories.length).toFixed(2));
  } else {
    // Benchmark default if no factories researched yet
    minFactoryUnitCost = 6.50;
    avgFactoryUnitCost = 6.80;
    bestFactoryName = 'শিল্প গড় অনুমান';
  }

  // Restaurant Selling Price Analysis:
  // Expected price willing to pay by interested/maybe, or benchmark (currentPurchasePrice - 1.00)
  const interestedWithPrice = restaurants.filter(
    r => (r.interested === 'হ্যাঁ' || r.interested === 'সম্ভবত') && r.expectedPrice && r.expectedPrice > 0
  );

  let avgExpectedSellingPrice = 0;
  if (interestedWithPrice.length > 0) {
    const totalExp = interestedWithPrice.reduce((acc, r) => acc + (r.expectedPrice || 0), 0);
    avgExpectedSellingPrice = Number((totalExp / interestedWithPrice.length).toFixed(2));
  } else if (restaurants.length > 0) {
    const totalCurr = restaurants.reduce((acc, r) => acc + (r.currentPurchasePrice || 11.5), 0);
    avgExpectedSellingPrice = Number((totalCurr / restaurants.length - 0.75).toFixed(2));
  } else {
    avgExpectedSellingPrice = 10.50;
  }

  const allWithCurr = restaurants.filter(r => r.currentPurchasePrice > 0);
  const avgCurrentRestaurantPrice = allWithCurr.length > 0
    ? Number((allWithCurr.reduce((acc, r) => acc + r.currentPurchasePrice, 0) / allWithCurr.length).toFixed(2))
    : 11.50;

  // Profit Metrics per bottle:
  // Base unit cost is best reliable factory cost
  const effectiveCost = minFactoryUnitCost > 0 ? minFactoryUnitCost : 6.50;
  const rawProfitPerBottle = avgExpectedSellingPrice - effectiveCost;
  const profitPerBottle = Number(rawProfitPerBottle.toFixed(2));
  const profitMarginPercent = avgExpectedSellingPrice > 0
    ? Math.round((profitPerBottle / avgExpectedSellingPrice) * 100)
    : 0;

  // Financial Projections:
  const estimatedMonthlyRevenue = Math.round(totalMonthlyBottleDemand * avgExpectedSellingPrice);
  const estimatedMonthlyCost = Math.round(totalMonthlyBottleDemand * effectiveCost);
  const estimatedMonthlyGrossProfit = Math.round(totalMonthlyBottleDemand * profitPerBottle);
  const estimatedMonthlyNetProfit = estimatedMonthlyGrossProfit - fixedMonthlyOverhead;

  // Break-even bottles needed to cover monthly fixed overhead:
  const breakEvenBottles = profitPerBottle > 0
    ? Math.ceil(fixedMonthlyOverhead / profitPerBottle)
    : 0;

  const breakEvenDays = (totalMonthlyBottleDemand > 0 && breakEvenBottles > 0)
    ? Number(((breakEvenBottles / (totalMonthlyBottleDemand / 30))).toFixed(1))
    : 0;

  // Data Confidence Score (out of 100):
  // 50% from restaurant sampling (target: 10 restaurants)
  // 30% from factory sampling (target: 3 factories)
  // 20% from price/demand data completeness
  const restScore = Math.min(50, (totalRestaurants / 10) * 50);
  const factScore = Math.min(30, (totalFactories / 3) * 30);
  const completenessScore = totalRestaurants > 0 && totalFactories > 0 ? 20 : 5;
  const dataConfidencePercent = Math.min(100, Math.round(restScore + factScore + completenessScore));

  // Viability Status Logic:
  let feasibilityStatus: 'profitable' | 'moderate' | 'needs_research' = 'needs_research';
  let statusTextBengali = 'আরও Research দরকার';
  let recommendationBengali = '';

  if (totalRestaurants < 4 || totalFactories < 1) {
    feasibilityStatus = 'needs_research';
    statusTextBengali = '🟡 আরও ফিল্ড ডাটা সংগ্রহ করুন';
    recommendationBengali = `এখনও পর্যাপ্ত ফিল্ড ডাটা নেই (বর্তমান আত্মবিশ্বাস ${dataConfidencePercent}%)। আরও অন্তত ৪-৫টি রেস্টুরেন্ট এবং ১-২টি ফ্যাক্টরি ভিজিট করুন।`;
  } else if (profitPerBottle >= 3.0 && totalMonthlyBottleDemand >= (breakEvenBottles * 1.5)) {
    feasibilityStatus = 'profitable';
    statusTextBengali = '🟢 চমৎকার লাভজনক সম্ভাবনা';
    recommendationBengali = `প্রতি বোতলে আনুমানিক ৳${profitPerBottle} লাভ সম্ভব এবং মাসিক চাহিদা (${totalMonthlyBottleDemand.toLocaleString('bn-BD')} বোতল) ব্রেক-ইভেনের চেয়ে অনেক বেশি। প্রাইভেট লেবেলিং স্যাম্পল তৈরি করে অগ্রিম অর্ডারের চুক্তি শুরু করতে পারেন।`;
  } else if (profitPerBottle >= 1.5 && totalMonthlyBottleDemand >= breakEvenBottles) {
    feasibilityStatus = 'moderate';
    statusTextBengali = '🟡 লাভজনক, তবে সতর্ক পরিকল্পনা দরকার';
    recommendationBengali = `প্রতি বোতলে ৳${profitPerBottle} মার্জিন রয়েছে। ফ্যাক্টরির সাথে MOQ এবং কার্টন খরচে আরও ৫০ পয়সা নেগোসিয়েশন করলে বা আরও ২টি রেস্টুরেন্ট কনভার্ট করলে ঝুঁকি কমে আসবে।`;
  } else {
    feasibilityStatus = 'needs_research';
    statusTextBengali = '🔴 ঝুঁকিপূর্ণ বা অপর্যাপ্ত মার্জিন';
    recommendationBengali = `বর্তমান দাম ও ফ্যাক্টরি খরচে প্রতি বোতলে মার্জিন খুব কম (৳${profitPerBottle}) বা চাহিদা ব্রেক-ইভেন পার করতে পারছে না। আরও সাশ্রয়ী OEM ফ্যাক্টরি খুঁজুন বা প্রিমিয়াম ক্যাফেতে ফোকাস করুন।`;
  }

  return {
    totalRestaurants,
    interestedRestaurants,
    maybeRestaurants,
    notInterestedRestaurants,
    interestRate,
    totalMonthlyBottleDemand,
    dailyTotalBottleDemand,
    totalFactories,
    avgFactoryUnitCost,
    minFactoryUnitCost,
    bestFactoryName,
    avgExpectedSellingPrice,
    avgCurrentRestaurantPrice,
    profitPerBottle,
    profitMarginPercent,
    estimatedMonthlyRevenue,
    estimatedMonthlyCost,
    estimatedMonthlyGrossProfit,
    estimatedMonthlyNetProfit,
    fixedMonthlyOverhead,
    breakEvenBottles,
    breakEvenDays,
    dataConfidencePercent,
    feasibilityStatus,
    statusTextBengali,
    recommendationBengali,
  };
}

// Convert English numbers to Bengali numerals for clean localized displays
export function toBengaliNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null || num === '') return '০';
  const banglaDigits: { [key: string]: string } = {
    '0': '০', '1': '১', '2': '২', '3': '৩', '4': '৪',
    '5': '৫', '6': '৬', '7': '৭', '8': '৮', '9': '৯',
    '.': '.'
  };
  return num.toString().replace(/[0-9]/g, (w) => banglaDigits[w] || w);
}

// Format Currency
export function formatBDT(amount: number, inBengali: boolean = false): string {
  const formatted = amount.toLocaleString('en-US', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  });
  return inBengali ? `৳${toBengaliNumber(formatted)}` : `৳${formatted}`;
}
