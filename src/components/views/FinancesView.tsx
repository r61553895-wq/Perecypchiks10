import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  Percent, 
  Package, 
  Truck,
  CreditCard
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const FinancesView: React.FC = () => {
  const { stats, balance, inventory } = useGame();

  const inventoryCost = inventory
    .filter(i => i.status !== 'sold')
    .reduce((sum, item) => sum + item.purchasePrice, 0);

  const inventoryMarketVal = inventory
    .filter(i => i.status !== 'sold')
    .reduce((sum, item) => sum + item.currentMarketPrice, 0);

  const potentialWarehouseProfit = inventoryMarketVal - inventoryCost;

  const grossProfit = stats.totalRevenue - stats.totalExpenses;
  const netProfit = stats.totalNetProfit;
  const netMargin = stats.totalRevenue > 0 
    ? Math.round((netProfit / stats.totalRevenue) * 100) 
    : 0;

  const avgProfitPerSale = stats.itemsSold > 0 
    ? Math.round(netProfit / stats.itemsSold) 
    : 0;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="text-xs font-medium text-zinc-500 mb-1">Общий оборот (Выручка)</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {stats.totalRevenue.toLocaleString()} ₽
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            {stats.itemsSold} завершенных сделок
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="text-xs font-medium text-zinc-500 mb-1">Чистая прибыль (EBITDA)</div>
          <div className={`text-2xl font-bold font-mono tracking-tight ${
            netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
          }`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
          </div>
          <div className="mt-2 text-xs text-zinc-500 flex items-center gap-1">
            <span>Рентабельность продаж:</span>
            <span className="font-mono font-semibold text-zinc-700">{netMargin}%</span>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="text-xs font-medium text-zinc-500 mb-1">Текущий капитал (Ликвидность)</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {balance.toLocaleString()} ₽
          </div>
          <div className="mt-2 text-xs text-zinc-500">
            Доступно для новых закупок
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
          <div className="text-xs font-medium text-zinc-500 mb-1">Складские активы (Оценка)</div>
          <div className="text-2xl font-bold font-mono text-zinc-900 tracking-tight">
            {inventoryMarketVal.toLocaleString()} ₽
          </div>
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            Потенц. маржа: +{potentialWarehouseProfit.toLocaleString()} ₽
          </div>
        </div>
      </div>

      {/* Structured Profit & Loss Statement (P&L) */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="border-b border-zinc-100 pb-3 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-zinc-900">Отчет о прибылях и убытках (P&L)</h2>
            <p className="text-[11px] text-zinc-500">Детализация доходов, себестоимости и сопутствующих операционных расходов</p>
          </div>
          <span className="text-[11px] font-mono text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded">
            All-Time Ledger
          </span>
        </div>

        <div className="divide-y divide-zinc-100 text-xs">
          {/* Revenue */}
          <div className="py-3 flex justify-between items-center font-medium">
            <span className="text-zinc-900 text-sm">Валовая выручка от продаж</span>
            <span className="font-mono text-zinc-900 font-bold text-sm">
              {stats.totalRevenue.toLocaleString()} ₽
            </span>
          </div>

          {/* COGS */}
          <div className="py-2.5 flex justify-between items-center text-zinc-600 pl-4">
            <span>Себестоимость закупок (COGS)</span>
            <span className="font-mono text-zinc-600">−{stats.totalExpenses.toLocaleString()} ₽</span>
          </div>

          {/* Gross Profit */}
          <div className="py-3 flex justify-between items-center font-medium bg-zinc-50/70 px-4 rounded-lg my-1">
            <span className="text-zinc-900">Валовая прибыль (Gross Profit)</span>
            <span className={`font-mono font-bold ${
              grossProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {grossProfit >= 0 ? '+' : ''}{grossProfit.toLocaleString()} ₽
            </span>
          </div>

          {/* Marketplace Fees */}
          <div className="py-2.5 flex justify-between items-center text-zinc-600 pl-4">
            <span className="flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-zinc-400" />
              Комиссии торговых площадок
            </span>
            <span className="font-mono text-zinc-600">−{stats.totalFeesPaid.toLocaleString()} ₽</span>
          </div>

          {/* Shipping Costs */}
          <div className="py-2.5 flex justify-between items-center text-zinc-600 pl-4">
            <span className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-zinc-400" />
              Логистические расходы и курьерская доставка
            </span>
            <span className="font-mono text-zinc-600">−{stats.totalShippingPaid.toLocaleString()} ₽</span>
          </div>

          {/* Net Profit */}
          <div className="py-3.5 flex justify-between items-center font-bold bg-zinc-100/80 px-4 rounded-lg mt-2">
            <div>
              <span className="text-zinc-900 text-sm">Чистая операционная прибыль</span>
              <div className="text-[10px] text-zinc-500 font-normal mt-0.5">
                Итоговый финансовый результат после всех вычетов
              </div>
            </div>
            <span className={`font-mono text-base ${
              netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
            }`}>
              {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
            </span>
          </div>
        </div>
      </div>

      {/* KPI Summary Block */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 text-center">
          <div className="text-[11px] text-zinc-500">Средняя прибыль со сделки</div>
          <div className="text-lg font-bold font-mono text-zinc-900 mt-1">
            {avgProfitPerSale.toLocaleString()} ₽
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 text-center">
          <div className="text-[11px] text-zinc-500">Самая быстрая продажа</div>
          <div className="text-lg font-bold font-mono text-zinc-900 mt-1">
            {stats.fastestSaleDays === 99 ? '—' : `${stats.fastestSaleDays} дн.`}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-zinc-200/90 text-center">
          <div className="text-[11px] text-zinc-500">Доля прибыльных сделок</div>
          <div className="text-lg font-bold font-mono text-emerald-700 mt-1">
            {stats.itemsSold > 0 ? Math.round((stats.profitableSales / stats.itemsSold) * 100) : 100}%
          </div>
        </div>
      </div>
    </div>
  );
};
