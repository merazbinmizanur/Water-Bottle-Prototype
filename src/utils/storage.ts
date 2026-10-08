import { Restaurant, Factory } from '../types';
import { INITIAL_RESTAURANTS, INITIAL_FACTORIES } from '../data/initialData';

const RESTAURANTS_KEY = 'panishilpa_restaurants_v1';
const FACTORIES_KEY = 'panishilpa_factories_v1';
const SETTINGS_KEY = 'panishilpa_settings_v1';

export interface AppSettings {
  currency: string;
  defaultFixedMonthlyCost: number; // e.g. 35000 BDT
  targetBottleSize: string; // '500ml'
  language: 'bn' | 'en';
}

const DEFAULT_SETTINGS: AppSettings = {
  currency: '৳',
  defaultFixedMonthlyCost: 30000,
  targetBottleSize: '500ml',
  language: 'bn',
};

export const Storage = {
  getRestaurants(): Restaurant[] {
    try {
      const data = localStorage.getItem(RESTAURANTS_KEY);
      if (!data) {
        // Initialize with default field research data
        localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
        return INITIAL_RESTAURANTS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load restaurants from LocalStorage', e);
      return INITIAL_RESTAURANTS;
    }
  },

  saveRestaurants(list: Restaurant[]): void {
    try {
      localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save restaurants to LocalStorage', e);
    }
  },

  getFactories(): Factory[] {
    try {
      const data = localStorage.getItem(FACTORIES_KEY);
      if (!data) {
        localStorage.setItem(FACTORIES_KEY, JSON.stringify(INITIAL_FACTORIES));
        return INITIAL_FACTORIES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to load factories from LocalStorage', e);
      return INITIAL_FACTORIES;
    }
  },

  saveFactories(list: Factory[]): void {
    try {
      localStorage.setItem(FACTORIES_KEY, JSON.stringify(list));
    } catch (e) {
      console.error('Failed to save factories to LocalStorage', e);
    }
  },

  getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      if (!data) return DEFAULT_SETTINGS;
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  },

  saveSettings(settings: AppSettings): void {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Failed to save settings', e);
    }
  },

  resetAllData(): void {
    localStorage.removeItem(RESTAURANTS_KEY);
    localStorage.removeItem(FACTORIES_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  },

  loadSampleData(): void {
    localStorage.setItem(RESTAURANTS_KEY, JSON.stringify(INITIAL_RESTAURANTS));
    localStorage.setItem(FACTORIES_KEY, JSON.stringify(INITIAL_FACTORIES));
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  },

  exportAllAsJSON(): string {
    const payload = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      restaurants: this.getRestaurants(),
      factories: this.getFactories(),
      settings: this.getSettings(),
    };
    return JSON.stringify(payload, null, 2);
  },

  importFromJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed.restaurants)) {
        this.saveRestaurants(parsed.restaurants);
      }
      if (Array.isArray(parsed.factories)) {
        this.saveFactories(parsed.factories);
      }
      if (parsed.settings) {
        this.saveSettings(parsed.settings);
      }
      return true;
    } catch (e) {
      console.error('Invalid import JSON', e);
      return false;
    }
  },

  exportRestaurantsCSV(): string {
    const list = this.getRestaurants();
    const headers = [
      'Restaurant Name',
      'Area',
      'Location',
      'Type',
      'Daily Customers',
      'Current Brand',
      'Bottle Size',
      'Daily Usage',
      'Current Purchase Price (BDT)',
      'Interested Status',
      'Expected Price (BDT)',
      'Monthly Demand (Bottles)',
      'Contact Person',
      'Phone',
      'Notes'
    ];
    
    const rows = list.map(r => [
      `"${r.name.replace(/"/g, '""')}"`,
      `"${r.area}"`,
      `"${r.location.replace(/"/g, '""')}"`,
      `"${r.restaurantType}"`,
      r.approxDailyCustomers,
      `"${r.currentWaterBrand}"`,
      r.bottleSize,
      r.dailyBottleUsage,
      r.currentPurchasePrice,
      `"${r.interested}"`,
      r.expectedPrice ?? '',
      r.expectedMonthlyQuantity ?? '',
      `"${r.contactPerson.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`
    ]);

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  }
};
