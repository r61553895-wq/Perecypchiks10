import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  AlertTriangle, 
  TrendingUp, 
  Flame, 
  Check, 
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ItemCategory, ItemCondition, DemandLevel, MarketListing } from '../../types';
import { CATEGORY_LABELS, CONDITION_LABELS, DEMAND_LABELS, SELLER_ARCHETYPES, SELLER_MOODS } from '../../data/catalog';

export const MarketView: React.FC = () => {
  const { 
    marketListings, 
    balance, 
    startNegotiation,
    setSelectedMarketItem, 
    currentCommissionRate,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
  const [selectedCondition, setSelectedCondition] = useState<ItemCondition | 'all'>('all');
  const [selectedDemand, setSelectedDemand] = useState<DemandLevel | 'all'>('all');
  const [onlyBargains, setOnlyBargains] = useState(false);
  const [sortBy, setSortBy] = useState<'profit_desc' | 'price_asc' | 'price_desc' | 'margin_desc'>('profit_desc');

  // Filtered & Sorted Listings
  const filteredListings = useMemo(() => {
    return marketListings
      .filter(item => {
        if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) && !item.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
        if (selectedCondition !== 'all' && item.condition !== selectedCondition) {
          return false;
        }
        if (selectedDemand !== 'all' && item.demand !== selectedDemand) {
          return false;
        }
        if (onlyBargains && !item.isBargainDeal) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const feeA = Math.round(a.currentMarketPrice * currentCommissionRate);
        const profitA = a.currentMarketPrice - a.sellerAskingPrice - feeA - a.shippingCost;
        const marginA = profitA / a.currentMarketPrice;

        const feeB = Math.round(b.currentMarketPrice * currentCommissionRate);
        const profitB = b.currentMarketPrice - b.sellerAskingPrice - feeB - b.shippingCost;
        const marginB = profitB / b.currentMarketPrice;

        if (sortBy === 'profit_desc') return profitB - profitA;
        if (sortBy === 'margin_desc') return marginB - marginA;
        if (sortBy === 'price_asc') return a.sellerAskingPrice - b.sellerAskingPrice;
        if (sortBy === 'price_desc') return b.sellerAskingPrice - a.sellerAskingPrice;
        return 0;
      });
  }, [marketListings, searchQuery, selectedCategory, selectedCondition, selectedDemand, onlyBargains, sortBy, currentCommissionRate]);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Controls Bar: Search, Category Tabs, and Quick Filters */}
      <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs space-y-3">
        {/* Row 1: Search, Sorting, Only Bargains toggle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Поиск по названию или бренду..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {/* Bargain highlight toggle */}
            <button
              onClick={() => setOnlyBargains(!onlyBargains)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors whitespace-nowrap ${
                onlyBargains 
                  ? 'bg-zinc-900 text-white border-zinc-900' 
                  : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${onlyBargains ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>Только выгодные дилы</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 border border-zinc-200 rounded-lg px-2.5 py-1.5 bg-white text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-zinc-700 font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="profit_desc">Потенциальная прибыль ↓</option>
                <option value="margin_desc">Маржинальность % ↓</option>
                <option value="price_asc">Цена покупки ↑</option>
                <option value="price_desc">Цена покупки ↓</option>
              </select>
            </div>
          </div>
        </div>

        {/* Row 2: Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-zinc-100 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
              selectedCategory === 'all' 
                ? 'bg-zinc-900 text-white' 
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            Все категории ({marketListings.length})
          </button>
          {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
            const count = marketListings.filter(m => m.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey as ItemCategory)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === catKey 
                    ? 'bg-zinc-900 text-white' 
                    : 'text-zinc-600 hover:bg-zinc-100'
                }`}
              >
                {label} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Listings Grid (Compact & Clear as requested) */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-zinc-200">
          <ShoppingBag className="w-8 h-8 mx-auto text-zinc-300 mb-2" />
          <div className="text-sm font-semibold text-zinc-800">Предложений не найдено</div>
          <div className="text-xs text-zinc-500 mt-1">Попробуйте изменить параметры фильтров или перейдите к следующему дню</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {filteredListings.map(item => {
            const fee = Math.round(item.currentMarketPrice * currentCommissionRate);
            const netProfit = item.currentMarketPrice - item.sellerAskingPrice - fee - item.shippingCost;
            const margin = Math.round((netProfit / item.currentMarketPrice) * 100);
            const canAfford = balance >= item.sellerAskingPrice;
            const hasSlot = usedWarehouseSlots < maxWarehouseSlots;

            return (
              <div
                key={item.id}
                className="group relative p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer"
                onClick={() => setSelectedMarketItem(item)}
              >
                {/* Top: Image, Badges, Title */}
                <div>
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 rounded-lg bg-zinc-100 border border-zinc-200/70 overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                      {item.isBargainDeal && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-emerald-600 text-white tracking-tight shadow-xs">
                          Выгодно
                        </div>
                      )}
                      {item.isOverpriced && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-600 text-white tracking-tight shadow-xs">
                          Риск
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                          {item.brand}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${CONDITION_LABELS[item.condition].badgeColor}`}>
                          {CONDITION_LABELS[item.condition].label}
                        </span>
                      </div>

                      <h3 className="text-xs font-semibold text-zinc-900 truncate group-hover:text-zinc-700 leading-snug">
                        {item.title}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1.5 flex-wrap text-[11px] text-zinc-500">
                        <span className="flex items-center gap-1">
                          Спрос:
                          <span className={`px-1 rounded text-[10px] font-medium border ${DEMAND_LABELS[item.demand].badgeColor}`}>
                            {DEMAND_LABELS[item.demand].label}
                          </span>
                        </span>
                      </div>

                      {/* Seller Profile Badges */}
                      <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${SELLER_ARCHETYPES[item.sellerArchetype]?.badgeColor || 'text-zinc-600 bg-zinc-50 border-zinc-200'}`}>
                          {SELLER_ARCHETYPES[item.sellerArchetype]?.label || 'Продавец'}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] border ${SELLER_MOODS[item.sellerMood]?.badgeColor || 'text-zinc-600 bg-zinc-50 border-zinc-200'}`}>
                          {SELLER_MOODS[item.sellerMood]?.label || 'Спокойный'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Comparison Box */}
                  <div className="mt-3 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-zinc-500">Цена продавца:</div>
                      <div className="font-mono font-bold text-zinc-900 text-sm">
                        {item.sellerAskingPrice.toLocaleString()} ₽
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-zinc-500">Рыночная цена:</div>
                      <div className="font-mono font-medium text-zinc-600 text-sm">
                        ~{item.currentMarketPrice.toLocaleString()} ₽
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom: Profit Calculation & Action */}
                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-zinc-500">Ожид. чистая прибыль</div>
                    <div className={`text-xs font-bold font-mono flex items-center gap-1 ${
                      netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      <span>{netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽</span>
                      <span className="text-[10px] font-normal text-zinc-400">({margin}%)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedMarketItem(item);
                      }}
                      className="px-2.5 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors"
                      title="Подробный расчет"
                    >
                      Анализ
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startNegotiation(item.id);
                      }}
                      disabled={!hasSlot}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                        !hasSlot
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 cursor-not-allowed'
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-2xs active:scale-98'
                      }`}
                      title={!hasSlot ? 'Склад полон' : 'Перейти к переговорам'}
                    >
                      {!hasSlot ? 'Склад полон' : 'Предложить цену'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
