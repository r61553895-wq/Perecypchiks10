import React from 'react';
import { 
  Building2, 
  Key, 
  Sparkles, 
  CheckCircle2, 
  Package, 
  Store, 
  Wrench, 
  Users, 
  TrendingUp, 
  ShieldCheck,
  Zap,
  ArrowRight
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductImage } from '../ProductImage';
import { CONDITION_LABELS } from '../../data/catalog';

export const ShowroomView: React.FC = () => {
  const { 
    showroomRented, 
    rentShowroom, 
    balance, 
    inventory, 
    setCurrentTab,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  const listedItems = inventory.filter(i => i.status === 'listed');

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
          className="flex-1 py-2 px-3 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1.5"
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

      {/* Showroom Main Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
              {showroomRented ? 'Флагманский шоурум' : 'Аренда шоурума'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {showroomRented 
                ? 'Витрины привлекают премиальных покупателей' 
                : 'Откройте точку продаж и увеличьте вместимость склада'}
            </p>
          </div>
        </div>

        {!showroomRented ? (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Аренда шоурума дает +15 дополнительных мест на складе, открывает автоматический поток покупателей с высокой наценкой и статус топ-продавца.
            </div>

            <div className="pt-2 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">Стоимость аренды</span>
                <span className="text-base font-black font-mono text-slate-900 dark:text-white">
                  ₽ 35 000
                </span>
              </div>

              <button
                onClick={rentShowroom}
                disabled={balance < 35000}
                className="h-11 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 touch-manipulation cursor-pointer"
              >
                Арендовать шоурум
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Шоурум активен. Товары с витрины продаются с повышенным коэффициентом.</span>
            </div>

            <div className="pt-2">
              <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Товары на витрине ({listedItems.length})
              </h3>

              {listedItems.length === 0 ? (
                <div className="p-6 text-center rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    На витрине пока нет товаров. Перейдите на склад и нажмите «Выставить на продажу».
                  </p>
                  <button
                    onClick={() => setCurrentTab('warehouse')}
                    className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Перейти на склад
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2.5">
                  {listedItems.map(item => (
                    <div 
                      key={item.id}
                      className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800 space-y-2"
                    >
                      <div className="w-full h-20 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center p-1">
                        <ProductImage
                          src={item.image}
                          alt={item.title}
                          category={item.category}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {item.title}
                      </div>
                      <div className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                        ₽ {(item.listingPrice || item.currentMarketPrice).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
