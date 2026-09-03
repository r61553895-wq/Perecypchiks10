import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Store, 
  Package, 
  TrendingUp, 
  Gavel, 
  Users, 
  Radio, 
  ArrowRight, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  Receipt, 
  ShoppingCart,
  Zap,
  Building2,
  Clock,
  Flame,
  MessageSquare
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductImage } from '../ProductImage';
import { CONDITION_LABELS } from '../../data/catalog';

export const DashboardView: React.FC = () => {
  const { 
    balance, 
    stats, 
    level, 
    xp, 
    nextLevelXp, 
    inventory, 
    marketListings, 
    auctions, 
    customerOrders, 
    activeEvents, 
    salesHistory, 
    setCurrentTab, 
    startNegotiation, 
    buyItem, 
    setSelectedMarketItem, 
    maxWarehouseSlots, 
    usedWarehouseSlots,
    reputationPoints
  } = useGame();

  const currentEvent = activeEvents[0];
  const pendingOrders = customerOrders.filter(o => !o.isCompleted).length;

  // Inventory valuation
  const inventoryValuation = inventory
    .filter(i => i.status !== 'sold')
    .reduce((sum, item) => sum + item.currentMarketPrice, 0);

  // Top 3 hot deals from market
  const hotDeals = marketListings.slice(0, 3);

  // XP progress %
  const xpPercent = Math.min(100, Math.round((xp / (nextLevelXp || 1)) * 100));

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* 1. HERO FINANCIAL CAPITAL CARD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800/80 shadow-sm relative overflow-hidden transition-colors">
        {/* Subtle decorative royal blue & violet glow */}
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-violet-500/10 dark:bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400" />
              Доступный капитал
            </span>

            {/* Level Pill */}
            <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200/70 dark:border-blue-900/50 text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
              <span>Уровень {level}</span>
              <span className="text-[10px] text-blue-600/80 dark:text-blue-400 font-mono">({xpPercent}%)</span>
            </div>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              ₽ {balance.toLocaleString()}
            </div>
            
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {/* Net Profit Pill */}
              <div className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 ${
                stats.totalNetProfit >= 0 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/50'
              }`}>
                {stats.totalNetProfit >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>
                  {stats.totalNetProfit >= 0 ? `+${stats.totalNetProfit.toLocaleString()}` : stats.totalNetProfit.toLocaleString()} ₽ чистая прибыль
                </span>
              </div>

              {/* FM Reputation badge */}
              <div className="px-2.5 py-1 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200 dark:border-violet-800/50 text-xs font-bold text-violet-700 dark:text-violet-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                <span>{reputationPoints} FM</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 block mb-0.5">Оценка склада</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100">
                ₽ {inventoryValuation.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                {inventory.filter(i => i.status !== 'sold').length} предметов
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Склад</span>
                <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 font-mono">
                  {usedWarehouseSlots}/{maxWarehouseSlots}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden my-1">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    usedWarehouseSlots >= maxWarehouseSlots ? 'bg-rose-500' : 'bg-blue-600 dark:bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (usedWarehouseSlots / (maxWarehouseSlots || 1)) * 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-slate-400 block">
                {maxWarehouseSlots - usedWarehouseSlots} свободных мест
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. ACTIVE MARKET EVENT ALERT (If active) */}
      {currentEvent && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950/40 dark:to-violet-950/40 border border-blue-200 dark:border-blue-850 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-blue-900 dark:text-blue-200 uppercase tracking-wider">
                {currentEvent.title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 line-clamp-2">
                {currentEvent.description}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-violet-700 dark:text-violet-300 bg-white/80 dark:bg-violet-900/60 px-2.5 py-1 rounded-xl border border-violet-200 dark:border-violet-700 shrink-0">
            {currentEvent.durationDays} дн.
          </span>
        </div>
      )}

      {/* 3. QUICK NAVIGATION TILES */}
      <div className="space-y-2.5">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Быстрый доступ
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Рынок */}
          <button
            onClick={() => setCurrentTab('market')}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#131C31] hover:bg-slate-50 dark:hover:bg-[#18233C] border border-slate-200/90 dark:border-slate-800 transition-all text-left flex flex-col justify-between h-24 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Store className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {marketListings.length}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                Рынок
              </div>
              <div className="text-[10px] text-slate-400">Объявления</div>
            </div>
          </button>

          {/* Аукционы */}
          <button
            onClick={() => setCurrentTab('auctions')}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#131C31] hover:bg-slate-50 dark:hover:bg-[#18233C] border border-slate-200/90 dark:border-slate-800 transition-all text-left flex flex-col justify-between h-24 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
                <Gavel className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                LIVE
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                Аукционы
              </div>
              <div className="text-[10px] text-slate-400">{auctions.length} активных</div>
            </div>
          </button>

          {/* Инвентарь */}
          <button
            onClick={() => setCurrentTab('warehouse')}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#131C31] hover:bg-slate-50 dark:hover:bg-[#18233C] border border-slate-200/90 dark:border-slate-800 transition-all text-left flex flex-col justify-between h-24 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {usedWarehouseSlots}
              </span>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                Склад
              </div>
              <div className="text-[10px] text-slate-400">Управление</div>
            </div>
          </button>

          {/* Клиенты */}
          <button
            onClick={() => setCurrentTab('clients')}
            className="p-3.5 rounded-2xl bg-white dark:bg-[#131C31] hover:bg-slate-50 dark:hover:bg-[#18233C] border border-slate-200/90 dark:border-slate-800 transition-all text-left flex flex-col justify-between h-24 group cursor-pointer shadow-xs"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Users className="w-4 h-4" />
              </div>
              {pendingOrders > 0 && (
                <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300">
                  {pendingOrders}
                </span>
              )}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Заказы
              </div>
              <div className="text-[10px] text-slate-400">Клиентские VIP</div>
            </div>
          </button>
        </div>
      </div>

      {/* 4. HOT DEALS CAROUSEL/LIST (Touch-friendly cards) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between px-1">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Выгодные сделки дня
          </div>
          <button
            onClick={() => setCurrentTab('market')}
            className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>Все лоты</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {hotDeals.map(listing => {
            const potentialProfit = listing.currentMarketPrice - listing.sellerAskingPrice - listing.shippingCost;

            return (
              <div
                key={listing.id}
                className="p-4 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-[#18233C] border border-slate-200 dark:border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                    <ProductImage 
                      src={listing.image} 
                      alt={listing.title}
                      category={listing.category}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Title & Conditions */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {listing.brand}
                      </span>
                      <span className="text-[10px] font-medium text-slate-400">
                        {CONDITION_LABELS[listing.condition]?.label || listing.condition}
                      </span>
                    </div>

                    <h4 
                      onClick={() => setSelectedMarketItem(listing)}
                      className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {listing.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                      «{listing.sellerNote}»
                    </p>
                  </div>
                </div>

                {/* Pricing & Profit Strip */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Цена продавца</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      ₽ {listing.sellerAskingPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Потенц. маржа</span>
                    <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      +{potentialProfit.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                {/* Actions: Quick Bargain & Buy buttons */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => startNegotiation(listing.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors touch-manipulation cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                    <span>Торговаться</span>
                  </button>

                  <button
                    onClick={() => buyItem(listing.id)}
                    disabled={balance < (listing.sellerAskingPrice + listing.shippingCost)}
                    className="py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm shadow-blue-500/20 touch-manipulation cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Купить сразу</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
