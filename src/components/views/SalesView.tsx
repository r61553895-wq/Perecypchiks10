import React, { useState } from 'react';
import { 
  TrendingUp, 
  Package, 
  RotateCcw, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CONDITION_LABELS, CATEGORY_LABELS } from '../../data/catalog';
import { ProductImage } from '../ProductImage';

export const SalesView: React.FC = () => {
  const { 
    inventory, 
    salesHistory, 
    setListingModalItem, 
    unlistItem,
    currentCommissionRate 
  } = useGame();

  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
  const [historySearch, setHistorySearch] = useState('');

  const listedItems = inventory.filter(i => i.status === 'listed');

  const filteredHistory = salesHistory.filter(s => {
    if (!historySearch) return true;
    return s.title.toLowerCase().includes(historySearch.toLowerCase());
  });

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      {/* Top Segmented Control */}
      <div className="flex items-center justify-between">
        <div className="inline-flex p-1 rounded-xl bg-zinc-200/70 border border-zinc-200 text-xs font-medium">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'active' 
                ? 'bg-white text-zinc-900 shadow-2xs font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Активные лоты ({listedItems.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'history' 
                ? 'bg-white text-zinc-900 shadow-2xs font-semibold' 
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            История продаж ({salesHistory.length})
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Поиск по продажам..."
              value={historySearch}
              onChange={e => setHistorySearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-zinc-200 text-xs focus:outline-hidden focus:ring-1 focus:ring-zinc-900 bg-white"
            />
          </div>
        )}
      </div>

      {/* Tab 1: Active Listings on Market */}
      {activeTab === 'active' && (
        <>
          {listedItems.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-xl border border-zinc-200">
              <TrendingUp className="w-10 h-10 mx-auto text-zinc-300 mb-2" />
              <div className="text-sm font-semibold text-zinc-800">Нет активных объявлений</div>
              <div className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                Выставьте товары со склада на продажу, чтобы покупатели начали делать предложения.
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {listedItems.map(item => {
                const listPrice = item.listingPrice || item.currentMarketPrice;
                const fee = Math.round(listPrice * currentCommissionRate);
                const netProfit = listPrice - item.purchasePrice - fee - item.shippingCost;
                const margin = Math.round((netProfit / listPrice) * 100);
                const priceRatio = listPrice / item.currentMarketPrice;

                return (
                  <div 
                    key={item.id}
                    className="p-4 rounded-xl bg-white border border-zinc-200 shadow-2xs flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex gap-3">
                        <div className="w-16 h-16 rounded-lg bg-zinc-900 border border-zinc-200 overflow-hidden shrink-0">
                          <ProductImage 
                            src={item.image} 
                            alt={item.title} 
                            title={item.title}
                            category={item.category}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className={`px-1.5 py-0.2 rounded text-[10px] font-medium border ${CONDITION_LABELS[item.condition].badgeColor}`}>
                            {CONDITION_LABELS[item.condition].label}
                          </span>
                          <h3 className="text-xs font-semibold text-zinc-900 truncate mt-1">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-1">
                            <Clock className="w-3 h-3 text-zinc-400" />
                            <span>На витрине {item.daysInWarehouse} дн.</span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing Specs */}
                      <div className="mt-3 p-2.5 rounded-lg bg-zinc-50 border border-zinc-200/60 grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <div className="text-[10px] text-zinc-500">Закупка:</div>
                          <div className="font-mono font-medium text-zinc-900">{item.purchasePrice.toLocaleString()} ₽</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500">Выставлен за:</div>
                          <div className="font-mono font-bold text-zinc-900">{listPrice.toLocaleString()} ₽</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-zinc-500">Ожид. маржа:</div>
                          <div className={`font-mono font-bold ${
                            netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                          }`}>
                            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between">
                      <button
                        onClick={() => unlistItem(item.id)}
                        className="px-2.5 py-1.5 rounded-md border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs font-medium transition-colors"
                      >
                        Снять с продажи
                      </button>
                      <button
                        onClick={() => setListingModalItem(item)}
                        className="px-3 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all shadow-xs"
                      >
                        Изменить цену
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Tab 2: Sales History Table */}
      {activeTab === 'history' && (
        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          {filteredHistory.length === 0 ? (
            <div className="py-16 text-center text-zinc-400">
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
              <div className="text-xs font-medium text-zinc-700">История закрытых продаж пуста</div>
              <div className="text-[11px] text-zinc-400 mt-0.5">После завершения ходов проданные товары появятся здесь</div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-100 text-zinc-400 font-medium">
                    <th className="pb-2.5 font-normal">День</th>
                    <th className="pb-2.5 font-normal">Товар</th>
                    <th className="pb-2.5 font-normal">Категория</th>
                    <th className="pb-2.5 font-normal text-right">Закупка</th>
                    <th className="pb-2.5 font-normal text-right">Продажа</th>
                    <th className="pb-2.5 font-normal text-right">Комиссия</th>
                    <th className="pb-2.5 font-normal text-right">Доставка</th>
                    <th className="pb-2.5 font-normal text-right">Чистая прибыль</th>
                    <th className="pb-2.5 font-normal text-right">Маржа %</th>
                    <th className="pb-2.5 font-normal text-right">Срок продажи</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredHistory.map(sale => (
                    <tr key={sale.id} className="hover:bg-zinc-50/60">
                      <td className="py-2.5 font-mono text-zinc-500">День {sale.soldDay}</td>
                      <td className="py-2.5 font-medium text-zinc-900 max-w-xs truncate">{sale.title}</td>
                      <td className="py-2.5 text-zinc-500">{CATEGORY_LABELS[sale.category] || sale.category}</td>
                      <td className="py-2.5 font-mono text-right text-zinc-500">{sale.purchasePrice.toLocaleString()} ₽</td>
                      <td className="py-2.5 font-mono text-right font-medium text-zinc-900">{sale.sellPrice.toLocaleString()} ₽</td>
                      <td className="py-2.5 font-mono text-right text-zinc-500">{sale.fee.toLocaleString()} ₽</td>
                      <td className="py-2.5 font-mono text-right text-zinc-500">{sale.shipping.toLocaleString()} ₽</td>
                      <td className={`py-2.5 font-mono text-right font-semibold ${
                        sale.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                      }`}>
                        {sale.netProfit >= 0 ? '+' : ''}{sale.netProfit.toLocaleString()} ₽
                      </td>
                      <td className="py-2.5 font-mono text-right text-zinc-700 font-medium">
                        {sale.marginPercent}%
                      </td>
                      <td className="py-2.5 font-mono text-right text-zinc-500">{sale.daysToSell} дн.</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
