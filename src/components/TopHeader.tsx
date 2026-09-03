import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  PieChart, 
  Award, 
  Settings,
  Play, 
  Pause, 
  ArrowRight, 
  Radio
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { NavigationTab } from '../types';

export const TopHeader: React.FC = () => {
  const { 
    day, 
    balance, 
    stats,
    inventory,
    marketListings,
    usedWarehouseSlots,
    maxWarehouseSlots,
    level,
    activeEvents, 
    advanceDay, 
    isAutoPlay, 
    setIsAutoPlay, 
    gameSpeed, 
    setGameSpeed,
    currentTab,
    setCurrentTab
  } = useGame();

  const listedCount = inventory.filter(i => i.status === 'listed').length;
  const currentEvent = activeEvents[0];

  // Primary navigation tabs required by the user:
  // Сводка | Рынок | Склад | Продажи | Финансы
  const primaryTabs: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Сводка', icon: LayoutDashboard },
    { id: 'market', label: 'Рынок', icon: ShoppingBag, badge: marketListings.length },
    { id: 'warehouse', label: 'Склад', icon: Package, badge: `${usedWarehouseSlots}/${maxWarehouseSlots}` },
    { id: 'sales', label: 'Продажи', icon: TrendingUp, badge: listedCount > 0 ? listedCount : undefined },
    { id: 'finances', label: 'Финансы', icon: PieChart }
  ];

  return (
    <header className="border-b border-zinc-200 bg-white select-none shrink-0 sticky top-0 z-40">
      {/* Top Banner if Active Market Event */}
      {currentEvent && (
        <div className="bg-zinc-900 text-white px-4 py-1 text-[11px] flex items-center justify-between">
          <div className="flex items-center gap-2 max-w-2xl truncate">
            <Radio className="w-3 h-3 text-emerald-400 shrink-0 animate-pulse" />
            <span className="font-semibold text-zinc-100">{currentEvent.title}:</span>
            <span className="text-zinc-300 truncate">{currentEvent.description}</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 shrink-0 ml-2">
            осталось {currentEvent.durationDays} дн.
          </span>
        </div>
      )}

      {/* Main Top Navigation Row */}
      <div className="h-14 px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentTab('dashboard')}>
            <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-xs tracking-wider shadow-2xs">
              ПР
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-zinc-900 leading-none">
                ПЕРЕКУП
              </span>
              <span className="text-[10px] text-zinc-400 font-mono tracking-tighter">
                бизнес-симулятор
              </span>
            </div>
          </div>

          <span className="hidden xl:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
            Ур. {level}
          </span>
        </div>

        {/* Center: Primary Compact Navigation (Сводка | Рынок | Склад | Продажи | Финансы) */}
        <nav className="hidden md:flex items-center gap-1">
          {primaryTabs.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id;
            return (
              <React.Fragment key={tab.id}>
                {idx > 0 && <span className="text-zinc-300 text-xs select-none">|</span>}
                <button
                  onClick={() => setCurrentTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-zinc-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                      isActive 
                        ? 'bg-zinc-800 text-zinc-200' 
                        : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}

          {/* Secondary tabs: Развитие & Настройки */}
          <span className="text-zinc-300 text-xs select-none ml-1">|</span>
          <button
            onClick={() => setCurrentTab('upgrades')}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'upgrades'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Развитие бизнеса"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Развитие</span>
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`p-1.5 rounded-md text-xs font-medium transition-all ${
              currentTab === 'settings'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
            title="Настройки"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </nav>

        {/* Right: Key Business Metrics & Step Simulation Controls */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Capital / Balance */}
          <div className="text-right">
            <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">Баланс</div>
            <div className="text-sm sm:text-base font-bold font-mono text-zinc-900 leading-none">
              {balance.toLocaleString()} ₽
            </div>
          </div>

          {/* Day Display */}
          <div className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono font-medium text-zinc-800">
            День {day}
          </div>

          {/* Speed & Auto-play */}
          <div className="hidden sm:flex items-center gap-1 pl-1 border-l border-zinc-200">
            <button
              onClick={() => setGameSpeed(gameSpeed === 1 ? 2 : 1)}
              className={`px-2 py-1 rounded-md border text-xs font-mono transition-colors ${
                gameSpeed === 2 
                  ? 'bg-zinc-900 text-white border-zinc-900' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              title="Скорость времени (1x / 2x)"
            >
              {gameSpeed}x
            </button>
            <button
              onClick={() => setIsAutoPlay(!isAutoPlay)}
              className={`p-1.5 rounded-md border text-xs transition-colors ${
                isAutoPlay 
                  ? 'bg-amber-50 text-amber-700 border-amber-300' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
              title={isAutoPlay ? 'Приостановить ход времени' : 'Автоматический ход времени'}
            >
              {isAutoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Primary Action: Advance Day */}
          <button
            onClick={advanceDay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 active:scale-98 text-white text-xs font-semibold transition-all shadow-xs"
            title="Перейти к следующему дню [Пробел]"
          >
            <span>След. день</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, marketListings, usedWarehouseSlots, maxWarehouseSlots, inventory } = useGame();
  const listedCount = inventory.filter(i => i.status === 'listed').length;

  const tabs: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string | number }[] = [
    { id: 'dashboard', label: 'Сводка', icon: LayoutDashboard },
    { id: 'market', label: 'Рынок', icon: ShoppingBag, badge: marketListings.length },
    { id: 'warehouse', label: 'Склад', icon: Package, badge: `${usedWarehouseSlots}/${maxWarehouseSlots}` },
    { id: 'sales', label: 'Продажи', icon: TrendingUp, badge: listedCount > 0 ? listedCount : undefined },
    { id: 'finances', label: 'Финансы', icon: PieChart },
    { id: 'upgrades', label: 'Развитие', icon: Award }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-[calc(3.5rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] bg-white/95 backdrop-blur-md border-t border-zinc-200 flex items-center justify-around z-40 px-1 shadow-lg select-none">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setCurrentTab(tab.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 relative touch-manipulation active:scale-95 transition-transform ${
              isActive ? 'text-zinc-900 font-bold' : 'text-zinc-400 font-medium'
            }`}
          >
            <div className="relative">
              <Icon className="w-4 h-4" />
              {tab.badge !== undefined && (
                <span className="absolute -top-1 -right-2 text-[8px] font-mono bg-zinc-900 text-white px-1 rounded-full leading-tight">
                  {typeof tab.badge === 'string' ? tab.badge.split('/')[0] : tab.badge}
                </span>
              )}
            </div>
            <span className="text-[9px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
