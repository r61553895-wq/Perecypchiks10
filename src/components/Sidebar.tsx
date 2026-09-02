import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  PieChart, 
  Award, 
  Settings,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { NavigationTab } from '../types';
import { LEVEL_DEFINITIONS } from '../data/catalog';

interface NavItemConfig {
  id: NavigationTab;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

export const Sidebar: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    marketListings, 
    inventory, 
    level, 
    reputation,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  const listedCount = inventory.filter(i => i.status === 'listed').length;
  const inWarehouseCount = inventory.filter(i => i.status === 'in_warehouse').length;
  const levelInfo = LEVEL_DEFINITIONS.find(l => l.level === level) || LEVEL_DEFINITIONS[0];

  const navItems: NavItemConfig[] = [
    { id: 'dashboard', label: 'Сводка', icon: LayoutDashboard },
    { id: 'market', label: 'Рынок', icon: ShoppingBag, badge: marketListings.length },
    { id: 'warehouse', label: 'Склад', icon: Package, badge: `${usedWarehouseSlots}/${maxWarehouseSlots}` },
    { id: 'sales', label: 'Продажи', icon: TrendingUp, badge: listedCount > 0 ? listedCount : undefined },
    { id: 'finances', label: 'Финансы', icon: PieChart },
    { id: 'upgrades', label: 'Развитие', icon: Award, badge: `Ур. ${level}` },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-zinc-200 bg-white flex flex-col justify-between shrink-0 select-none h-screen">
      {/* Brand Header */}
      <div>
        <div className="h-16 px-5 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-950 text-white flex items-center justify-center font-bold text-xs tracking-wider">
              RS
            </div>
            <div>
              <div className="font-semibold text-sm text-zinc-900 leading-none">ResellerOS</div>
              <div className="text-[11px] text-zinc-500 mt-1 font-mono tracking-tight">Simulator v2.4</div>
            </div>
          </div>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
            PRO
          </span>
        </div>

        {/* Navigation Menu */}
        <nav className="p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  isActive 
                    ? 'bg-zinc-900 text-white shadow-xs' 
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isActive 
                      ? 'bg-zinc-800 text-zinc-300' 
                      : 'bg-zinc-100 text-zinc-600 border border-zinc-200'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile & Business Reputation Footer */}
      <div className="p-3 border-t border-zinc-100">
        <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/80">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Профиль селлера</span>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/70">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span>{reputation.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-xs font-semibold text-zinc-900 truncate flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">{levelInfo.title}</span>
          </div>
          <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-zinc-500">
            <span>Вместимость</span>
            <span className="font-mono text-zinc-700 font-medium">
              {usedWarehouseSlots} / {maxWarehouseSlots} мест
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
