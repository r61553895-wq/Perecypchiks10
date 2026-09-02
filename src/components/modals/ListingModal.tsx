import React, { useState, useEffect } from 'react';
import { X, Tag, TrendingUp, AlertTriangle, CheckCircle2, Percent, Truck, Gauge } from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ListingModal: React.FC = () => {
  const { 
    listingModalItem, 
    setListingModalItem, 
    listItemForSale, 
    currentCommissionRate 
  } = useGame();

  const [price, setPrice] = useState<number>(0);

  useEffect(() => {
    if (listingModalItem) {
      setPrice(listingModalItem.listingPrice || listingModalItem.currentMarketPrice);
    }
  }, [listingModalItem]);

  if (!listingModalItem) return null;

  const item = listingModalItem;
  const commissionFee = Math.round(price * currentCommissionRate);
  const shippingFee = item.shippingCost;
  const netProfit = price - item.purchasePrice - commissionFee - shippingFee;
  const marginPercent = price > 0 ? Math.round((netProfit / price) * 100) : 0;

  // Price attractiveness rating
  const priceRatio = item.currentMarketPrice > 0 ? price / item.currentMarketPrice : 1;
  let attractiveness: { label: string; subtext: string; color: string; speedDesc: string };

  if (priceRatio <= 0.85) {
    attractiveness = {
      label: 'Высокая привлекательность',
      subtext: 'Дисконт ниже рынка. Ожидаемая скорость продажи: 1–2 дня.',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      speedDesc: 'Быстрая продажа'
    };
  } else if (priceRatio <= 1.05) {
    attractiveness = {
      label: 'Оптимальная рыночная цена',
      subtext: 'Сбалансированная маржа. Ожидаемая скорость продажи: 2–4 дня.',
      color: 'text-sky-700 bg-sky-50 border-sky-200',
      speedDesc: 'Умеренная скорость'
    };
  } else if (priceRatio <= 1.2) {
    attractiveness = {
      label: 'Повышенная наценка',
      subtext: 'Высокая прибыль, но покупатели могут раздумывать: 4–7 дней.',
      color: 'text-amber-700 bg-amber-50 border-amber-200',
      speedDesc: 'Медленная продажа'
    };
  } else {
    attractiveness = {
      label: 'Существенно завышена',
      subtext: 'Риск долгого зависания товара на витрине и потери актуальности.',
      color: 'text-rose-700 bg-rose-50 border-rose-200',
      speedDesc: 'Высокий риск'
    };
  }

  const handleConfirm = () => {
    if (price <= 0) return;
    listItemForSale(item.id, price);
    setListingModalItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-md rounded-2xl bg-white border border-zinc-200 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-zinc-900" />
            <h2 className="text-sm font-bold text-zinc-900">Выставление товара на продажу</h2>
          </div>
          <button
            onClick={() => setListingModalItem(null)}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {/* Item Mini Header */}
          <div className="flex items-center gap-3">
            <img 
              src={item.image} 
              alt={item.title} 
              className="w-12 h-12 rounded-lg bg-zinc-100 object-cover border border-zinc-200 shrink-0" 
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-zinc-900 truncate">{item.title}</div>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                Закупка: {item.purchasePrice.toLocaleString()} ₽ • Рынок: ~{item.currentMarketPrice.toLocaleString()} ₽
              </div>
            </div>
          </div>

          {/* Price Input Controls */}
          <div>
            <label className="block text-xs font-medium text-zinc-700 mb-1.5">
              Цена продажи (₽):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-400 font-bold">
                ₽
              </span>
              <input
                type="number"
                min="1"
                step="100"
                value={price}
                onChange={e => setPrice(Math.max(1, Number(e.target.value)))}
                className="w-full pl-8 pr-4 py-2 rounded-xl border border-zinc-300 font-mono text-base font-bold text-zinc-900 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 bg-white"
              />
            </div>

            {/* Quick Price Presets */}
            <div className="mt-2 flex items-center gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setPrice(Math.round(item.currentMarketPrice * 0.9))}
                className="px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Быстро (-10%)
              </button>
              <button
                type="button"
                onClick={() => setPrice(item.currentMarketPrice)}
                className="px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Рыночная (100%)
              </button>
              <button
                type="button"
                onClick={() => setPrice(Math.round(item.currentMarketPrice * 1.1))}
                className="px-2.5 py-1 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 transition-colors"
              >
                Макс (+10%)
              </button>
            </div>
          </div>

          {/* Breakdown Box (Strictly matches the prompt structure) */}
          <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200/80 space-y-2 text-xs">
            <div className="flex justify-between text-zinc-600">
              <span>Цена покупки:</span>
              <span className="font-mono text-zinc-900">{item.purchasePrice.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Рыночная цена:</span>
              <span className="font-mono text-zinc-700">{item.currentMarketPrice.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-zinc-500 text-[11px] pt-1.5 border-t border-zinc-200/60">
              <span>Комиссия площадки ({(currentCommissionRate * 100).toFixed(1)}%):</span>
              <span className="font-mono">−{commissionFee.toLocaleString()} ₽</span>
            </div>
            <div className="flex justify-between text-zinc-500 text-[11px]">
              <span>Доставка:</span>
              <span className="font-mono">−{shippingFee.toLocaleString()} ₽</span>
            </div>
            <div className="pt-2 border-t border-zinc-200 flex justify-between items-center">
              <span className="font-semibold text-zinc-900">Ожидаемая прибыль:</span>
              <span className={`font-mono text-sm font-bold ${
                netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
                <span className="text-[10px] font-normal text-zinc-500 ml-1">({marginPercent}%)</span>
              </span>
            </div>
          </div>

          {/* Buyer Attractiveness Indicator */}
          <div className={`p-3 rounded-xl border ${attractiveness.color}`}>
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Gauge className="w-3.5 h-3.5" />
              <span>{attractiveness.label}</span>
            </div>
            <div className="text-[11px] mt-0.5 leading-relaxed opacity-90">
              {attractiveness.subtext}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-zinc-50 border-t border-zinc-100 flex items-center justify-end gap-2">
          <button
            onClick={() => setListingModalItem(null)}
            className="px-3.5 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-100 text-xs font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs"
          >
            Выставить на продажу
          </button>
        </div>
      </div>
    </div>
  );
};
