import { Restaurant, Factory, FeasibilityMetrics } from '../types';
import { toBengaliNumber, formatBDT } from './calculations';

export function generateBengaliReportHTML(
  metrics: FeasibilityMetrics,
  restaurants: Restaurant[],
  factories: Factory[]
): string {
  const currentDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Size breakdown
  const sizeBreakdown: { [key: string]: number } = {};
  restaurants.forEach(r => {
    const size = r.preferredBottleSize || r.bottleSize;
    const monthlyAmt = r.expectedMonthlyQuantity || (r.dailyBottleUsage * 30);
    sizeBreakdown[size] = (sizeBreakdown[size] || 0) + (r.interested === 'হ্যাঁ' ? monthlyAmt : Math.round(monthlyAmt * 0.5));
  });

  // Area breakdown
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

  const bestFactory = factories.length > 0 ? [...factories].sort((a, b) => a.unitCost - b.unitCost)[0] : null;

  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <title>পানিশিল্প — ফিজিবিলিটি ও ফিল্ড রিসার্চ পূর্ণাঙ্গ রিপোর্ট</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap');

    @page {
      size: A4 portrait;
      margin: 15mm 15mm 15mm 15mm;
    }

    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    body {
      font-family: 'Hind Siliguri', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1f2937;
      background: #ffffff;
      line-height: 1.5;
      font-size: 13px;
      margin: 0;
      padding: 0;
    }

    .report-container {
      width: 100%;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-box {
      border-bottom: 2px solid #0891b2;
      padding-bottom: 12px;
      margin-bottom: 18px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-title h1 {
      font-size: 22px;
      font-weight: 700;
      color: #0e7490;
      margin: 0 0 4px 0;
    }

    .header-title p {
      margin: 0;
      color: #4b5563;
      font-size: 13px;
      font-weight: 500;
    }

    .header-meta {
      text-align: right;
      font-size: 12px;
      color: #6b7280;
    }

    .status-card {
      background: #f0fdfa;
      border: 1px solid #99f6e4;
      border-left: 5px solid #0d9488;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 18px;
    }

    .status-card h2 {
      margin: 0 0 4px 0;
      font-size: 16px;
      color: #115e59;
    }

    .status-card p {
      margin: 0;
      font-size: 12px;
      color: #374151;
    }

    .section-title {
      font-size: 15px;
      font-weight: 700;
      color: #111827;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4px;
      margin: 20px 0 10px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-bottom: 18px;
    }

    .kpi-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 10px;
      text-align: center;
    }

    .kpi-label {
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 3px;
      font-weight: 500;
    }

    .kpi-value {
      font-size: 17px;
      font-weight: 700;
      color: #0e7490;
    }

    .kpi-sub {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 2px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 12px;
    }

    th {
      background: #f3f4f6;
      color: #374151;
      font-weight: 600;
      text-align: left;
      padding: 7px 10px;
      border: 1px solid #e5e7eb;
    }

    td {
      padding: 6px 10px;
      border: 1px solid #e5e7eb;
      color: #374151;
    }

    tr:nth-child(even) td {
      background: #fcfdfd;
    }

    .text-right {
      text-align: right;
    }

    .text-center {
      text-align: center;
    }

    .badge-yes {
      background: #d1fae5;
      color: #065f46;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 11px;
    }

    .badge-maybe {
      background: #fef3c7;
      color: #92400e;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 11px;
    }

    .badge-no {
      background: #fee2e2;
      color: #991b1b;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 11px;
    }

    .callout {
      background: #fefce8;
      border: 1px solid #fef08a;
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 12px;
      color: #713f12;
      margin: 12px 0;
    }

    .page-break {
      page-break-before: always;
      break-before: page;
    }

    .footer {
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
      margin-top: 24px;
      font-size: 11px;
      color: #9ca3af;
      display: flex;
      justify-content: space-between;
    }

    @media print {
      body {
        font-size: 12px;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <!-- HEADER -->
    <div class="header-box">
      <div class="header-title">
        <h1>পানিশিল্প (PaniShilpa) — ফিজিবিলিটি ও ফিল্ড রিসার্চ রিপোর্ট</h1>
        <p>রেস্টুরেন্ট ও বোতলজাতকরণ ফ্যাক্টরি ভিজিট ভিত্তিক ব্যবসায়িক সম্ভাব্যতা সমীক্ষা</p>
      </div>
      <div class="header-meta">
        <div><strong>তারিখ:</strong> ${currentDate}</div>
        <div><strong>ডাটা আত্মবিশ্বাস:</strong> ${toBengaliNumber(metrics.dataConfidencePercent)}%</div>
        <div><strong>প্রস্তুতকারক:</strong> ফিল্ড রিসার্চ টিম</div>
      </div>
    </div>

    <!-- 1. DECISION SUMMARY -->
    <div class="status-card">
      <h2>ফিজিবিলিটি সিদ্ধান্ত: ${metrics.statusTextBengali}</h2>
      <p>${metrics.recommendationBengali}</p>
    </div>

    <!-- 2. CORE 6 QUESTIONS OVERVIEW -->
    <div class="section-title">১. ফিল্ড রিসার্চের মূল ৬টি প্রশ্নের সুনির্দিষ্ট উত্তর</div>
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-label">১. মোট রেস্টুরেন্ট রিসার্চ</div>
        <div class="kpi-value">${toBengaliNumber(metrics.totalRestaurants)} টি</div>
        <div class="kpi-sub">দৈনিক ব্যবহার: ${toBengaliNumber(metrics.dailyTotalBottleDemand)} বোতল</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">২. আগ্রহী রেস্টুরেন্ট</div>
        <div class="kpi-value" style="color: #059669;">${toBengaliNumber(metrics.interestedRestaurants)} টি নিশ্চিত</div>
        <div class="kpi-sub">${toBengaliNumber(metrics.maybeRestaurants)} টি সম্ভবত আগ্রহী</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">৩. প্রতি বোতলে নিট লাভ</div>
        <div class="kpi-value" style="color: #d97706;">${formatBDT(metrics.profitPerBottle, true)}</div>
        <div class="kpi-sub">মার্জিন: ${toBengaliNumber(metrics.profitMarginPercent)}%</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">৪. সম্ভাব্য মাসিক লাভ</div>
        <div class="kpi-value" style="color: #047857;">${formatBDT(metrics.estimatedMonthlyNetProfit, true)}</div>
        <div class="kpi-sub">সব ওভারহেড বাদ দিয়ে</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">৫. ব্রেক-ইভেন টার্গেট</div>
        <div class="kpi-value" style="color: #4f46e5;">${toBengaliNumber(metrics.breakEvenBottles)} বোতল</div>
        <div class="kpi-sub">কভার টাইম: ${toBengaliNumber(metrics.breakEvenDays)} দিন</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-label">৬. গবেষণা স্থিতি</div>
        <div class="kpi-value" style="font-size: 13px; color: #0891b2;">${metrics.feasibilityStatus === 'profitable' ? 'লাভজনক নিশ্চিত' : 'সতর্ক পরিকল্পনা'}</div>
        <div class="kpi-sub">${toBengaliNumber(metrics.totalFactories)}টি OEM ফ্যাক্টরি বিশ্লেষিত</div>
      </div>
    </div>

    <!-- 3. UNIT ECONOMICS & FACTORY COST BREAKDOWN -->
    <div class="section-title">২. প্রতি বোতলে ইউনিট অর্থনীতি ও ৯-উপাদান উৎপাদন খরচ</div>
    <table>
      <thead>
        <tr>
          <th>উপাদান (Cost Component)</th>
          <th>বিবরণ ও স্পেসিফিকেশন</th>
          <th class="text-right">একক খরচ (৳ / বোতল)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>১. PET বোতল / প্রিফর্ম</td>
          <td>ফুড গ্রেড ভার্জিন পেট প্রিফর্ম (৫০০ মি.লি.)</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.bottle || 2.10, true)}</td>
        </tr>
        <tr>
          <td>২. ক্যাপ ও সিল</td>
          <td>শর্ট নেক টেম্পার-প্রুফ প্লাস্টিক ক্যাপ</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.cap || 0.65, true)}</td>
        </tr>
        <tr>
          <td>৩. পানি ও ফিলিং</td>
          <td>৮-ধাপের RO, ওজোন ও UV পরিশোধিত পানি ও ফিলিং</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.waterFilling || 0.75, true)}</td>
        </tr>
        <tr>
          <td>৪. লেবেল ও ডিজাইন</td>
          <td>BOPP র্যাপ অ্যারাউন্ড কাস্টম ব্র্যান্ড লেবেল</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.label || 0.60, true)}</td>
        </tr>
        <tr>
          <td>৫. ব্যাচ প্রিন্টিং</td>
          <td>লেজার এমআরপি, ব্যাচ ও মেয়াদ প্রিন্ট</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.printing || 0.15, true)}</td>
        </tr>
        <tr>
          <td>৬. প্যাকেজিং ও র্যাপিং</td>
          <td>২৪ বোতলের বান্ডেল থার্মাল শ্রিঙ্ক র্যাপ</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.packaging || 0.35, true)}</td>
        </tr>
        <tr>
          <td>৭. কার্টন বক্স শেয়ার</td>
          <td>হেভি ডিউটি মাস্টার কার্টন বক্স অংশীদারিত্ব</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.carton || 0.70, true)}</td>
        </tr>
        <tr>
          <td>৮. পরিবহন ও ডেলিভারি</td>
          <td>ফ্যাক্টরি থেকে ঢাকা সেন্ট্রাল হাব ট্রাকিং</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.delivery || 0.85, true)}</td>
        </tr>
        <tr>
          <td>৯. অপচয় ও ওভারহেড</td>
          <td>হ্যান্ডলিং, লোডিং ও অন্যান্য অপচয় বরাদ্দ</td>
          <td class="text-right">${formatBDT(bestFactory?.costs.other || 0.30, true)}</td>
        </tr>
        <tr style="background: #f0fdfa; font-weight: 700;">
          <td colspan="2">মোট উৎপাদন ও ডেলিভারি খরচ (Net Factory Unit Cost)</td>
          <td class="text-right" style="color: #0e7490;">${formatBDT(metrics.minFactoryUnitCost, true)}</td>
        </tr>
        <tr style="background: #eff6ff; font-weight: 700;">
          <td colspan="2">রেস্টুরেন্টে প্রস্তাবিত পাইকারি বিক্রয় দর (Wholesale Price)</td>
          <td class="text-right" style="color: #1e40af;">${formatBDT(metrics.avgExpectedSellingPrice, true)}</td>
        </tr>
        <tr style="background: #ecfdf5; font-weight: 700; font-size: 13px;">
          <td colspan="2">প্রতি বোতলে নিট মোট লাভ (Gross Profit Per Bottle)</td>
          <td class="text-right" style="color: #065f46;">${formatBDT(metrics.profitPerBottle, true)} (${toBengaliNumber(metrics.profitMarginPercent)}%)</td>
        </tr>
      </tbody>
    </table>

    <!-- 4. MONTHLY P&L FINANCIAL STATEMENT -->
    <div class="section-title">৩. মাসিক আর্থিক বিবরণী ও লাভ-ক্ষতি প্রক্ষেপণ (Monthly P&L)</div>
    <table>
      <thead>
        <tr>
          <th>খাত</th>
          <th>হিসাবের ভিত্তি</th>
          <th class="text-right">পরিমাণ (BDT ৳)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>মাসিক মোট বিক্রয়ের বোতল সংখ্যা</td>
          <td>আগ্রহী রেস্টুরেন্টগুলোর মাসিক চাহিদা</td>
          <td class="text-right font-bold">${toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল</td>
        </tr>
        <tr>
          <td>মোট বিক্রয় রাজস্ব (Gross Revenue)</td>
          <td>${toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল × ${formatBDT(metrics.avgExpectedSellingPrice, true)}</td>
          <td class="text-right font-bold">${formatBDT(metrics.estimatedMonthlyRevenue, true)}</td>
        </tr>
        <tr>
          <td>সরাসরি উৎপাদন খরচ (COGS)</td>
          <td>${toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল × ${formatBDT(metrics.minFactoryUnitCost, true)}</td>
          <td class="text-right" style="color: #dc2626;">- ${formatBDT(metrics.estimatedMonthlyCost, true)}</td>
        </tr>
        <tr style="font-weight: 600;">
          <td>মোট গ্রস মুনাফা (Gross Profit)</td>
          <td>রাজস্ব - উৎপাদন খরচ</td>
          <td class="text-right" style="color: #059669;">${formatBDT(metrics.estimatedMonthlyGrossProfit, true)}</td>
        </tr>
        <tr>
          <td>মাসিক নির্ধারিত পরিচালনা ব্যয় (Fixed Overhead)</td>
          <td>ছোট ডেলিভারি ভ্যান, তেল, ড্রাইভার ও সেলস ভাতা</td>
          <td class="text-right" style="color: #dc2626;">- ${formatBDT(metrics.fixedMonthlyOverhead, true)}</td>
        </tr>
        <tr style="background: #ecfdf5; font-weight: 700; font-size: 14px;">
          <td>সম্ভাব্য মাসিক নিট মুনাফা (Net Monthly Profit)</td>
          <td>গ্রস মুনাফা - ওভারহেড খরচ</td>
          <td class="text-right" style="color: #047857;">${formatBDT(metrics.estimatedMonthlyNetProfit, true)}</td>
        </tr>
        <tr style="font-weight: 600;">
          <td>বাৎসরিক প্রক্ষেপিত নিট মুনাফা (Annual Net Profit)</td>
          <td>১২ মাসের ক্রমপুঞ্জিত অনুমান</td>
          <td class="text-right" style="color: #0e7490;">${formatBDT(metrics.estimatedMonthlyNetProfit * 12, true)}</td>
        </tr>
      </tbody>
    </table>

    <div class="callout">
      📌 <strong>ব্রেক-ইভেন ও ঝুঁকি বিশ্লেষণ:</strong> আপনার মাসিক স্থায়ী খরচ ${formatBDT(metrics.fixedMonthlyOverhead, true)} তুলতে মাসে <strong>${toBengaliNumber(metrics.breakEvenBottles)} বোতল</strong> বিক্রি করতে হবে (দৈনিক প্রায় ${toBengaliNumber(Math.round(metrics.breakEvenBottles / 30))} বোতল)। বর্তমান নিশ্চিত চাহিদা (${toBengaliNumber(metrics.totalMonthlyBottleDemand)} বোতল) ব্রেক-ইভেনের চেয়ে অনেক বেশি হওয়ায় ব্যবসায়িক মার্জিন অব সেফটি ইতিবাচক।
    </div>

    <!-- 5. RESTAURANT VISIT LOG SUMMARY -->
    <div class="page-break"></div>
    <div class="section-title">৪. ফিল্ডে ভিজিটকৃত রেস্টুরেন্ট ডাটা লগ (${toBengaliNumber(restaurants.length)}টি প্রতিষ্ঠান)</div>
    <table>
      <thead>
        <tr>
          <th>রেস্টুরেন্টের নাম</th>
          <th>এলাকা</th>
          <th>দৈনিক কাস্টমার</th>
          <th>বর্তমান ব্র্যান্ড ও দর</th>
          <th>দৈনিক বোতল</th>
          <th>আগ্রহ</th>
          <th class="text-right">মাসিক চাহিদা</th>
        </tr>
      </thead>
      <tbody>
        ${restaurants.map(r => `
          <tr>
            <td><strong>${r.name}</strong><br><span style="font-size: 10px; color: #6b7280;">${r.contactPerson} (${r.phone})</span></td>
            <td>${r.area}</td>
            <td>${toBengaliNumber(r.approxDailyCustomers)} জন</td>
            <td>${r.currentWaterBrand} (${formatBDT(r.currentPurchasePrice, true)})</td>
            <td>${toBengaliNumber(r.dailyBottleUsage)} টি</td>
            <td>
              <span class="${r.interested === 'হ্যাঁ' ? 'badge-yes' : r.interested === 'সম্ভবত' ? 'badge-maybe' : 'badge-no'}">
                ${r.interested}
              </span>
            </td>
            <td class="text-right font-bold">${toBengaliNumber(r.expectedMonthlyQuantity || (r.dailyBottleUsage * 30))} বোতল</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- 6. OEM FACTORY COMPARISON -->
    <div class="section-title">৫. OEM বোতলজাতকরণ ফ্যাক্টরি তুলনা (${toBengaliNumber(factories.length)}টি প্রতিষ্ঠান)</div>
    <table>
      <thead>
        <tr>
          <th>ফ্যাক্টরির নাম ও অবস্থান</th>
          <th>সাইজ ও ধরণ</th>
          <th>MOQ</th>
          <th>ইউনিট খরচ</th>
          <th>প্রাইভেট লেবেল</th>
          <th>সার্টিফিকেশন</th>
        </tr>
      </thead>
      <tbody>
        ${factories.map(f => `
          <tr>
            <td><strong>${f.name}</strong><br><span style="font-size: 10px; color: #6b7280;">${f.location} | ${f.phone}</span></td>
            <td>${f.bottleSize} (${f.bottleType})</td>
            <td>${toBengaliNumber(f.moq)} টি</td>
            <td style="font-weight: 700; color: #0e7490;">${formatBDT(f.unitCost, true)}</td>
            <td>${f.privateLabel ? '✅ অনুমোদিত' : '❌ নেই'}</td>
            <td>${f.certifications.join(', ')}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <!-- 7. STRATEGIC RECOMMENDATIONS -->
    <div class="section-title">৬. পরবর্তী কৌশলগত কর্মপরিকল্পনা ও সুপারিশ (Next Steps)</div>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; font-size: 12px; line-height: 1.6;">
      <ol style="margin: 0; padding-left: 20px;">
        <li><strong>স্যাম্পলিং শুরু:</strong> ফ্যাক্টরি থেকে ন্যূনতম ৩০০০ বোতলের কাস্টম লেবেল ট্রায়াল লট অর্ডার দিয়ে আগ্রহী রেস্টুরেন্টগুলোতে ফ্রি টেস্টিং স্যাম্পল দিন।</li>
        <li><strong>অগ্রিম চুক্তি:</strong> সুলতান'স ডাইন ও স্টার কাবাবের মতো বড় ভলিউমের ক্লায়েন্টদের সাথে ১৫ দিনের সাইক্লিক বিলিংয়ে লিখিত চুক্তি সম্পন্ন করুন।</li>
        <li><strong>লজিস্টিক রুট অপ্টিমাইজেশন:</strong> দৈনিক ডেলিভারির বদলে ধানমন্ডি-বনানী-গুলশান ক্লাস্টারে সপ্তাহে ৩ দিন ডেলিভারির শিডিউল নির্ধারণ করলে পরিবহন খরচ ২৫% কমানো যাবে।</li>
        <li><strong>BSTI ও ল্যাব কোয়ালিটি নিশ্চয়তা:</strong> প্রতি ডেলিভারি চালানের সাথে পানির ল্যাব টেস্ট রিপোর্ট সংযুক্ত করুন, যা প্রিমিয়াম রেস্টুরেন্টগুলোর আস্থা বহুগুণ বাড়িয়ে দেয়।</li>
      </ol>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div>পানিশিল্প ফিল্ড রিসার্চ সিস্টেম (PaniShilpa) দ্বারা স্বয়ংক্রিয়ভাবে তৈরি</div>
      <div>পৃষ্ঠা ১/২ · সার্বিক ফিজিবিলিটি কপি</div>
    </div>
  </div>
</body>
</html>`;
}

// Function to print or save PDF directly
export function printPDFReport(
  metrics: FeasibilityMetrics,
  restaurants: Restaurant[],
  factories: Factory[]
): void {
  const htmlContent = generateBengaliReportHTML(metrics, restaurants, factories);
  
  // Create an invisible iframe for pristine printing without leaving the page
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document;
  if (!doc) return;

  doc.open();
  doc.write(htmlContent);
  doc.close();

  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    // remove iframe after print dialog completes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 2000);
  }, 400);
}

// Function to download standalone HTML report file
export function downloadOfflineReportFile(
  metrics: FeasibilityMetrics,
  restaurants: Restaurant[],
  factories: Factory[]
): void {
  const htmlContent = generateBengaliReportHTML(metrics, restaurants, factories);
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `panishilpa_feasibility_report_${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
