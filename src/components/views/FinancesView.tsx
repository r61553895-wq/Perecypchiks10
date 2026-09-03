import React from 'react';
import { 
  PieChart, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight, 
  Percent, 
  Package, 
  Truck,
  CreditCard,
  Settings,
  History,
  Zap
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const FinancesView: React.FC = () => {
  const { stats, balance, inventory, setCurrentTab } = useGame();

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
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Sub-navigation Switcher for Business Section */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131C31] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          className="flex-1 py-2 px-2 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1"
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
          onClick={() => setCurrentTab('sales')}
          className="flex-1 py-2 px-2 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1"
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

      {/* Hero Financial Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Выручка
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            ₽ {stats.totalRevenue.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            {stats.itemsSold} проданных лотов
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Чистый профит
          </span>
          <div className={`text-xl sm:text-2xl font-black font-mono ${
            netProfit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'
          }`}>
            {netProfit >= 0 ? '+' : ''}{netProfit.toLocaleString()} ₽
          </div>
          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold mt-1 block">
            Маржинальность: {netMargin}%
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Товарный остаток
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-slate-900 dark:text-white">
            ₽ {inventoryMarketVal.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Закупка: {inventoryCost.toLocaleString()} ₽
          </span>
        </div>

        <div className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Ср. чек профита
          </span>
          <div className="text-xl sm:text-2xl font-black font-mono text-blue-600 dark:text-blue-400">
            +{avgProfitPerSale.toLocaleString()} ₽
          </div>
          <span className="text-[10px] text-slate-400 mt-1 block">
            Успешных: {stats.profitableSales}/{stats.itemsSold}
          </span>
        </div>
      </div>

      {/* Expenses Breakdown */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Структура расходов
        </h2>

        <div className="space-y-2.5">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Себестоимость товаров</div>
              <div className="text-[10px] text-slate-400">Сумма всех закупок</div>
            </div>
            <div className="text-sm font-black font-mono text-slate-900 dark:text-white">
              ₽ {stats.totalExpenses.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Комиссии площадок</div>
              <div className="text-[10px] text-slate-400">Удержания при продаже</div>
            </div>
            <div className="text-sm font-black font-mono text-amber-600 dark:text-amber-400">
              ₽ {stats.totalFeesPaid.toLocaleString()}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Логистика & доставка</div>
              <div className="text-[10px] text-slate-400">Транспортные расходы</div>
            </div>
            <div className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
              ₽ {stats.totalShippingPaid.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
