import React from 'react';
import { X, TrendingUp, AlertCircle, Sparkles, Check, Truck, Percent, Info, MessageSquare, ShoppingCart } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CATEGORY_LABELS, CONDITION_LABELS, DEMAND_LABELS } from '../../data/catalog';
import { ProductImage } from '../ProductImage';

export const ProductDetailModal: React.FC = () => {
  const { 
    selectedMarketItem, 
    setSelectedMarketItem, 
    startNegotiation, 
    buyItem, 
    balance, 
    currentCommissionRate,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  if (!selectedMarketItem) return null;

  const item = selectedMarketItem;
  const fee = Math.round(item.currentMarketPrice * currentCommissionRate);
  const netProfit = item.currentMarketPrice - item.sellerAskingPrice - fee - item.shippingCost;
  const marginPercent = Math.round((netProfit / (item.currentMarketPrice || 1)) * 100);
  const canAfford = balance >= item.sellerAskingPrice;
  const hasSlot = usedWarehouseSlots < maxWarehouseSlots;

  // 7-day sparkline history
  const priceHistory = [
    Math.round(item.currentMarketPrice * 0.94),
    Math.round(item.currentMarketPrice * 0.96),
    Math.round(item.currentMarketPrice * 0.99),
    Math.round(item.currentMarketPrice * 0.97),
    Math.round(item.currentMarketPrice * 1.02),
    Math.round(item.currentMarketPrice * 1.01),
    item.currentMarketPrice
  ];

  const minP = Math.min(...priceHistory) * 0.96;
  const maxP = Math.max(...priceHistory) * 1.04;
  const range = maxP - minP || 1;

  const sparkWidth = 280;
  const sparkHeight = 50;
  const points = priceHistory.map((val, idx) => {
    const x = (idx / (priceHistory.length - 1)) * sparkWidth;
    const y = sparkHeight - ((val - minP) / range) * sparkHeight;
    return `${x},${y}`;
  }).join(' ');

  const handleBuy = () => {
    const success = buyItem(item.id);
    if (success) {
      setSelectedMarketItem(null);
    }
  };

  const handleNegotiate = () => {
    const id = item.id;
    setSelectedMarketItem(null);
    startNegotiation(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {CATEGORY_LABELS[item.category] || item.category}
          </span>
          <button 
            onClick={() => setSelectedMarketItem(null)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs">
          {/* Main Image */}
          <div className="w-full h-44 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-center p-3">
            <ProductImage 
              src={item.image} 
              alt={item.title} 
              title={item.title} 
              category={item.category} 
              className="w-full h-full object-contain" 
            />
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {item.brand}
              </span>
              <span className="text-[10px] font-medium text-slate-500">
                {CONDITION_LABELS[item.condition]?.label || item.condition}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              {item.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-1 leading-relaxed">
              «{item.sellerNote}»
            </p>
          </div>

          {/* Price Graph Sparkline */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-bold text-slate-500 dark:text-slate-400">Тренд цены (7 дней)</span>
              <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">
                ₽ {item.currentMarketPrice.toLocaleString()}
              </span>
            </div>
            <div className="w-full flex justify-center pt-1">
              <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="w-full h-12 overflow-visible">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Цена продавца:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                ₽ {item.sellerAskingPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Рыночная стоимость:</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                ₽ {item.currentMarketPrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Комиссия + Доставка:</span>
              <span className="font-mono text-slate-500">
                ₽ {(fee + item.shippingCost).toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-700 flex justify-between font-bold text-xs">
              <span className="text-slate-900 dark:text-white">Чистая выгода:</span>
              <span className={`font-mono ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽ ({marginPercent}%)
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleNegotiate}
              className="h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Торговаться</span>
            </button>

            <button
              onClick={handleBuy}
              disabled={!canAfford || !hasSlot}
              className="h-11 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Купить</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
