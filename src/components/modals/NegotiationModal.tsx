import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight,
  Handshake,
  Tag
} from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SELLER_ARCHETYPES, SELLER_MOODS, CONDITION_LABELS } from '../../data/catalog';
import { ActiveNegotiation } from '../../types';
import { ProductImage } from '../ProductImage';

interface NegotiationContentProps {
  negotiation: ActiveNegotiation;
}

const NegotiationModalContent: React.FC<NegotiationContentProps> = ({ negotiation }) => {
  const { 
    closeNegotiation, 
    proposeOffer, 
    acceptCurrentDeal,
    balance,
    currentCommissionRate,
    usedWarehouseSlots,
    maxWarehouseSlots
  } = useGame();

  const { listing, currentSellerOffer, attemptsLeft, maxAttempts, sellerMood, history, status, finalPrice } = negotiation;
  const archetypeInfo = SELLER_ARCHETYPES[listing.sellerArchetype] || SELLER_ARCHETYPES.regular;
  const moodInfo = SELLER_MOODS[sellerMood] || SELLER_MOODS.calm;

  const [offerInput, setOfferInput] = useState<string>('');

  useEffect(() => {
    const defaultOffer = Math.round(currentSellerOffer * 0.9);
    setOfferInput(defaultOffer.toString());
  }, [currentSellerOffer]);

  const numericOffer = parseInt(offerInput, 10) || 0;

  const commission = Math.round(listing.currentMarketPrice * currentCommissionRate);
  const potentialNetProfit = listing.currentMarketPrice - numericOffer - commission - listing.shippingCost;

  const discountFromAsking = currentSellerOffer > 0 
    ? ((currentSellerOffer - numericOffer) / currentSellerOffer) * 100 
    : 0;

  const riskAssessment = useMemo(() => {
    if (numericOffer >= currentSellerOffer) {
      return { level: 'zero', text: 'Гарантированное согласие', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    }
    if (discountFromAsking <= 7) {
      return { level: 'low', text: 'Низкий риск отказа', color: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800' };
    }
    if (discountFromAsking <= 16) {
      return { level: 'moderate', text: 'Умеренный риск торга', color: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800' };
    }
    return { level: 'high', text: 'Высокий риск срыва', color: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800' };
  }, [numericOffer, currentSellerOffer, discountFromAsking]);

  const applyPreset = (discountPct: number) => {
    const newPrice = Math.round(currentSellerOffer * (1 - discountPct / 100));
    setOfferInput(Math.max(1, newPrice).toString());
  };

  const handlePropose = (e: React.FormEvent) => {
    e.preventDefault();
    if (numericOffer <= 0) return;
    proposeOffer(numericOffer);
  };

  const canAfford = balance >= (status === 'accepted' && finalPrice ? finalPrice : currentSellerOffer);
  const hasWarehouseSlot = usedWarehouseSlots < maxWarehouseSlots;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-lg bg-white dark:bg-[#131C31] border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-slate-900 dark:text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Handshake className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Торг с продавцом</h2>
          </div>
          <button 
            onClick={closeNegotiation}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs">
          {/* Item Banner */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
            <div className="w-14 h-14 rounded-xl shrink-0 bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 overflow-hidden p-1 flex items-center justify-center">
              <ProductImage 
                src={listing.image} 
                alt={listing.title} 
                title={listing.title}
                category={listing.category}
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5">
                <span className="uppercase font-mono font-bold text-slate-600 dark:text-slate-300">{listing.brand}</span>
                <span>•</span>
                <span>{CONDITION_LABELS[listing.condition]?.label || listing.condition}</span>
              </div>
              <div className="font-bold text-slate-900 dark:text-white text-xs truncate">
                {listing.title}
              </div>
              <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-0.5">
                Рыночная: <span className="font-bold text-slate-800 dark:text-slate-200">~{listing.currentMarketPrice.toLocaleString()} ₽</span>
              </div>
            </div>
          </div>

          {/* Seller Patience */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-[#18233C] border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 block">Тип продавца</span>
              <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{archetypeInfo.label}</span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Терпение ({attemptsLeft}/{maxAttempts})</span>
              <div className="flex items-center gap-1 mt-1 justify-end">
                {Array.from({ length: maxAttempts }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-2.5 h-3 rounded-xs transition-all ${
                      i < attemptsLeft ? 'bg-blue-600 dark:bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Dialogue Log */}
          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {history.map((msg, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'seller'
                    ? 'bg-slate-100 dark:bg-[#18233C] text-slate-800 dark:text-slate-200 mr-4'
                    : 'bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200 dark:border-blue-800/60 ml-4'
                }`}
              >
                <div className="text-[10px] font-bold opacity-75 mb-0.5">
                  {msg.sender === 'seller' ? 'Продавец' : 'Вы'}
                </div>
                <div>{msg.text}</div>
                {msg.price && (
                  <div className="font-mono font-bold text-xs mt-1">
                    ₽ {msg.price.toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Status Result */}
          {status === 'accepted' && (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
              <div className="flex items-center justify-center gap-1.5 text-emerald-800 dark:text-emerald-200 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Сделка согласована на сумму ₽ {(finalPrice || currentSellerOffer).toLocaleString()}!</span>
              </div>
              <button
                onClick={acceptCurrentDeal}
                disabled={!canAfford || !hasWarehouseSlot}
                className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold text-xs shadow-md"
              >
                Забрать в инвентарь (₽{(finalPrice || currentSellerOffer).toLocaleString()})
              </button>
            </div>
          )}

          {status === 'rejected' && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-center space-y-2">
              <div className="text-rose-800 dark:text-rose-200 font-bold text-xs">
                Продавец вышел из диалога. Лот недоступен для торга.
              </div>
              <button
                onClick={closeNegotiation}
                className="w-full h-10 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs"
              >
                Закрыть
              </button>
            </div>
          )}

          {/* Offer Controls when active */}
          {status === 'active' && (
            <form onSubmit={handlePropose} className="space-y-3 pt-1">
              {/* Presets */}
              <div className="grid grid-cols-4 gap-1.5">
                {[5, 10, 15, 20].map(pct => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => applyPreset(pct)}
                    className="py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold text-slate-700 dark:text-slate-300 text-xs transition-colors"
                  >
                    -{pct}%
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-slate-400">₽</span>
                  <input
                    type="number"
                    value={offerInput}
                    onChange={e => setOfferInput(e.target.value)}
                    className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono font-bold text-slate-900 dark:text-white text-sm focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={numericOffer <= 0 || attemptsLeft <= 0}
                  className="h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs shadow-md shadow-blue-500/20"
                >
                  Предложить
                </button>
              </div>

              {/* Quick Accept Current Price Button */}
              <button
                type="button"
                onClick={acceptCurrentDeal}
                disabled={!canAfford || !hasWarehouseSlot}
                className="w-full h-11 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
              >
                Согласиться на ₽{currentSellerOffer.toLocaleString()}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export const NegotiationModal: React.FC = () => {
  const { activeNegotiation } = useGame();
  if (!activeNegotiation) return null;
  return <NegotiationModalContent negotiation={activeNegotiation} />;
};
