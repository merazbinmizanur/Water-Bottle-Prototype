import React from 'react';
import { Home, Store, Factory as FactoryIcon, BarChart3, Menu } from 'lucide-react';
import { ActiveTab } from '../../types';

interface BottomNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  restaurantCount?: number;
  factoryCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  restaurantCount,
  factoryCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'ড্যাশবোর্ড',
      sublabel: 'Dashboard',
      icon: Home,
    },
    {
      id: 'restaurants' as ActiveTab,
      label: 'রেস্টুরেন্ট',
      sublabel: 'Restaurants',
      icon: Store,
      badge: restaurantCount,
    },
    {
      id: 'factories' as ActiveTab,
      label: 'ফ্যাক্টরি',
      sublabel: 'Factories',
      icon: FactoryIcon,
      badge: factoryCount,
    },
    {
      id: 'analysis' as ActiveTab,
      label: 'বিশ্লেষণ',
      sublabel: 'Analysis',
      icon: BarChart3,
    },
    {
      id: 'more' as ActiveTab,
      label: 'অন্যান্য',
      sublabel: 'More',
      icon: Menu,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none pb-2 pt-1 safe-bottom"
      aria-label="Main Navigation"
    >
      <div className="max-w-md mx-auto px-3">
        <div className="pointer-events-auto liquid-glass-dock rounded-2xl sm:rounded-3xl p-1.5 flex items-center justify-around shadow-xl">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`relative flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all touch-target duration-200 active:scale-95 ${
                  isActive
                    ? 'text-cyan-800 font-semibold'
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-100/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-stone-900/6 rounded-xl -z-10 transition animate-in fade-in zoom-in-95 duration-150" />
                )}
                
                <div className="relative">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isActive ? 'stroke-[2.4] text-cyan-700 scale-105' : 'stroke-[1.8]'
                    }`}
                  />
                  {typeof tab.badge === 'number' && tab.badge > 0 && (
                    <span className="absolute -top-1 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-cyan-700 text-white text-[9px] font-bold flex items-center justify-center leading-none">
                      {tab.badge > 99 ? '99+' : tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] leading-tight mt-1 tracking-tight truncate max-w-full">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
