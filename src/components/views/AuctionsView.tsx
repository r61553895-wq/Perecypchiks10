import React, { useState } from 'react';
import { 
  Gavel, 
  Clock, 
  TrendingUp, 
  Trophy, 
  Flame, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { ProductImage } from '../ProductImage';
import { CONDITION_LABELS } from '../../data/catalog';

export const AuctionsView: React.FC = () => {
  const { auctions, bidAuction, balance, stats } = useGame();
  const [customBidAmount, setCustomBidAmount] = useState<{ [lotId: string]: string }>({});

  const handleQuickBid = (lotId: string, amount: number) => {
    bidAuction(lotId, amount);
  };

  const handleCustomBid = (lotId: string) => {
    const val = parseInt(customBidAmount[lotId] || '0', 10);
    if (val > 0) {
      bidAuction(lotId, val);
      setCustomBidAmount(prev => ({ ...prev, [lotId]: '' }));
    }
  };

  return (
    <div className="space-y-4 max-w-full pb-8 select-none">
      {/* Header Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-white dark:bg-[#131C31] border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Gavel className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                Живые аукционы
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Забирайте технику дешевле рынка до 50%
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block">Выиграно</span>
            <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-mono">
              {stats.auctionsWon} лотов
            </span>
          </div>
        </div>
      </div>

      {/* Auction Lots */}
      <div className="space-y-4">
        {auctions.map(lot => {
          const isWinning = lot.isPlayerWinning;
          const potentialProfit = lot.marketPrice - lot.currentBid;
          const seconds = lot.secondsRemaining;
          const isUrgent = seconds <= 10;

          return (
            <div 
              key={lot.id} 
              className={`rounded-3xl bg-white dark:bg-[#131C31] border transition-all duration-200 overflow-hidden shadow-xs ${
                isWinning 
                  ? 'border-blue-500 dark:border-blue-500 ring-2 ring-blue-500/20' 
                  : isUrgent 
                    ? 'border-amber-400 dark:border-amber-600' 
                    : 'border-slate-200/90 dark:border-slate-800'
              }`}
            >
              {/* Image & Timers */}
              <div className="relative h-44 sm:h-48 bg-slate-50 dark:bg-[#18233C] overflow-hidden flex items-center justify-center p-2">
                <ProductImage
                  src={lot.image}
                  alt={lot.title}
                  category={lot.category}
                  title={lot.title}
                  containerClassName="w-full h-full"
                  className="w-full h-full object-contain"
                />

                {/* Condition Pill */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded-xl bg-white/90 dark:bg-black/70 backdrop-blur-md text-[11px] font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 flex items-center gap-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{CONDITION_LABELS[lot.condition]?.label || lot.condition}</span>
                </div>

                {/* Countdown Timer Badge */}
                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-xl text-xs font-mono font-bold backdrop-blur-md flex items-center gap-1.5 shadow-xs ${
                  isUrgent 
                    ? 'bg-rose-600 text-white animate-pulse' 
                    : 'bg-white/90 dark:bg-black/75 text-slate-800 dark:text-white border border-slate-200 dark:border-white/10'
                }`}>
                  <Clock className="w-3.5 h-3.5 text-amber-500" />
                  <span>00:{seconds < 10 ? `0${seconds}` : seconds}</span>
                </div>

                {/* Leader Ribbon */}
                <div className="absolute bottom-2 left-3 right-3">
                  <div className={`px-3 py-1.5 rounded-xl backdrop-blur-md text-xs font-semibold flex items-center justify-between border shadow-xs ${
                    isWinning 
                      ? 'bg-blue-650/90 bg-blue-600 text-white border-blue-500' 
                      : 'bg-white/90 dark:bg-black/75 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10'
                  }`}>
                    <span className="flex items-center gap-1.5 truncate">
                      {isWinning ? <Trophy className="w-3.5 h-3.5 text-amber-300" /> : <span className="w-2 h-2 rounded-full bg-slate-400" />}
                      <span className="truncate">{isWinning ? 'Вы лидируете!' : lot.highestBidder}</span>
                    </span>
                    <span className="text-[10px] font-mono opacity-80 shrink-0">
                      {lot.bidCount} ставок
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight truncate">
                  {lot.title}
                </h3>

                {/* Financial Stats Strip */}
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800/80 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Ставка</span>
                    <span className="text-sm font-black font-mono text-blue-600 dark:text-blue-400">
                      ₽ {lot.currentBid.toLocaleString()}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block">Рыночная</span>
                    <span className="text-xs font-medium font-mono text-slate-600 dark:text-slate-300">
                      ₽ {lot.marketPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Выгода</span>
                    <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                      +{potentialProfit.toLocaleString()} ₽
                    </span>
                  </div>
                </div>

                {/* Bid Controls */}
                <div className="space-y-2 pt-1">
                  <div className="grid grid-cols-3 gap-2">
                    {[1000, 5000, 10000].map(step => (
                      <button
                        key={step}
                        onClick={() => handleQuickBid(lot.id, step)}
                        className="h-10 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-xs font-bold text-slate-800 dark:text-slate-200 transition-all font-mono touch-manipulation cursor-pointer"
                      >
                        +{step >= 1000 ? `${step / 1000}к` : step} ₽
                      </button>
                    ))}
                  </div>

                  {/* Custom Bid Row */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Своя сумма..."
                      value={customBidAmount[lot.id] || ''}
                      onChange={(e) => setCustomBidAmount({ ...customBidAmount, [lot.id]: e.target.value })}
                      className="flex-1 h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 text-xs text-slate-900 dark:text-white placeholder-slate-400 font-mono focus:outline-hidden focus:border-blue-500"
                    />
                    <button
                      onClick={() => handleCustomBid(lot.id)}
                      className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs transition-all shadow-md shadow-blue-500/20 shrink-0 touch-manipulation cursor-pointer"
                    >
                      Поставить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
