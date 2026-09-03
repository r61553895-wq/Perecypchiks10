import React, { useState, useEffect } from 'react';
import { X, Tag, TrendingUp, AlertTriangle, CheckCircle2, Percent, Truck, Gauge } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductImage } from '../ProductImage';

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

  const priceRatio = item.currentMarketPrice > 0 ? price / item.currentMarketPrice : 1;
  let attractiveness: { label: string; subtext: string; color: string; speedDesc: string };

  if (priceRatio <= 0.85) {
    attractiveness = {
      label: 'Быстрая продажа',
      subtext: 'Дисконт ниже рынка. Ожидается продажа за 1–2 дня.',
      color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800',
      speedDesc: 'Высокий спрос'
    };
  } else if (priceRatio <= 1.05) {
    attractiveness = {
      label: 'Оптимальная цена',
      subtext: 'Сбалансированная маржа. Продажа за 2–4 дня.',
      color: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800',
      speedDesc: 'Средний темп'
    };
  } else if (priceRatio <= 1.2) {
    attractiveness = {
      label: 'Повышенная наценка',
      subtext: 'Высокая прибыль, но покупатели думают 4–7 дней.',
      color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800',
      speedDesc: 'Медленно'
    };
  } else {
    attractiveness = {
      label: 'Завышенная цена',
      subtext: 'Риск долгого простоя на складе.',
      color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800',
      speedDesc: 'Высокий риск'
    };
  }

  const handlePreset = (ratio: number) => {
    setPrice(Math.round(item.currentMarketPrice * ratio));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (price <= 0) return;
    listItemForSale(item.id, price);
    setListingModalItem(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-md bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Назначить цену продажи</h2>
          </div>
          <button 
            onClick={() => setListingModalItem(null)}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 text-xs overflow-y-auto">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 rounded-xl shrink-0 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden p-1 flex items-center justify-center">
              <ProductImage 
                src={item.image} 
                alt={item.title} 
                title={item.title}
                category={item.category}
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                {item.title}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Закупка: ₽{item.purchasePrice.toLocaleString()} • Рынок: ₽{item.currentMarketPrice.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Быстрый выбор стратегии
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handlePreset(0.85)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 text-xs"
              >
                -15%
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1.0)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 text-xs"
              >
                Рынок
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1.1)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 text-xs"
              >
                +10%
              </button>
              <button
                type="button"
                onClick={() => handlePreset(1.25)}
                className="py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 text-xs"
              >
                +25%
              </button>
            </div>
          </div>

          {/* Custom Price Input */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Цена для покупателя (₽)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">₽</span>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full pl-8 pr-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-base focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Attractiveness card */}
          <div className={`p-3 rounded-2xl border ${attractiveness.color} space-y-1`}>
            <div className="flex items-center justify-between font-bold">
              <span>{attractiveness.label}</span>
              <span className="text-[11px] uppercase font-mono">{attractiveness.speedDesc}</span>
            </div>
            <p className="text-[11px] leading-relaxed opacity-90">
              {attractiveness.subtext}
            </p>
          </div>

          {/* Calculation breakdown */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Комиссия площадки ({Math.round(currentCommissionRate * 100)}%):</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">₽ {commissionFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400">
              <span>Доставка:</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">₽ {shippingFee.toLocaleString()}</span>
            </div>
            <div className="pt-1 border-t border-slate-200/60 dark:border-slate-700 flex justify-between font-bold text-xs">
              <span className="text-slate-900 dark:text-white">Чистая прибыль:</span>
              <span className={`font-mono ${netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽ ({marginPercent}%)
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={price <= 0}
            className="w-full h-12 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-blue-500/20 touch-manipulation cursor-pointer"
          >
            Подтвердить и выставить на продажу
          </button>
        </form>
      </div>
    </div>
  );
};
