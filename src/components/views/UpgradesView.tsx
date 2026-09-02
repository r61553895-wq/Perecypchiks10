import React from 'react';
import { 
  Award, 
  Package, 
  Percent, 
  Truck, 
  ShieldCheck, 
  Lock, 
  Check, 
  Zap,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { LEVEL_DEFINITIONS } from '../../data/catalog';

export const UpgradesView: React.FC = () => {
  const { 
    level, 
    xp, 
    nextLevelXp, 
    balance, 
    upgrades, 
    purchaseUpgrade 
  } = useGame();

  const currentLevelInfo = LEVEL_DEFINITIONS.find(l => l.level === level) || LEVEL_DEFINITIONS[0];
  const nextLevelInfo = LEVEL_DEFINITIONS.find(l => l.level === level + 1);

  // Compute XP progress %
  const currentLevelBaseXp = currentLevelInfo.xpRequired;
  const targetXp = nextLevelInfo ? nextLevelInfo.xpRequired : currentLevelBaseXp;
  const progressPercent = nextLevelInfo 
    ? Math.min(100, Math.max(0, Math.round(((xp - currentLevelBaseXp) / (targetXp - currentLevelBaseXp || 1)) * 100)))
    : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Level Progression Card */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-mono tracking-wider text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                Уровень бизнеса {level} из 5
              </span>
              <span className="text-xs text-zinc-400 font-mono">
                {xp.toLocaleString()} XP
              </span>
            </div>
            <h2 className="text-lg font-bold text-zinc-900">{currentLevelInfo.title}</h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-xl leading-relaxed">
              {currentLevelInfo.description}
            </p>
          </div>

          {nextLevelInfo && (
            <div className="text-right sm:text-right shrink-0">
              <div className="text-[11px] text-zinc-500">Следующий ранг:</div>
              <div className="text-sm font-semibold text-zinc-900 mt-0.5">{nextLevelInfo.title}</div>
              <div className="text-xs font-mono text-zinc-400 mt-0.5">
                Требуется: {nextLevelInfo.xpRequired.toLocaleString()} XP
              </div>
            </div>
          )}
        </div>

        {/* XP Progress Bar */}
        {nextLevelInfo && (
          <div className="mt-4 pt-3 border-t border-zinc-100">
            <div className="flex justify-between text-xs mb-1.5 text-zinc-500">
              <span>Прогресс до следующего ранга</span>
              <span className="font-mono font-medium text-zinc-700">{progressPercent}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-zinc-100 overflow-hidden border border-zinc-200/60">
              <div 
                className="h-full bg-zinc-900 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Levels Roadmap Preview */}
      <div className="p-6 rounded-xl bg-white border border-zinc-200/90 shadow-2xs">
        <div className="border-b border-zinc-100 pb-3 mb-4">
          <h3 className="text-sm font-bold text-zinc-900">Ступени масштабирования торговли</h3>
          <p className="text-[11px] text-zinc-500">Открывайте более маржинальные категории и дорогостоящие рынки с ростом репутации</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {LEVEL_DEFINITIONS.map(l => {
            const isUnlocked = level >= l.level;
            const isCurrent = level === l.level;

            return (
              <div 
                key={l.level}
                className={`p-3.5 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'border-zinc-900 bg-zinc-50/70 shadow-2xs' 
                    : isUnlocked 
                    ? 'border-zinc-200 bg-white' 
                    : 'border-dashed border-zinc-200 bg-zinc-50/40 opacity-70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-zinc-400">Ур. {l.level}</span>
                  {isUnlocked ? (
                    <span className="w-4 h-4 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-zinc-400" />
                  )}
                </div>
                <div className="text-xs font-semibold text-zinc-900 leading-tight">
                  {l.title}
                </div>
                <div className="text-[11px] text-zinc-500 mt-1.5 leading-snug line-clamp-3">
                  {l.description}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Business Infrastructure Upgrades */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-zinc-900">Инфраструктура и улучшения</h3>
            <p className="text-[11px] text-zinc-500">Инвестируйте свободный капитал в постоянное снижение издержек и расширение емкости</p>
          </div>
          <div className="text-xs text-zinc-500">
            Баланс: <span className="font-mono font-bold text-zinc-900">{balance.toLocaleString()} ₽</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {upgrades.map(upg => {
            const isMax = upg.level >= upg.maxLevel;
            const canAfford = balance >= upg.cost;
            const isLevelLocked = level < upg.unlockedAtPlayerLevel;

            let Icon = Package;
            if (upg.effectType === 'fee_discount') Icon = Percent;
            if (upg.effectType === 'shipping_discount') Icon = Truck;
            if (upg.effectType === 'deal_radar') Icon = Zap;
            if (upg.effectType === 'reputation_boost') Icon = ShieldCheck;

            return (
              <div 
                key={upg.id}
                className="p-5 rounded-xl bg-white border border-zinc-200/90 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-zinc-900">{upg.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-mono text-zinc-500">
                            Уровень {upg.level} из {upg.maxLevel}
                          </span>
                        </div>
                      </div>
                    </div>

                    {isMax && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600 border border-zinc-200">
                        MAX
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-600 leading-relaxed mt-2">
                    {upg.description}
                  </p>

                  {/* Level dots */}
                  <div className="mt-3 flex items-center gap-1.5">
                    {Array.from({ length: upg.maxLevel }).map((_, i) => (
                      <div 
                        key={i}
                        className={`h-1.5 flex-1 rounded-full ${
                          i < upg.level ? 'bg-zinc-900' : 'bg-zinc-100 border border-zinc-200/60'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  {isMax ? (
                    <span className="text-xs text-zinc-400 font-medium">Максимальный уровень</span>
                  ) : isLevelLocked ? (
                    <span className="text-xs text-amber-700 font-medium flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Требуется уровень {upg.unlockedAtPlayerLevel}
                    </span>
                  ) : (
                    <div className="font-mono text-xs font-bold text-zinc-900">
                      Стоимость: {upg.cost.toLocaleString()} ₽
                    </div>
                  )}

                  {!isMax && !isLevelLocked && (
                    <button
                      onClick={() => purchaseUpgrade(upg.id)}
                      disabled={!canAfford}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        !canAfford 
                          ? 'bg-zinc-100 text-zinc-400 border border-zinc-200 cursor-not-allowed' 
                          : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-xs'
                      }`}
                    >
                      {!canAfford ? 'Недостаточно средств' : 'Улучшить'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
