import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  RotateCcw, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Search, 
  PieChart,
  Zap,
  History,
  Settings
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CONDITION_LABELS } from '../../data/catalog';
import { ProductImage } from '../ProductImage';

export const SalesView: React.FC = () => {
  const { 
    inventory, 
    salesHistory, 
    setListingModalItem, 
    unlistItem,
    currentCommissionRate,
    setCurrentTab
  } = useGame();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [historySearch, setHistorySearch] = useState('');

  const listedItems = inventory.filter(i => i.status === 'listed');

  const filteredHistory = salesHistory.filter(s => {
    if (!historySearch) return true;
    return s.title.toLowerCase().includes(historySearch.toLowerCase());
  });

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131C31] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          onClick={() => setCurrentTab('finances')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <PieChart className="w-3.5 h-3.5" />
          <span>P&L</span>
        </button>

        <button
          onClick={() => setCurrentTab('upgrades')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <Zap className="w-3.5 h-3.5" />
          <span>Навыки</span>
        </button>

        <button
          className="flex-1 py-2 px-2 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1"
        >
          <History className="w-3.5 h-3.5" />
          <span>Сделки</span>
        </button>

        <button
          onClick={() => setCurrentTab('settings')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Опции</span>
        </button>
      </div>

      {/* Segmented Control: Active Listings / Sales History */}
      <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-[#131C31] border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('active')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'active'
              ? 'bg-white dark:bg-[#18233C] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          На витрине ({listedItems.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-white dark:bg-[#18233C] text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Архив сделок ({salesHistory.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'active' ? (
        listedItems.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-[#131C31] rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-2">
            <Package className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
            <div className="text-sm font-bold text-slate-800 dark:text-slate-200">Нет активных объявлений</div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
              Перейдите на склад, чтобы назначить цену и выставить товары покупателям.
            </p>
            <button
              onClick={() => setCurrentTab('warehouse')}
              className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20"
            >
              Перейти на склад
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {listedItems.map(item => {
              const fee = Math.round((item.listingPrice || item.currentMarketPrice) * currentCommissionRate);
              const profit = (item.listingPrice || item.currentMarketPrice) - item.purchasePrice - fee - item.shippingCost;

              return (
                <div 
                  key={item.id}
                  className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 space-y-3 shadow-xs"
                >
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-200/80 dark:border-slate-700/60 overflow-hidden shrink-0 flex items-center justify-center p-1">
                      <ProductImage 
                        src={item.image} 
                        alt={item.title} 
                        category={item.category} 
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
                          {CONDITION_LABELS[item.condition]?.label || item.condition}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {item.daysInWarehouse} дн.
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </h3>
                      <div className="text-sm font-black font-mono text-blue-600 dark:text-blue-400 mt-1">
                        ₽ {(item.listingPrice || item.currentMarketPrice).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => unlistItem(item.id)}
                      className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Снять
                    </button>
                    <button
                      onClick={() => setListingModalItem(item)}
                      className="h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-sm shadow-blue-500/20 cursor-pointer"
                    >
                      Изменить цену
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        <div className="space-y-3">
          {/* History Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Поиск по архиву сделок..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center bg-white dark:bg-[#131C31] rounded-3xl border border-slate-200/90 dark:border-slate-800">
              <p className="text-xs text-slate-500 dark:text-slate-400">Сделок пока нет</p>
            </div>
          ) : (
            filteredHistory.map(sale => (
              <div 
                key={sale.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 space-y-2 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      {sale.title}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      Маржа: {sale.marginPercent}% • Продано за {sale.daysToSell} дн.
                    </span>
                  </div>
                  <div className={`text-xs font-mono font-black ${
                    sale.netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
                  }`}>
                    {sale.netProfit >= 0 ? '+' : ''}{sale.netProfit.toLocaleString()} ₽
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Продано за ₽ {sale.sellPrice.toLocaleString()}</span>
                  <span>День #{sale.soldDay}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
