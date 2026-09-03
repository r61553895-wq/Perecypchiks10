import React from 'react';
import { X, ShoppingBag, TrendingUp, AlertCircle, Sparkles, Check, Truck, Percent, Info } from 'lucide-react';
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
  const marginPercent = Math.round((netProfit / item.currentMarketPrice) * 100);
  const canAfford = balance >= item.sellerAskingPrice;
  const hasSlot = usedWarehouseSlots < maxWarehouseSlots;

  // Generate a realistic 7-day sparkline history around current market price
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
  const sparkHeight = 60;
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

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Title & Close */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-400">
                {CATEGORY_LABELS[item.category]} • {item.brand}
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${CONDITION_LABELS[item.condition].badgeColor}`}>
                {CONDITION_LABELS[item.condition].label}
              </span>
            </div>
            <h2 className="text-base font-bold text-zinc-900 leading-tight">{item.title}</h2>
          </div>
          <button
            onClick={() => setSelectedMarketItem(null)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {/* Top preview row */}
          <div className="flex gap-4 items-center">
            <div className="w-24 h-24 rounded-xl bg-zinc-900 border border-zinc-200 overflow-hidden shrink-0">
              <ProductImage 
                src={item.image} 
                alt={item.title} 
                title={item.title}
                category={item.category}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 text-xs space-y-1.5">
              <div className="text-zinc-600 italic">
                «{item.sellerNote}»
              </div>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-zinc-500">
                <span>Спрос на рынке:</span>
                <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${DEMAND_LABELS[item.demand].badgeColor}`}>
                  {DEMAND_LABELS[item.demand].label}
                </span>
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                Осталось на площадке: {item.daysRemaining} дн.
              </div>
            </div>
          </div>

          {/* Detailed Financial Breakdown (Strictly as specified in Prompt) */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2.5 text-xs">
            <div className="flex justify-between items-center text-zinc-600">
              <span>Цена продавца:</span>
              <span className="font-mono font-bold text-zinc-900 text-sm">{item.sellerAskingPrice.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center text-zinc-600">
              <span>Рыночная цена:</span>
              <span className="font-mono font-semibold text-zinc-700">{item.currentMarketPrice.toLocaleString()} ₽</span>
            </div>
            
            <div className="pt-2 border-t border-zinc-200/60 flex justify-between items-center text-zinc-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Percent className="w-3 h-3 text-zinc-400" />
                Комиссия площадки ({(currentCommissionRate * 100).toFixed(1)}%):
              </span>
              <span className="font-mono">−{fee.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between items-center text-zinc-500 text-[11px]">
              <span className="flex items-center gap-1">
                <Truck className="w-3 h-3 text-zinc-400" />
                Доставка покупателю:
              </span>
              <span className="font-mono">−{item.shippingCost.toLocaleString()} ₽</span>
            </div>

            {/* Total Net Profit */}
            <div className="pt-2.5 border-t border-zinc-200 flex justify-between items-center">
              <div>
                <div className="text-xs font-semibold text-zinc-900">Итоговая чистая прибыль:</div>
                <div className="text-[10px] text-zinc-400">При перепродаже по рынку</div>
              </div>
              <div className={`text-base font-bold font-mono ${
                netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
                <span className="text-xs font-normal text-zinc-500 ml-1">({marginPercent}%)</span>
              </div>
            </div>
          </div>

          {/* Price History Sparkline */}
          <div className="p-3 rounded-lg border border-zinc-100 bg-white">
            <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-1.5">
              <span>История рыночной цены (7 дней)</span>
              <span className="font-mono text-zinc-700">~{item.currentMarketPrice.toLocaleString()} ₽</span>
            </div>
            <div className="w-full h-12 flex items-center justify-center">
              <svg viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} className="w-full h-full">
                <polyline
                  fill="none"
                  stroke="#18181b"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
          <div className="text-xs text-zinc-500">
            {!canAfford ? (
              <span className="text-amber-600 font-medium">Недостаточно баланса ({balance.toLocaleString()} ₽)</span>
            ) : !hasSlot ? (
              <span className="text-amber-600 font-medium">Склад переполнен ({usedWarehouseSlots}/{maxWarehouseSlots})</span>
            ) : (
              <span>Товар сразу поступит на склад</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedMarketItem(null)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => {
                const id = item.id;
                setSelectedMarketItem(null);
                startNegotiation(id);
              }}
              disabled={!hasSlot}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !hasSlot
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
              }`}
            >
              Предложить цену
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
