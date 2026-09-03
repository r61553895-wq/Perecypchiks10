import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Percent, 
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

  // Local state for custom offer
  const [offerInput, setOfferInput] = useState<string>('');

  // Default offer input is 10% discount from current seller offer
  useEffect(() => {
    const defaultOffer = Math.round(currentSellerOffer * 0.9);
    setOfferInput(defaultOffer.toString());
  }, [currentSellerOffer]);

  const numericOffer = parseInt(offerInput, 10) || 0;

  // Financial calculations for proposed offer
  const commission = Math.round(listing.currentMarketPrice * currentCommissionRate);
  const potentialNetProfit = listing.currentMarketPrice - numericOffer - commission - listing.shippingCost;
  const potentialMargin = listing.currentMarketPrice > 0 
    ? Math.round((potentialNetProfit / listing.currentMarketPrice) * 100) 
    : 0;

  // Risk evaluation
  const discountFromAsking = currentSellerOffer > 0 
    ? ((currentSellerOffer - numericOffer) / currentSellerOffer) * 100 
    : 0;

  const riskAssessment = useMemo(() => {
    if (numericOffer >= currentSellerOffer) {
      return { level: 'zero', text: 'Гарантированное согласие', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (discountFromAsking <= 7) {
      return { level: 'low', text: 'Низкий риск отказа', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    }
    if (discountFromAsking <= 16) {
      return { level: 'moderate', text: 'Умеренный риск торга', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    }
    return { level: 'high', text: 'Высокий риск срыва сделки', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  }, [numericOffer, currentSellerOffer, discountFromAsking]);

  // Latest seller message
  const lastSellerMessage = useMemo(() => {
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].sender === 'seller') return history[i];
    }
    return null;
  }, [history]);

  // Quick preset apply
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white border border-zinc-200 rounded-xl shadow-xl overflow-hidden animate-in zoom-in-98 duration-150 flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2">
            <Handshake className="w-4 h-4 text-zinc-900" />
            <h2 className="text-sm font-bold text-zinc-900">Переговоры с продавцом</h2>
          </div>
          <button 
            onClick={closeNegotiation}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            title="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          {/* Item Banner */}
          <div className="flex items-center gap-3 p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
            <div className="w-14 h-14 rounded-md border border-zinc-200 shrink-0 bg-zinc-900 overflow-hidden">
              <ProductImage 
                src={listing.image} 
                alt={listing.title} 
                title={listing.title}
                category={listing.category}
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] text-zinc-500 mb-0.5">
                <span className="uppercase font-mono tracking-wider">{listing.brand}</span>
                <span>•</span>
                <span className={`px-1.5 py-0.2 rounded font-medium border ${CONDITION_LABELS[listing.condition].badgeColor}`}>
                  {CONDITION_LABELS[listing.condition].label}
                </span>
              </div>
              <div className="font-semibold text-zinc-900 text-xs truncate leading-snug">
                {listing.title}
              </div>
              <div className="flex items-center gap-2 mt-1 text-[11px]">
                <span className="text-zinc-500">
                  Рыночная цена: <span className="font-mono font-medium text-zinc-800">{listing.currentMarketPrice.toLocaleString()} ₽</span>
                </span>
              </div>
            </div>
          </div>

          {/* Seller Profile & Negotiation Indicators */}
          <div className="grid grid-cols-2 gap-2">
            {/* Archetype & Mood */}
            <div className="p-2.5 rounded-lg border border-zinc-200 bg-white">
              <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                Тип продавца
              </div>
              <div className="flex flex-col gap-1">
                <span className={`inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] font-medium border ${archetypeInfo.badgeColor}`}>
                  {archetypeInfo.label}
                </span>
                <span className={`inline-flex items-center self-start px-2 py-0.5 rounded text-[10px] border ${moodInfo.badgeColor}`}>
                  {moodInfo.label}
                </span>
              </div>
            </div>

            {/* Attempts Remaining */}
            <div className="p-2.5 rounded-lg border border-zinc-200 bg-white flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1">
                  Попыток торга
                </div>
                <div className="font-mono font-bold text-sm text-zinc-900">
                  {attemptsLeft} <span className="text-xs font-normal text-zinc-400">из {maxAttempts}</span>
                </div>
              </div>
              {/* Attempt Pips */}
              <div className="flex items-center gap-1 mt-1.5">
                {Array.from({ length: maxAttempts }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full ${
                      i < attemptsLeft 
                        ? 'bg-zinc-900' 
                        : 'bg-zinc-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Price Benchmarks: Asking vs Target */}
          <div className="p-3 rounded-lg bg-zinc-900 text-white flex items-center justify-between">
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Цена продавца сейчас</div>
              <div className="text-xl font-bold font-mono">
                {currentSellerOffer.toLocaleString()} ₽
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Рыночная стоимость</div>
              <div className="text-base font-semibold font-mono text-zinc-300">
                ~{listing.currentMarketPrice.toLocaleString()} ₽
              </div>
            </div>
          </div>

          {/* Latest Seller Message */}
          {lastSellerMessage && (
            <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 text-xs text-zinc-700 leading-relaxed">
              <span className="font-semibold text-zinc-900 mr-1.5">Ответ продавца:</span>
              <span>«{lastSellerMessage.text}»</span>
            </div>
          )}

          {/* Deal Outcome Banner (if settled or refused) */}
          {status === 'accepted' && (
            <div className="p-3.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-900 flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-xs">Договорённость достигнута!</div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  Продавец согласен отдать товар за <span className="font-mono font-bold">{(finalPrice || currentSellerOffer).toLocaleString()} ₽</span>.
                </div>
              </div>
              <button
                onClick={acceptCurrentDeal}
                disabled={!canAfford || !hasWarehouseSlot}
                className="px-3.5 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors shadow-xs shrink-0 disabled:opacity-50"
              >
                Забрать товар
              </button>
            </div>
          )}

          {status === 'rejected' && (
            <div className="p-3.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <div className="font-bold text-xs">Сделка сорвана</div>
                  <div className="text-[11px] text-rose-700 mt-0.5">Продавец отказался от переговоров.</div>
                </div>
              </div>
              <button
                onClick={closeNegotiation}
                className="px-3 py-1.5 rounded-md border border-rose-300 bg-white text-rose-800 hover:bg-rose-100 font-semibold text-xs transition-colors"
              >
                Закрыть
              </button>
            </div>
          )}

          {/* Offer Controls (only when active) */}
          {status === 'active' && (
            <div className="space-y-3 pt-1">
              {/* Quick Discount Presets */}
              <div>
                <div className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Быстрые варианты скидки</span>
                  <span className="text-zinc-500">от {currentSellerOffer.toLocaleString()} ₽</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyPreset(5)}
                    className="py-1.5 px-2 rounded-md border border-zinc-200 hover:bg-zinc-100 font-mono text-xs font-semibold text-zinc-800 transition-colors text-center"
                  >
                    −5%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(10)}
                    className="py-1.5 px-2 rounded-md border border-zinc-200 hover:bg-zinc-100 font-mono text-xs font-semibold text-zinc-800 transition-colors text-center"
                  >
                    −10%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(15)}
                    className="py-1.5 px-2 rounded-md border border-zinc-200 hover:bg-zinc-100 font-mono text-xs font-semibold text-zinc-800 transition-colors text-center"
                  >
                    −15%
                  </button>
                  <button
                    type="button"
                    onClick={() => applyPreset(20)}
                    className="py-1.5 px-2 rounded-md border border-zinc-200 hover:bg-zinc-100 font-mono text-xs font-semibold text-zinc-800 transition-colors text-center"
                  >
                    −20%
                  </button>
                </div>
              </div>

              {/* Offer Input & Calculation */}
              <form onSubmit={handlePropose} className="space-y-3">
                <div>
                  <label className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider block mb-1">
                    Ваше предложение (₽)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-zinc-400">₽</span>
                      <input
                        type="number"
                        min="1"
                        max={currentSellerOffer}
                        value={offerInput}
                        onChange={e => setOfferInput(e.target.value)}
                        className="w-full pl-7 pr-3 py-2 rounded-lg border border-zinc-200 text-sm font-mono font-bold text-zinc-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-zinc-900"
                        placeholder="Своя цена"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={attemptsLeft <= 0 || numericOffer <= 0 || numericOffer > balance}
                      className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 active:scale-98 text-white font-semibold text-xs transition-all shadow-2xs disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      Предложить
                    </button>
                  </div>
                </div>

                {/* Live Financial & Risk Metrics */}
                <div className="p-2.5 rounded-lg border border-zinc-200 bg-zinc-50/70 flex items-center justify-between gap-3 text-[11px]">
                  <div>
                    <span className="text-zinc-500">Ожидаемая чистая прибыль:</span>{' '}
                    <span className={`font-mono font-bold ${
                      potentialNetProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'
                    }`}>
                      {potentialNetProfit >= 0 ? '+' : ''}{potentialNetProfit.toLocaleString()} ₽ ({potentialMargin}%)
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${riskAssessment.color}`}>
                    {riskAssessment.text}
                  </span>
                </div>
              </form>

              {/* Instant Buy Alternative Button */}
              <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">
                  Согласны с ценой продавца?
                </span>
                <button
                  type="button"
                  onClick={acceptCurrentDeal}
                  disabled={!canAfford || !hasWarehouseSlot}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 text-zinc-800 hover:bg-zinc-100 text-xs font-semibold transition-colors disabled:opacity-40"
                >
                  <span>Забрать за {currentSellerOffer.toLocaleString()} ₽</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
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

