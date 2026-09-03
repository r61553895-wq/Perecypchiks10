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
  ShoppingCart,
  ShieldCheck,
  Zap,
  MessageSquare,
  Package,
  Info
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ItemCategory, ItemCondition, DemandLevel, MarketListing } from '../../types';
import { CATEGORY_LABELS, CONDITION_LABELS, DEMAND_LABELS, SELLER_ARCHETYPES, SELLER_MOODS } from '../../data/catalog';
import { ProductImage } from '../ProductImage';

export const MarketView: React.FC = () => {
  const { 
    marketListings, 
    balance, 
    startNegotiation,
    buyItem,
    setSelectedMarketItem, 
    currentCommissionRate,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'all'>('all');
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
        if (onlyBargains && !item.isBargainDeal) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const feeA = Math.round(a.currentMarketPrice * currentCommissionRate);
        const profitA = a.currentMarketPrice - a.sellerAskingPrice - feeA - a.shippingCost;
        const marginA = profitA / (a.currentMarketPrice || 1);

        const feeB = Math.round(b.currentMarketPrice * currentCommissionRate);
        const profitB = b.currentMarketPrice - b.sellerAskingPrice - feeB - b.shippingCost;
        const marginB = profitB / (b.currentMarketPrice || 1);

        if (sortBy === 'profit_desc') return profitB - profitA;
        if (sortBy === 'margin_desc') return marginB - marginA;
        if (sortBy === 'price_asc') return a.sellerAskingPrice - b.sellerAskingPrice;
        if (sortBy === 'price_desc') return b.sellerAskingPrice - a.sellerAskingPrice;
        return 0;
      });
  }, [marketListings, searchQuery, selectedCategory, onlyBargains, sortBy, currentCommissionRate]);

  const hasSlot = usedWarehouseSlots < maxWarehouseSlots;

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Search and Filter Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Поиск по марке или названию (iPhone, Sony...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Все
          </button>
          {Object.entries(CATEGORY_LABELS).map(([k, label]) => (
            <button
              key={k}
              onClick={() => setSelectedCategory(k as ItemCategory)}
              className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === k
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Sort and Quick Filter Options */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
              aria-label="Сортировка"
            >
              <option value="profit_desc">Прибыль ↓</option>
              <option value="margin_desc">Маржа % ↓</option>
              <option value="price_asc">Цена ↑</option>
              <option value="price_desc">Цена ↓</option>
            </select>

            <button
              onClick={() => setOnlyBargains(!onlyBargains)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                onlyBargains 
                  ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Скидки</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Лотов: {filteredListings.length}
          </span>
        </div>
      </div>

      {/* Warehouse full warning */}
      {!hasSlot && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Склад переполнен! Освободите место или прокачайте склад для покупки новых товаров.</span>
        </div>
      )}

      {/* Listings List */}
      <div className="space-y-3">
        {filteredListings.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800">
            <Package className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-slate-700 dark:text-slate-300">Лоты не найдены</div>
            <div className="text-xs text-slate-400 mt-1">Попробуйте сбросить фильтры или перейти к следующему дню</div>
          </div>
        ) : (
          filteredListings.map(listing => {
            const fee = Math.round(listing.currentMarketPrice * currentCommissionRate);
            const netProfit = listing.currentMarketPrice - listing.sellerAskingPrice - fee - listing.shippingCost;
            const marginPercent = Math.round((netProfit / (listing.currentMarketPrice || 1)) * 100);
            const canAfford = balance >= (listing.sellerAskingPrice + listing.shippingCost);

            return (
              <div
                key={listing.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/60 transition-all space-y-3 shadow-xs"
              >
                <div className="flex items-start gap-3">
                  {/* Image with zoom on click */}
                  <div 
                    onClick={() => setSelectedMarketItem(listing)}
                    className="w-20 h-20 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center p-1 cursor-pointer"
                  >
                    <ProductImage 
                      src={listing.image} 
                      alt={listing.title}
                      category={listing.category}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info Header */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {listing.brand}
                      </span>
                      <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                        {CONDITION_LABELS[listing.condition]?.label || listing.condition}
                      </span>
                      {listing.isBargainDeal && (
                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.2 rounded-md">
                          ТОП ЦЕНА
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => setSelectedMarketItem(listing)}
                      className="text-sm font-bold text-slate-900 dark:text-white truncate cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                    >
                      {listing.title}
                    </h3>

                    {/* Seller Note Quote */}
                    <p className="text-xs text-slate-500 dark:text-slate-400 italic line-clamp-1 mt-0.5">
                      «{listing.sellerNote}»
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                      <span>{SELLER_ARCHETYPES[listing.sellerArchetype]?.label || 'Продавец'}</span>
                      <span>•</span>
                      <span>{SELLER_MOODS[listing.sellerMood]?.label || 'Спокойный'}</span>
                    </div>
                  </div>
                </div>

                {/* Price Matrix Strip */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Просит</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
                      ₽ {listing.sellerAskingPrice.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Рыночная</span>
                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300 font-mono">
                      ₽ {listing.currentMarketPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Чистая выгода</span>
                    <span className={`text-sm font-black font-mono ${
                      netProfit > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
                    }`}>
                      {netProfit > 0 ? `+${netProfit.toLocaleString()} ₽` : `${netProfit.toLocaleString()} ₽`}
                    </span>
                  </div>
                </div>

                {/* Action Buttons: Touch-friendly large targets (44px min-height) */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => startNegotiation(listing.id)}
                    className="h-11 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors touch-manipulation cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    <span>Торговаться</span>
                  </button>

                  <button
                    onClick={() => buyItem(listing.id)}
                    disabled={!canAfford || !hasSlot}
                    className="h-11 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 touch-manipulation cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Купить за ₽{listing.sellerAskingPrice.toLocaleString()}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
