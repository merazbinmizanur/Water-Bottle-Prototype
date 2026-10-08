export type InterestStatus = 'হ্যাঁ' | 'সম্ভবত' | 'না';

export type BottleSize = '250ml' | '330ml' | '500ml' | '1000ml';

export type RestaurantType = 
  | 'Kacchi / Biryani'
  | 'Dine-in / Traditional'
  | 'Cafe & Bistro'
  | 'Fast Food / Burger'
  | 'Chinese & Thai'
  | 'Fine Dining'
  | 'Bakery & Sweets'
  | 'Office Canteen'
  | 'Other';

export interface Restaurant {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Basic Information
  name: string;
  location: string;
  area: string;
  restaurantType: RestaurantType | string;
  branches: string; // '১টি', '২-৩টি', '৪+টি'

  // Demand
  approxDailyCustomers: number;
  currentWaterBrand: string;
  bottleSize: BottleSize;
  dailyBottleUsage: number;
  currentPurchasePrice: number; // BDT
  currentSellingPrice?: number; // BDT to end customer

  // Business Interest
  interested: InterestStatus;
  preferredBottleSize?: BottleSize;
  expectedPrice?: number; // Expected purchase price from us (BDT)
  expectedMonthlyQuantity?: number; // Bottles per month
  deliveryPreference?: string; // দৈনিক, সপ্তাহে ৩ দিন, সাপ্তাহিক, প্রয়োজন অনুসারে

  // Contact
  contactPerson: string;
  phone: string;
  notes?: string;
}

export interface FactoryCostBreakdown {
  bottle: number; // Preform / blown bottle BDT
  cap: number; // Cap & seal
  waterFilling: number; // Purification, ozonation, filling
  label: number; // BOPP / sticker
  printing: number; // Expiry & batch print
  packaging: number; // Outer plastic / shrink
  carton: number; // Box cost per bottle
  delivery: number; // Transport to central depot per bottle
  other: number; // Overhead / wastage
}

export interface Factory {
  id: string;
  createdAt: string;
  updatedAt: string;

  // Factory Information
  name: string;
  location: string;
  contactPerson: string;
  phone: string;

  // Production
  bottleSize: BottleSize;
  bottleType: string; // 'Standard PET', 'Heavy Premium', 'Square Sleek', 'Lightweight'
  moq: number; // Minimum Order Quantity in bottles
  dailyCapacity: number; // bottles/day
  monthlyCapacity: number; // bottles/month

  // Cost
  costs: FactoryCostBreakdown;
  unitCost: number; // Total unit production cost (BDT)

  // Private Label
  customLabel: boolean;
  customBottle: boolean;
  privateLabel: boolean;
  plateCylinderCost?: number; // BDT one-time

  // Quality
  certifications: string[]; // BSTI, ISO 22000, HACCP, Halal
  waterTesting: boolean;
  productionProcess?: string;

  // Commercial
  paymentTerms: string; // e.g., '৫০% অগ্রিম + ৫০% ডেলিভারিতে', 'ক্যাশ অন ডেলিভারি'
  leadTimeDays: number;
  priceNegotiable: boolean;
  notes?: string;
}

export type ActiveTab = 'dashboard' | 'restaurants' | 'factories' | 'analysis' | 'more';

export interface FeasibilityMetrics {
  totalRestaurants: number;
  interestedRestaurants: number;
  maybeRestaurants: number;
  notInterestedRestaurants: number;
  interestRate: number; // percentage
  
  totalMonthlyBottleDemand: number; // sum of expected monthly demand from interested
  dailyTotalBottleDemand: number;
  
  totalFactories: number;
  avgFactoryUnitCost: number; // BDT
  minFactoryUnitCost: number; // BDT
  bestFactoryName: string;
  
  avgExpectedSellingPrice: number; // BDT
  avgCurrentRestaurantPrice: number; // BDT
  
  profitPerBottle: number; // BDT
  profitMarginPercent: number; // %
  
  estimatedMonthlyRevenue: number; // BDT
  estimatedMonthlyCost: number; // BDT
  estimatedMonthlyGrossProfit: number; // BDT
  estimatedMonthlyNetProfit: number; // After estimated ৳35,000 monthly logistics/ops
  
  fixedMonthlyOverhead: number; // Default ৳30,000
  breakEvenBottles: number; // monthly
  breakEvenDays: number;
  
  dataConfidencePercent: number; // 0 - 100% based on sample size
  feasibilityStatus: 'profitable' | 'moderate' | 'needs_research';
  statusTextBengali: string;
  recommendationBengali: string;
}
