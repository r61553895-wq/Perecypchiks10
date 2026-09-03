import React from 'react';
import { 
  TrendingUp, 
  Coins, 
  BarChart3, 
  Search, 
  Wrench, 
  Truck, 
  Check, 
  Sparkles, 
  Trophy, 
  ShoppingBag, 
  CheckCircle2, 
  Award,
  Zap,
  PackageCheck,
  PieChart,
  History,
  Settings
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LEVEL_DEFINITIONS } from '../../data/catalog';

export const UpgradesView: React.FC = () => {
  const { 
    level, 
    xp, 
    balance, 
    skills,
    upgradeSkill,
    upgrades,
    purchaseUpgrade,
    setCurrentTab
  } = useGame();

  const currentLevelInfo = LEVEL_DEFINITIONS.find(l => l.level === level) || LEVEL_DEFINITIONS[0];
  const nextLevelInfo = LEVEL_DEFINITIONS.find(l => l.level === level + 1);

  const currentLevelBaseXp = currentLevelInfo.xpRequired;
  const targetXp = nextLevelInfo ? nextLevelInfo.xpRequired : currentLevelBaseXp;
  const progressPercent = nextLevelInfo 
    ? Math.min(100, Math.max(0, Math.round(((xp - currentLevelBaseXp) / (targetXp - currentLevelBaseXp || 1)) * 100)))
    : 100;

  const skillDefinitions = [
    {
      key: 'bargain' as const,
      title: 'Торг',
      icon: Coins,
      description: 'Позволяет сбивать цену продавца и снижает шанс отказа',
      baseCost: 4200,
      currentLevel: skills.bargain
    },
    {
      key: 'analytics' as const,
      title: 'Аналитика',
      icon: BarChart3,
      description: 'Подсвечивает супер-выгодные сделки и реальные тренды цен',
      baseCost: 5600,
      currentLevel: skills.analytics
    },
    {
      key: 'appraisal' as const,
      title: 'Оценка',
      icon: Search,
      description: 'Мгновенно выявляет скрытые дефекты и реплики устройств',
      baseCost: 4900,
      currentLevel: skills.appraisal
    },
    {
      key: 'repair' as const,
      title: 'Ремонт',
      icon: Wrench,
      description: 'Увеличивает маржинальность и качество предпродажной подготовки',
      baseCost: 7000,
      currentLevel: skills.repair
    },
    {
      key: 'logistics' as const,
      title: 'Логистика',
      icon: Truck,
      description: 'Расширяет вместимость инвентаря и снижает стоимость доставки',
      baseCost: 6300,
      currentLevel: skills.logistics
    }
  ];

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
          className="flex-1 py-2 px-2 rounded-xl font-bold bg-white dark:bg-[#18233C] text-blue-600 dark:text-blue-400 shadow-xs transition-all flex items-center justify-center gap-1"
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

      {/* Level Progress Card */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center font-black">
              {level}
            </div>
            <div>
              <h2 className="text-sm font-black text-slate-900 dark:text-white tracking-tight">
                {currentLevelInfo.title}
              </h2>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Опыт: {xp.toLocaleString()} XP
              </span>
            </div>
          </div>

          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
            {progressPercent}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div 
            className="h-full rounded-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Skills Section */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Навыки предпринимателя
        </h3>

        <div className="space-y-3">
          {skillDefinitions.map(s => {
            const Icon = s.icon;
            const cost = Math.round(s.baseCost * Math.pow(1.4, s.currentLevel));
            const isMax = s.currentLevel >= 5;
            const canAfford = balance >= cost && !isMax;

            return (
              <div 
                key={s.key}
                className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-[#18233C] text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{s.title}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
                          Ур. {s.currentLevel}/5
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-600 dark:text-slate-300">
                    {isMax ? 'Максимум' : `₽ ${cost.toLocaleString()}`}
                  </span>

                  <button
                    disabled={!canAfford || isMax}
                    onClick={() => upgradeSkill(s.key)}
                    className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 touch-manipulation cursor-pointer"
                  >
                    {isMax ? 'Прокачано' : 'Улучшить'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Upgrades */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
          Улучшения бизнеса
        </h3>

        <div className="space-y-3">
          {upgrades.map(u => {
            const isMax = u.level >= u.maxLevel;
            const canAfford = balance >= u.cost && !isMax;

            return (
              <div 
                key={u.id}
                className="p-4 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{u.title}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      Ур. {u.level}/{u.maxLevel}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {u.description}
                  </p>
                </div>

                <button
                  disabled={!canAfford || isMax}
                  onClick={() => purchaseUpgrade(u.id)}
                  className="h-10 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs transition-all shadow-sm shadow-blue-500/20 shrink-0 touch-manipulation cursor-pointer"
                >
                  {isMax ? 'Куплено' : `₽ ${u.cost.toLocaleString()}`}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
