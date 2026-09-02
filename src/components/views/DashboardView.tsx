import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  PieChart, 
  ArrowRight,
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { CONDITION_LABELS } from '../../data/catalog';

export const DashboardView: React.FC = () => {
  const { 
    balance, 
    stats, 
    inventory, 
    salesHistory, 
    financialHistory, 
    setCurrentTab,
    advanceDay,
    maxWarehouseSlots,
    usedWarehouseSlots
  } = useGame();

  // Inventory valuation at current market prices
  const inventoryValuation = inventory
    .filter(i => i.status !== 'sold')
    .reduce((sum, item) => sum + item.currentMarketPrice, 0);

  // Profit Margin %
  const profitMarginPercent = stats.totalRevenue > 0 
    ? Math.round((stats.totalNetProfit / stats.totalRevenue) * 100) 
    : 0;

  // Win rate %
  const winRate = stats.itemsSold > 0 
    ? Math.round((stats.profitableSales / stats.itemsSold) * 100) 
    : 100;

  // Recent sales (up to 5)
  const recentSales = salesHistory.slice(0, 5);

  // SVG Profit & Capital Sparkline/Area Chart
  const historyPoints = financialHistory.length > 1 
    ? financialHistory 
    : [
        { day: 1, balance: balance, dailyNetProfit: 0 },
        { day: 2, balance: balance, dailyNetProfit: 0 }
      ];

  const minVal = Math.min(...historyPoints.map(p => p.balance)) * 0.95;
  const maxVal = Math.max(...historyPoints.map(p => p.balance)) * 1.05;
  const range = maxVal - minVal || 1;
  const svgWidth = 600;
  const svgHeight = 140;

  const points = historyPoints.map((p, idx) => {
    const x = (idx / (historyPoints.length - 1 || 1)) * svgWidth;
    const y = svgHeight - ((p.balance - minVal) / range) * (svgHeight - 20) - 10;
    return `${x},${y}`;
  });

  const pathD = `M ${points.join(' L ')}`;
  const areaD = `${pathD} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 4 Core Metric Cards (Strictly as specified in Prompt) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Баланс */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2">
            <span>Баланс</span>
            <span className="text-[10px] font-mono text-zinc-400">RUB</span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {balance.toLocaleString()} ₽
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
            <span>Свободный капитал</span>
          </div>
        </div>

        {/* Прибыль */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2">
            <span>Чистая прибыль</span>
            <div className={`flex items-center text-xs font-semibold ${
              stats.totalNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {stats.totalNetProfit >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span>{profitMarginPercent}% маржа</span>
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${
            stats.totalNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
          }`}>
            {stats.totalNetProfit >= 0 ? '+' : ''}{stats.totalNetProfit.toLocaleString()} ₽
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-500">
            <span>За все время</span>
          </div>
        </div>

        {/* Товары на складе */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2">
            <span>Товары на складе</span>
            <span className="text-[11px] font-mono text-zinc-500">
              {usedWarehouseSlots} / {maxWarehouseSlots}
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {usedWarehouseSlots}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span>Оценка активов:</span>
            <span className="font-mono text-zinc-700 font-medium">{inventoryValuation.toLocaleString()} ₽</span>
          </div>
        </div>

        {/* Продажи */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="flex items-center justify-between text-xs font-medium text-zinc-500 mb-2">
            <span>Завершенные продажи</span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
              {winRate}% в плюс
            </span>
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {stats.itemsSold}
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span>Выручка:</span>
            <span className="font-mono text-zinc-700 font-medium">{stats.totalRevenue.toLocaleString()} ₽</span>
          </div>
        </div>
      </div>

      {/* Main Row: Financial Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Capital & Performance Chart */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-semibold text-zinc-900">Динамика капитала</div>
              <div className="text-[11px] text-zinc-500">Изменение баланса по игровым дням</div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-900" />
                <span className="text-zinc-600 font-mono text-[11px]">Капитал (₽)</span>
              </div>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="relative w-full h-36 bg-zinc-50/50 rounded-lg p-2 border border-zinc-100 overflow-hidden">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-full preserve-3d"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#18181b" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="#18181b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={areaD} fill="url(#chartGradient)" />
              <path 
                d={pathD} 
                fill="none" 
                stroke="#18181b" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
            </svg>
            <div className="absolute top-2 right-3 text-[10px] font-mono text-zinc-400">
              Текущий: {balance.toLocaleString()} ₽
            </div>
          </div>

          {/* Sub metrics */}
          <div className="mt-4 pt-3 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-[10px] text-zinc-500">Лучшая сделка</div>
              <div className="text-xs font-semibold font-mono text-emerald-700 mt-0.5">
                +{stats.bestSingleProfit.toLocaleString()} ₽
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">Комиссий уплачено</div>
              <div className="text-xs font-semibold font-mono text-zinc-700 mt-0.5">
                {stats.totalFeesPaid.toLocaleString()} ₽
              </div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500">Расходы на доставку</div>
              <div className="text-xs font-semibold font-mono text-zinc-700 mt-0.5">
                {stats.totalShippingPaid.toLocaleString()} ₽
              </div>
            </div>
          </div>
        </div>

        {/* Fast Action Shortcuts */}
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="text-xs font-semibold text-zinc-900 mb-1">Быстрые действия</div>
            <div className="text-[11px] text-zinc-500 mb-4">Основные разделы для управления бизнесом</div>

            <div className="space-y-2">
              <button
                onClick={() => setCurrentTab('market')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">Открыть рынок</div>
                    <div className="text-[11px] text-zinc-500">Найти выгодные товары со скидкой</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>

              <button
                onClick={() => setCurrentTab('warehouse')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">Управление складом</div>
                    <div className="text-[11px] text-zinc-500">
                      {usedWarehouseSlots} поз. ожидает выставления
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>

              <button
                onClick={() => setCurrentTab('sales')}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-zinc-200/80 hover:border-zinc-300 hover:bg-zinc-50 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-700 group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900">Витрина продаж</div>
                    <div className="text-[11px] text-zinc-500">Цены и скорость конверсии</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-zinc-700 transition-colors" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 mt-4">
            <button
              onClick={advanceDay}
              className="w-full py-2.5 px-3 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Завершить день и перейти к следующему</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-semibold text-zinc-900">Последние сделки</div>
            <div className="text-[11px] text-zinc-500">Журнал закрытых продаж и чистой маржинальности</div>
          </div>
          {salesHistory.length > 0 && (
            <button
              onClick={() => setCurrentTab('sales')}
              className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 transition-colors"
            >
              <span>Все сделки ({salesHistory.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentSales.length === 0 ? (
          <div className="py-10 text-center text-zinc-400 border border-dashed border-zinc-200 rounded-lg">
            <Clock className="w-6 h-6 mx-auto mb-2 text-zinc-300" />
            <div className="text-xs font-medium text-zinc-600">Сделок пока нет</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Купите первые товары на рынке и выставьте их на продажу</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-100 text-zinc-400 font-medium">
                  <th className="pb-2.5 font-normal">Товар</th>
                  <th className="pb-2.5 font-normal">Состояние</th>
                  <th className="pb-2.5 font-normal text-right">Закупка</th>
                  <th className="pb-2.5 font-normal text-right">Продажа</th>
                  <th className="pb-2.5 font-normal text-right">Комиссия / Доставка</th>
                  <th className="pb-2.5 font-normal text-right">Чистая прибыль</th>
                  <th className="pb-2.5 font-normal text-right">Срок</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {recentSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-zinc-50/50">
                    <td className="py-2.5 font-medium text-zinc-900 max-w-xs truncate">{sale.title}</td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${
                        CONDITION_LABELS[sale.condition]?.badgeColor || 'border-zinc-200 bg-zinc-50'
                      }`}>
                        {CONDITION_LABELS[sale.condition]?.label || sale.condition}
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-right text-zinc-500">{sale.purchasePrice.toLocaleString()} ₽</td>
                    <td className="py-2.5 font-mono text-right font-medium text-zinc-900">{sale.sellPrice.toLocaleString()} ₽</td>
                    <td className="py-2.5 font-mono text-right text-zinc-500">
                      {(sale.fee + sale.shipping).toLocaleString()} ₽
                    </td>
                    <td className={`py-2.5 font-mono text-right font-semibold ${
                      sale.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {sale.netProfit >= 0 ? '+' : ''}{sale.netProfit.toLocaleString()} ₽
                      <span className="text-[10px] font-normal text-zinc-400 ml-1">
                        ({sale.marginPercent}%)
                      </span>
                    </td>
                    <td className="py-2.5 font-mono text-right text-zinc-500">{sale.daysToSell} дн.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
