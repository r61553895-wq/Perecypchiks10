import React, { useState } from 'react';
import { 
  LayoutGrid, 
  Store, 
  Package, 
  TrendingUp, 
  Gavel, 
  Users, 
  Building2, 
  Play, 
  Pause, 
  ChevronDown,
  Sparkles,
  MapPin,
  Star,
  FastForward,
  Wallet,
  Sun,
  Moon,
  Smartphone,
  Maximize2,
  PieChart,
  Wifi,
  BatteryMedium,
  Signal
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { NavigationTab } from '../types';

export const TopHeader: React.FC = () => {
  const { 
    day, 
    balance, 
    inventory,
    marketListings,
    auctions,
    customerOrders,
    usedWarehouseSlots,
    maxWarehouseSlots,
    level,
    activeEvents, 
    advanceDay, 
    isAutoPlay, 
    setIsAutoPlay, 
    currentTab,
    setCurrentTab,
    currentLocation,
    setCurrentLocation,
    reputationPoints,
    theme,
    toggleTheme,
    deviceFrame,
    setDeviceFrame
  } = useGame();

  const [locationMenuOpen, setLocationMenuOpen] = useState(false);

  const availableLocations = [
    { name: 'Блошиный рынок', minLvl: 1, desc: 'Низкие цены, винтаж, высокий шанс дефектов' },
    { name: 'Радиорынок Митино', minLvl: 1, desc: 'Электроника, комплектующие, честные продавцы' },
    { name: 'Оптовые склады Садовод', minLvl: 2, desc: 'Новые аксессуары и гаджеты оптом' },
    { name: 'Таможенный конфискат', minLvl: 3, desc: 'Редкие флагманы, авто и техника за полцены' },
    { name: 'Закрытый VIP-клуб', minLvl: 4, desc: 'Люксовые лоты, швейцарские часы, гиперкары' },
  ];

  const currentEvent = activeEvents[0];
  const pendingOrders = customerOrders.filter(o => !o.isCompleted).length;

  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#131C31]/95 backdrop-blur-md select-none shrink-0 sticky top-0 z-40 w-full transition-colors">
      {/* Mobile Status Bar (iOS / Android presentation) */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 select-none">
        <div className="flex items-center gap-1.5 font-medium tracking-tight">
          <span>09:41</span>
          <span className="text-[9px] text-slate-400">•</span>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">День {day}</span>
        </div>

        {/* Dynamic Controls in Status Bar: Theme toggle & Frame mode */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            title={theme === 'light' ? 'Переключить на тёмную тему' : 'Переключить на светлую тему'}
            aria-label="Сменить тему"
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
          </button>

          <button
            onClick={() => setDeviceFrame(!deviceFrame)}
            className="hidden sm:flex items-center gap-1 p-1 rounded-full text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors"
            title={deviceFrame ? 'Развернуть на весь экран' : 'Включить рамку смартфона'}
            aria-label="Режим отображения"
          >
            {deviceFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          </button>

          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <BatteryMedium className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Active Market Event banner */}
      {currentEvent && (
        <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border-y border-blue-100 dark:border-blue-900/50 px-4 py-1.5 text-xs flex items-center justify-between text-blue-950 dark:text-blue-100">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 animate-ping shrink-0" />
            <span className="font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider text-[10px]">
              Событие:
            </span>
            <span className="font-medium truncate text-[11px]">{currentEvent.title}</span>
          </div>
          <span className="text-[10px] font-semibold text-violet-700 dark:text-violet-300 bg-violet-100/80 dark:bg-violet-900/50 px-2 py-0.5 rounded-full shrink-0 ml-2">
            {currentEvent.durationDays} дн.
          </span>
        </div>
      )}

      {/* Main Header Bar */}
      <div className="px-4 py-2.5 flex items-center justify-between gap-3 w-full">
        {/* Left: Brand & Balance */}
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2 text-left focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 dark:bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform shrink-0">
              FL!P
            </div>
            <div className="flex flex-col leading-tight min-w-0">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Капитал
              </span>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                ₽ {balance.toLocaleString()}
              </span>
            </div>
          </button>
        </div>

        {/* Right Actions: Location picker, Auto-play, Primary Next Day CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Location Badge / Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLocationMenuOpen(!locationMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="max-w-[85px] sm:max-w-[130px] truncate">{currentLocation}</span>
              <ChevronDown className="w-3 h-3 text-slate-400 shrink-0" />
            </button>

            {locationMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Торговая локация
                </div>
                {availableLocations.map(loc => {
                  const isLocked = level < loc.minLvl;
                  const isSelected = currentLocation === loc.name;
                  return (
                    <button
                      key={loc.name}
                      disabled={isLocked}
                      onClick={() => {
                        setCurrentLocation(loc.name);
                        setLocationMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors mb-1 flex flex-col ${
                        isSelected 
                          ? 'bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200' 
                          : isLocked 
                            ? 'opacity-40 cursor-not-allowed text-slate-400' 
                            : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{loc.name}</span>
                        {isLocked && <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Ур. {loc.minLvl}+</span>}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">{loc.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Auto play button */}
          <button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            className={`p-2 rounded-xl border text-xs transition-colors ${
              isAutoPlay 
                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-300 dark:border-amber-700' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-slate-900'
            }`}
            title={isAutoPlay ? 'Приостановить авто-день' : 'Автоматический ход дней'}
          >
            {isAutoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          {/* PRIMARY CTA: Royal Blue Next Day Button */}
          <button
            onClick={advanceDay}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs sm:text-sm tracking-tight transition-all shadow-md shadow-blue-500/25 shrink-0 whitespace-nowrap cursor-pointer touch-manipulation"
            title="Перейти к следующему дню [Пробел]"
          >
            <FastForward className="w-4 h-4 fill-white shrink-0" />
            <span className="hidden xs:inline">След. день</span>
            <span className="xs:hidden">День +1</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    marketListings, 
    auctions, 
    customerOrders, 
    usedWarehouseSlots, 
    maxWarehouseSlots 
  } = useGame();
  
  const pendingOrders = customerOrders.filter(o => !o.isCompleted).length;

  // Exactly 5 clean, ergonomic mobile tabs (as requested in point 7 of prompt)
  const tabs: { 
    id: NavigationTab; 
    label: string; 
    icon: React.ElementType; 
    badge?: string | number;
    matchTabs?: NavigationTab[];
  }[] = [
    { 
      id: 'dashboard', 
      label: 'Главная', 
      icon: LayoutGrid 
    },
    { 
      id: 'market', 
      label: 'Рынок', 
      icon: Store, 
      badge: marketListings.length 
    },
    { 
      id: 'auctions', 
      label: 'Аукционы', 
      icon: Gavel, 
      badge: auctions.length > 0 ? auctions.length : undefined 
    },
    { 
      id: 'warehouse', 
      label: 'Склад', 
      icon: Package, 
      badge: `${usedWarehouseSlots}/${maxWarehouseSlots}`,
      matchTabs: ['warehouse', 'showroom', 'clients']
    },
    { 
      id: 'finances', 
      label: 'Бизнес', 
      icon: PieChart, 
      badge: pendingOrders > 0 ? pendingOrders : undefined,
      matchTabs: ['finances', 'upgrades', 'sales', 'settings']
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-full z-40 select-none">
      <div className="bg-white/95 dark:bg-[#131C31]/95 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 pb-[max(env(safe-area-inset-bottom,0px),12px)] pt-2 shadow-2xl">
        <div className="flex items-center justify-around px-2 max-w-md mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = tab.matchTabs 
              ? tab.matchTabs.includes(currentTab) 
              : currentTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setCurrentTab(tab.id)}
                className={`flex flex-col items-center justify-center flex-1 py-1 relative touch-manipulation active:scale-95 transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 font-bold' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <div className={`p-1.5 rounded-xl transition-colors ${
                    isActive 
                      ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {tab.badge !== undefined && (
                    <span className="absolute -top-1 -right-2 text-[9px] font-bold font-mono bg-blue-600 text-white px-1.5 py-0.2 rounded-full leading-tight shadow-sm">
                      {typeof tab.badge === 'string' ? tab.badge.split('/')[0] : tab.badge}
                    </span>
                  )}
                </div>

                <span className="text-[11px] tracking-tight mt-1 font-medium whitespace-nowrap">
                  {tab.label}
                </span>

                {/* Subtle active indicator pill */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* iOS Home Bar Indicator */}
        <div className="w-32 h-1 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mt-2 opacity-60" />
      </div>
    </nav>
  );
};
