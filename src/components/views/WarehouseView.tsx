import React from 'react';
import { 
  Package, 
  Tag, 
  RotateCcw, 
  Zap, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  PlusCircle,
  ShoppingBag,
  Store,
  Sparkles,
  Building2,
  Users
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CONDITION_LABELS, DEMAND_LABELS } from '../../data/catalog';
import { InventoryItem } from '../../types';
import { ProductImage } from '../ProductImage';

export const WarehouseView: React.FC = () => {
  const { 
    inventory, 
    setListingModalItem, 
    unlistItem, 
    quickSellWholesale, 
    currentCommissionRate,
    usedWarehouseSlots,
    maxWarehouseSlots,
    setCurrentTab
  } = useGame();

  const activeItems = inventory.filter(i => i.status !== 'sold');

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Sub-navigation Switcher: Склад, Шоурум, Клиенты */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131C31] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          className="flex-1 py-2 px-3 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Склад ({activeItems.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('showroom')}
          className="flex-1 py-2 px-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Шоурум</span>
        </button>

        <button
          onClick={() => setCurrentTab('clients')}
          className="flex-1 py-2 px-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Клиенты</span>
        </button>
      </div>

      {/* Warehouse Capacity Card */}
      <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Вместимость склада
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Занято {usedWarehouseSlots} из {maxWarehouseSlots} ячеек
              </span>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('upgrades')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            + Места
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              usedWarehouseSlots >= maxWarehouseSlots 
                ? 'bg-rose-500' 
                : 'bg-blue-600 dark:bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, (usedWarehouseSlots / (maxWarehouseSlots || 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Warehouse Items List */}
      {activeItems.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white dark:bg-[#131C31] rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3">
          <Package className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600" />
          <div className="text-base font-bold text-slate-800 dark:text-slate-200">Склад пуст</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
            Приобретайте товары на рынке или аукционах, чтобы выставлять их с высокой маржой!
          </p>
          <div className="pt-2 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentTab('market')}
              className="px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all cursor-pointer"
            >
              Перейти на рынок
            </button>
            <button
              onClick={() => setCurrentTab('auctions')}
              className="px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              Аукционы
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {activeItems.map(item => {
            const isListed = item.status === 'listed';
            const fee = Math.round((item.listingPrice || item.currentMarketPrice) * currentCommissionRate);
            const expectedProfit = (item.listingPrice || item.currentMarketPrice) - item.purchasePrice - fee - item.shippingCost;

            return (
              <div 
                key={item.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-800/60 shadow-xs transition-all space-y-3"
              >
                {/* Header info */}
                <div className="flex gap-3 items-start">
                  <div className="relative w-18 h-18 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shrink-0 p-1 flex items-center justify-center">
                    <ProductImage 
                      src={item.image} 
                      alt={item.title}
                      title={item.title}
                      category={item.category}
                      className="w-full h-full object-contain"
                    />
                    {isListed && (
                      <div className="absolute top-1 left-1 z-30 px-1.5 py-0.2 rounded-md text-[9px] font-black bg-blue-600 text-white shadow-xs">
                        Витрина
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {CONDITION_LABELS[item.condition]?.label || item.condition}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {item.daysInWarehouse} дн. на складе
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h3>

                    <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                      <span>Спрос:</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {DEMAND_LABELS[item.demand]?.label || item.demand}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial overview strip */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Закупка</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white text-xs">
                      ₽ {item.purchasePrice.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Рынок</span>
                    <span className="font-mono text-slate-600 dark:text-slate-300 text-xs">
                      ₽ {item.currentMarketPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Профит</span>
                    <span className={`font-mono font-black text-xs ${expectedProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}`}>
                      {expectedProfit >= 0 ? '+' : ''}{expectedProfit.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                {/* Touch Actions */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => quickSellWholesale(item.id)}
                    className="h-11 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer touch-manipulation"
                    title="Сдать скупщику по оптовой цене (быстрая ликвидность)"
                  >
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Сдать оптом</span>
                  </button>

                  {isListed ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => unlistItem(item.id)}
                        className="h-11 px-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                        title="Снять с витрины"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setListingModalItem(item)}
                        className="flex-1 h-11 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer touch-manipulation"
                      >
                        Изменить ₽
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setListingModalItem(item)}
                      className="h-11 px-3 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer touch-manipulation"
                    >
                      Выставить на продажу
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
