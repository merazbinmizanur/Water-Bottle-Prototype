/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Store, 
  Factory as FactoryIcon, 
  Download, 
  Calculator,
  RefreshCw
} from 'lucide-react';
import { Restaurant, Factory, ActiveTab } from './types';
import { Storage, AppSettings } from './utils/storage';
import { calculateFeasibilityMetrics } from './utils/calculations';

// Layout & Common Components
import { MobileHeader } from './components/layout/MobileHeader';
import { BottomNavigation } from './components/layout/BottomNavigation';
import { Toast, ToastMessage } from './components/common/Toast';
import { ConfirmModal } from './components/common/ConfirmModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { PWAInstallButton } from './components/common/PWAInstallButton';

// Main Views
import { DashboardView } from './components/dashboard/DashboardView';
import { RestaurantListView } from './components/restaurants/RestaurantListView';
import { RestaurantFormModal } from './components/restaurants/RestaurantFormModal';
import { FactoryListView } from './components/factories/FactoryListView';
import { FactoryFormModal } from './components/factories/FactoryFormModal';
import { AnalysisView } from './components/analysis/AnalysisView';
import { PDFReportModal } from './components/analysis/PDFReportModal';
import { MoreView } from './components/more/MoreView';
import { CostCalculatorModal } from './components/more/CostCalculatorModal';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Core Data State
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [factories, setFactories] = useState<Factory[]>([]);
  const [settings, setSettings] = useState<AppSettings>(Storage.getSettings());

  // Form Modals
  const [isRestaurantFormOpen, setIsRestaurantFormOpen] = useState(false);
  const [editingRestaurant, setEditingRestaurant] = useState<Restaurant | null>(null);

  const [isFactoryFormOpen, setIsFactoryFormOpen] = useState(false);
  const [editingFactory, setEditingFactory] = useState<Factory | null>(null);

  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isPDFReportOpen, setIsPDFReportOpen] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Confirmation Modals State
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'restaurant' | 'factory';
    item: Restaurant | Factory;
  } | null>(null);

  const [isResetAllConfirmOpen, setIsResetAllConfirmOpen] = useState(false);

  // Initialize data from LocalStorage
  useEffect(() => {
    setRestaurants(Storage.getRestaurants());
    setFactories(Storage.getFactories());
    setSettings(Storage.getSettings());
  }, []);

  // Show Toast Helper
  const showToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToast({
      id: `${Date.now()}`,
      type,
      text,
    });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  // Live Metrics Calculation
  const metrics = useMemo(() => {
    return calculateFeasibilityMetrics(restaurants, factories, settings.defaultFixedMonthlyCost);
  }, [restaurants, factories, settings.defaultFixedMonthlyCost]);

  // Restaurant Save Handler
  const handleSaveRestaurant = (savedRestaurant: Restaurant) => {
    let updated: Restaurant[];
    const exists = restaurants.some((r) => r.id === savedRestaurant.id);
    if (exists) {
      updated = restaurants.map((r) => (r.id === savedRestaurant.id ? savedRestaurant : r));
    } else {
      updated = [savedRestaurant, ...restaurants];
    }
    setRestaurants(updated);
    Storage.saveRestaurants(updated);
    setIsRestaurantFormOpen(false);
    setEditingRestaurant(null);
    showToast('ডাটা সফলভাবে সংরক্ষণ হয়েছে', 'success');
  };

  // Factory Save Handler
  const handleSaveFactory = (savedFactory: Factory) => {
    let updated: Factory[];
    const exists = factories.some((f) => f.id === savedFactory.id);
    if (exists) {
      updated = factories.map((f) => (f.id === savedFactory.id ? savedFactory : f));
    } else {
      updated = [savedFactory, ...factories];
    }
    setFactories(updated);
    Storage.saveFactories(updated);
    setIsFactoryFormOpen(false);
    setEditingFactory(null);
    showToast('ডাটা সফলভাবে সংরক্ষণ হয়েছে', 'success');
  };

  // Delete Handlers
  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;

    if (deleteConfirmTarget.type === 'restaurant') {
      const updated = restaurants.filter((r) => r.id !== deleteConfirmTarget.item.id);
      setRestaurants(updated);
      Storage.saveRestaurants(updated);
      showToast('রেস্টুরেন্ট ডাটা মুছে ফেলা হয়েছে', 'info');
    } else {
      const updated = factories.filter((f) => f.id !== deleteConfirmTarget.item.id);
      setFactories(updated);
      Storage.saveFactories(updated);
      showToast('ফ্যাক্টরি ডাটা মুছে ফেলা হয়েছে', 'info');
    }

    setDeleteConfirmTarget(null);
  };

  // Reset All Data Handler
  const handleConfirmResetAll = () => {
    Storage.resetAllData();
    setRestaurants([]);
    setFactories([]);
    setIsResetAllConfirmOpen(false);
    showToast('সমস্ত ফিল্ড ডাটা মুছে ফেলা হয়েছে', 'info');
  };

  // Header configuration based on active tab
  const getHeaderProps = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'পানিশিল্প ড্যাশবোর্ড',
          subtitle: 'ফিল্ড রিসার্চ ও ফিজিবিলিটি বিশ্লেষণ',
          quickAction: (
            <button
              type="button"
              onClick={() => {
                setEditingRestaurant(null);
                setIsRestaurantFormOpen(true);
              }}
              className="touch-target px-3 py-1.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-xs hover:bg-cyan-800 transition flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ ভিজিট</span>
            </button>
          ),
        };
      case 'restaurants':
        return {
          title: 'রেস্টুরেন্ট ফিল্ড রিসার্চ',
          subtitle: `মোট ${restaurants.length}টি রেস্টুরেন্ট ডাটা`,
          quickAction: (
            <button
              type="button"
              onClick={() => {
                setEditingRestaurant(null);
                setIsRestaurantFormOpen(true);
              }}
              className="touch-target px-3 py-1.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-xs hover:bg-cyan-800 transition flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ নতুন রেস্টুরেন্ট</span>
            </button>
          ),
        };
      case 'factories':
        return {
          title: 'বোটলিং ফ্যাক্টরি রিসার্চ',
          subtitle: `মোট ${factories.length}টি OEM রেট সংরক্ষিত`,
          quickAction: (
            <button
              type="button"
              onClick={() => {
                setEditingFactory(null);
                setIsFactoryFormOpen(true);
              }}
              className="touch-target px-3 py-1.5 rounded-xl bg-teal-700 text-white text-xs font-semibold shadow-xs hover:bg-teal-800 transition flex items-center gap-1 active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>+ নতুন ফ্যাক্টরি</span>
            </button>
          ),
        };
      case 'analysis':
        return {
          title: 'ব্যবসায়িক ফিজিবিলিটি',
          subtitle: 'মার্জিন, ব্রেক-ইভেন ও প্রফিট মডেল',
          quickAction: (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(true)}
              className="touch-target px-3 py-1.5 rounded-xl bg-cyan-700 text-white text-xs font-semibold shadow-xs hover:bg-cyan-800 transition flex items-center gap-1 active:scale-95"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>ক্যালকুলেটর</span>
            </button>
          ),
        };
      case 'more':
        return {
          title: 'অন্যান্য ও সেটিংস',
          subtitle: 'ব্যাকআপ, রিস্টোর ও ফিল্ড গাইড',
          quickAction: null,
        };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 flex flex-col font-sans selection:bg-cyan-100 selection:text-cyan-900">
      {/* Offline Connectivity Notification */}
      <OfflineIndicator />

      {/* Global Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Sticky Mobile Header */}
      <MobileHeader
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        quickAction={headerProps.quickAction}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md mx-auto w-full px-3.5 pt-3">
        {activeTab === 'dashboard' && (
          <DashboardView
            metrics={metrics}
            restaurants={restaurants}
            factories={factories}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenNewRestaurant={() => {
              setEditingRestaurant(null);
              setIsRestaurantFormOpen(true);
            }}
            onOpenNewFactory={() => {
              setEditingFactory(null);
              setIsFactoryFormOpen(true);
            }}
          />
        )}

        {activeTab === 'restaurants' && (
          <RestaurantListView
            restaurants={restaurants}
            onOpenCreate={() => {
              setEditingRestaurant(null);
              setIsRestaurantFormOpen(true);
            }}
            onEdit={(restaurant) => {
              setEditingRestaurant(restaurant);
              setIsRestaurantFormOpen(true);
            }}
            onDeleteRequest={(restaurant) => {
              setDeleteConfirmTarget({ type: 'restaurant', item: restaurant });
            }}
          />
        )}

        {activeTab === 'factories' && (
          <FactoryListView
            factories={factories}
            onOpenCreate={() => {
              setEditingFactory(null);
              setIsFactoryFormOpen(true);
            }}
            onEdit={(factory) => {
              setEditingFactory(factory);
              setIsFactoryFormOpen(true);
            }}
            onDeleteRequest={(factory) => {
              setDeleteConfirmTarget({ type: 'factory', item: factory });
            }}
          />
        )}

        {activeTab === 'analysis' && (
          <AnalysisView
            metrics={metrics}
            restaurants={restaurants}
            factories={factories}
            onUpdateFixedCost={(cost) => {
              const updated = { ...settings, defaultFixedMonthlyCost: cost };
              setSettings(updated);
              Storage.saveSettings(updated);
            }}
            onOpenPDFReport={() => setIsPDFReportOpen(true)}
          />
        )}

        {activeTab === 'more' && (
          <MoreView
            restaurantCount={restaurants.length}
            factoryCount={factories.length}
            settings={settings}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onOpenPDFReport={() => setIsPDFReportOpen(true)}
            onRefreshData={() => {
              setRestaurants(Storage.getRestaurants());
              setFactories(Storage.getFactories());
              setSettings(Storage.getSettings());
            }}
            onResetAllRequest={() => setIsResetAllConfirmOpen(true)}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* iOS Liquid Glass Bottom Navigation Dock */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        restaurantCount={restaurants.length}
        factoryCount={factories.length}
      />

      {/* RESTAURANT FORM MODAL (1-2 Min Fast Mobile Entry) */}
      <RestaurantFormModal
        isOpen={isRestaurantFormOpen}
        initialData={editingRestaurant}
        onClose={() => {
          setIsRestaurantFormOpen(false);
          setEditingRestaurant(null);
        }}
        onSave={handleSaveRestaurant}
      />

      {/* FACTORY FORM MODAL (OEM Cost Entry) */}
      <FactoryFormModal
        isOpen={isFactoryFormOpen}
        initialData={editingFactory}
        onClose={() => {
          setIsFactoryFormOpen(false);
          setEditingFactory(null);
        }}
        onSave={handleSaveFactory}
      />

      {/* QUICK COST CALCULATOR MODAL */}
      <CostCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        defaultCost={metrics.minFactoryUnitCost || 6.45}
      />

      {/* PDF ANALYSIS REPORT PREVIEW & PRINT MODAL */}
      <PDFReportModal
        isOpen={isPDFReportOpen}
        onClose={() => setIsPDFReportOpen(false)}
        metrics={metrics}
        restaurants={restaurants}
        factories={factories}
        onShowToast={showToast}
      />

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={!!deleteConfirmTarget}
        title={deleteConfirmTarget?.type === 'restaurant' ? 'রেস্টুরেন্ট রেকর্ড মুছুন' : 'ফ্যাক্টরি রেকর্ড মুছুন'}
        message="এই ডাটা মুছে ফেলতে চান?"
        confirmLabel="মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirmTarget(null)}
      />

      {/* RESET ALL DATA CONFIRMATION MODAL */}
      <ConfirmModal
        isOpen={isResetAllConfirmOpen}
        title="সম্পূর্ণ ডাটাবেজ রিসেট"
        message="সতর্কতা: সব গবেষণা ডাটা মুছে যাবে। আপনি কি নিশ্চিত?"
        confirmLabel="হ্যাঁ, সব মুছে ফেলুন"
        cancelLabel="বাতিল"
        isDanger={true}
        onConfirm={handleConfirmResetAll}
        onCancel={() => setIsResetAllConfirmOpen(false)}
      />
    </div>
  );
}
