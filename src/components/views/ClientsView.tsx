import React from 'react';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Search, 
  ArrowRight,
  Star,
  Award,
  Package,
  Building2,
  Check
} from 'lucide-react';
import { useGame } from '../../context/GameContext';

export const ClientsView: React.FC = () => {
  const { 
    customerOrders, 
    inventory, 
    fulfillOrder, 
    setCurrentTab,
    reputationPoints
  } = useGame();

  const completedCount = customerOrders.filter(o => o.isCompleted).length;

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Sub-navigation Switcher */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131C31] rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
        <button
          onClick={() => setCurrentTab('warehouse')}
          className="flex-1 py-2 px-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Package className="w-3.5 h-3.5" />
          <span>Склад</span>
        </button>

        <button
          onClick={() => setCurrentTab('showroom')}
          className="flex-1 py-2 px-3 rounded-xl font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Шоурум</span>
        </button>

        <button
          className="flex-1 py-2 px-3 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1.5"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Клиенты ({customerOrders.length - completedCount})</span>
        </button>
      </div>

      {/* Header Info */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                VIP-заказы клиентов
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Доставляйте девайсы и получайте щедрые бонусы
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Выполнено</span>
            <span className="text-sm font-black text-slate-900 dark:text-white font-mono">
              {completedCount}/{customerOrders.length}
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {customerOrders.map(order => {
          const matchingItem = inventory.find(i => 
            i.status !== 'sold' && (
              i.title.toLowerCase().includes(order.requestedTitle.toLowerCase().slice(0, 10)) ||
              i.category === order.category
            )
          );

          const totalPayout = order.budget + order.bonusReward;

          return (
            <div 
              key={order.id}
              className={`p-4 rounded-3xl border transition-all space-y-3 shadow-xs ${
                order.isCompleted 
                  ? 'bg-slate-50/60 dark:bg-[#111827]/40 border-slate-200/60 dark:border-slate-800/60 opacity-60' 
                  : 'bg-white dark:bg-[#131C31] border-slate-200/90 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{order.clientName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                      {order.clientArchetype}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400">
                    Ищет: {order.requestedTitle}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                    «{order.comment}»
                  </p>
                </div>

                {order.isCompleted && (
                  <span className="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Выполнен
                  </span>
                )}
              </div>

              {/* Payment Strip */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Бюджет + Бонус</span>
                  <span className="text-sm font-black font-mono text-slate-900 dark:text-white">
                    ₽ {totalPayout.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Премия за скорость</span>
                  <span className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                    +{order.bonusReward.toLocaleString()} ₽
                  </span>
                </div>
              </div>

              {/* Action Button */}
              {!order.isCompleted && (
                <div>
                  {matchingItem ? (
                    <button
                      onClick={() => fulfillOrder(order.id, matchingItem.id)}
                      className="w-full h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20 touch-manipulation cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Отдать заказ: {matchingItem.title} (₽{totalPayout.toLocaleString()})</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrentTab('market')}
                      className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors touch-manipulation cursor-pointer"
                    >
                      <Search className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <span>Найти товар на рынке</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
