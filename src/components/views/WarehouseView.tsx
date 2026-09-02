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
  ShoppingBag
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CONDITION_LABELS, DEMAND_LABELS } from '../../data/catalog';
import { InventoryItem } from '../../types';

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
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Warehouse Capacity Bar & Info */}
      <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-900">Загрузка склада</div>
            <div className="text-[11px] text-zinc-500">
              Занято {usedWarehouseSlots} из {maxWarehouseSlots} доступных ячеек
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Bar */}
          <div className="w-40 h-2 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/60">
            <div 
              className={`h-full transition-all duration-300 ${
                usedWarehouseSlots >= maxWarehouseSlots 
                  ? 'bg-amber-600' 
                  : 'bg-zinc-900'
              }`}
              style={{ width: `${Math.min(100, (usedWarehouseSlots / maxWarehouseSlots) * 100)}%` }}
            />
          </div>

          <button
            onClick={() => setCurrentTab('upgrades')}
            className="px-3 py-1.5 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition-colors"
          >
            Расширить склад
          </button>
        </div>
      </div>

      {/* Warehouse Items Grid */}
      {activeItems.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-zinc-200">
          <Package className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
          <div className="text-sm font-semibold text-zinc-800">Склад пуст</div>
          <div className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Вы еще не купили товары. Перейдите на рынок, чтобы найти выгодные предложения для перепродажи.
          </div>
          <button
            onClick={() => setCurrentTab('market')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Перейти на рынок</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
          {activeItems.map(item => {
            const isListed = item.status === 'listed';
            const fee = Math.round((item.listingPrice || item.currentMarketPrice) * currentCommissionRate);
            const expectedProfit = (item.listingPrice || item.currentMarketPrice) - item.purchasePrice - fee - item.shippingCost;

            return (
              <div 
                key={item.id}
                className="p-3.5 rounded-xl bg-white border border-zinc-200 hover:border-zinc-300 shadow-2xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Title Header */}
                  <div className="flex gap-3">
                    <div className="relative w-20 h-20 rounded-lg bg-zinc-100 border border-zinc-200/70 overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      {isListed && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-zinc-900 text-white shadow-xs">
                          На витрине
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${CONDITION_LABELS[item.condition].badgeColor}`}>
                          {CONDITION_LABELS[item.condition].label}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono">
                          {item.daysInWarehouse} дн. на складе
                        </span>
                      </div>

                      <h3 className="text-xs font-semibold text-zinc-900 truncate">
                        {item.title}
                      </h3>

                      <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-500">
                        <span>Спрос:</span>
                        <span className={`px-1 rounded text-[10px] font-medium border ${DEMAND_LABELS[item.demand].badgeColor}`}>
                          {DEMAND_LABELS[item.demand].label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Financial Metrics */}
                  <div className="mt-3 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/70 space-y-2 text-xs">
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[10px] text-zinc-500">Цена покупки:</div>
                        <div className="font-mono font-semibold text-zinc-900">{item.purchasePrice.toLocaleString()} ₽</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500">Рыночная цена:</div>
                        <div className="font-mono font-medium text-zinc-600">{item.currentMarketPrice.toLocaleString()} ₽</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-500">Потенц. прибыль:</div>
                        <div className={`font-mono font-bold ${expectedProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {expectedProfit >= 0 ? '+' : ''}{expectedProfit.toLocaleString()} ₽
                        </div>
                      </div>
                    </div>

                    {/* Formula Calculation Line */}
                    <div className="pt-1.5 border-t border-zinc-200/60 text-[10px] text-zinc-500 font-mono flex items-center justify-between flex-wrap gap-1">
                      <span>{(item.listingPrice || item.currentMarketPrice).toLocaleString()} ₽ (продажа) − {fee.toLocaleString()} ₽ (ком.) − {item.shippingCost.toLocaleString()} ₽ (дост.) − {item.purchasePrice.toLocaleString()} ₽ (закупка)</span>
                      <span className={`font-bold ${expectedProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        = {expectedProfit >= 0 ? '+' : ''}{expectedProfit.toLocaleString()} ₽
                      </span>
                    </div>
                  </div>
                </div>

                {/* Warehouse Actions */}
                <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => quickSellWholesale(item.id)}
                    className="px-2.5 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium transition-colors flex items-center gap-1"
                    title="Сдать скупщику по оптовой цене (быстрая ликвидность)"
                  >
                    <Zap className="w-3 h-3 text-amber-500" />
                    <span>Сдать скупщику</span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isListed ? (
                      <>
                        <button
                          onClick={() => unlistItem(item.id)}
                          className="p-1.5 rounded-md border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50 transition-colors"
                          title="Снять с продажи"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setListingModalItem(item)}
                          className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs"
                        >
                          Изменить цену
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setListingModalItem(item)}
                        className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        Выставить на продажу
                      </button>
                    )}
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
