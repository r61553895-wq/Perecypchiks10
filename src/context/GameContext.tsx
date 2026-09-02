import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  InventoryItem, 
  MarketListing, 
  CompletedSale, 
  MarketEvent, 
  BusinessUpgrade, 
  DayFinancialRecord, 
  GameStats, 
  NavigationTab,
  DemandLevel,
  ItemCondition,
  SellerArchetype,
  SellerMood,
  ActiveNegotiation,
  NegotiationRound
} from '../types';
import { 
  INITIAL_PRODUCT_TEMPLATES, 
  INITIAL_UPGRADES, 
  POSSIBLE_EVENTS, 
  LEVEL_DEFINITIONS,
  CONDITION_LABELS,
  SELLER_ARCHETYPES
} from '../data/catalog';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'deal';
  timestamp: number;
}

interface GameContextType {
  day: number;
  balance: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  reputation: number;
  inventory: InventoryItem[];
  marketListings: MarketListing[];
  salesHistory: CompletedSale[];
  financialHistory: DayFinancialRecord[];
  upgrades: BusinessUpgrade[];
  activeEvents: MarketEvent[];
  stats: GameStats;
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  selectedMarketItem: MarketListing | null;
  setSelectedMarketItem: (item: MarketListing | null) => void;
  listingModalItem: InventoryItem | null;
  setListingModalItem: (item: InventoryItem | null) => void;
  notifications: NotificationItem[];
  dismissNotification: (id: string) => void;
  
  // Warehouse capacity & upgrades calculations
  maxWarehouseSlots: number;
  usedWarehouseSlots: number;
  currentCommissionRate: number; // e.g. 0.08 (8%)
  shippingDiscountRate: number; // e.g. 0.2 (20%)
  
  // Negotiation mechanics
  activeNegotiation: ActiveNegotiation | null;
  startNegotiation: (listingId: string) => void;
  proposeOffer: (offerPrice: number) => { status: 'accepted' | 'counter' | 'rejected'; message: string; counterPrice?: number };
  acceptCurrentDeal: () => boolean;
  closeNegotiation: () => void;

  // Actions
  buyItem: (listingId: string) => boolean;
  listItemForSale: (itemId: string, price: number) => void;
  unlistItem: (itemId: string) => void;
  quickSellWholesale: (itemId: string) => void;
  advanceDay: () => void;
  purchaseUpgrade: (upgradeId: string) => boolean;
  resetGame: () => void;
  isAutoPlay: boolean;
  setIsAutoPlay: (auto: boolean) => void;
  gameSpeed: number;
  setGameSpeed: (speed: number) => void;
}

const STORAGE_KEY = 'reseller_simulator_save_rub_v1';
const INITIAL_BALANCE = 125000; // Starting capital in ₽

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [day, setDay] = useState<number>(1);
  const [balance, setBalance] = useState<number>(INITIAL_BALANCE);
  const [level, setLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);
  const [reputation, setReputation] = useState<number>(4.85);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [marketListings, setMarketListings] = useState<MarketListing[]>([]);
  const [salesHistory, setSalesHistory] = useState<CompletedSale[]>([]);
  const [financialHistory, setFinancialHistory] = useState<DayFinancialRecord[]>([
    {
      day: 1,
      balance: INITIAL_BALANCE,
      dailyRevenue: 0,
      dailyExpenses: 0,
      dailyNetProfit: 0,
      inventoryValuation: 0
    }
  ]);
  const [upgrades, setUpgrades] = useState<BusinessUpgrade[]>(INITIAL_UPGRADES);
  const [activeEvents, setActiveEvents] = useState<MarketEvent[]>([]);
  const [stats, setStats] = useState<GameStats>({
    totalRevenue: 0,
    totalExpenses: 0,
    totalFeesPaid: 0,
    totalShippingPaid: 0,
    totalNetProfit: 0,
    itemsBought: 0,
    itemsSold: 0,
    profitableSales: 0,
    unprofitableSales: 0,
    bestSingleProfit: 0,
    fastestSaleDays: 99
  });
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketListing | null>(null);
  const [listingModalItem, setListingModalItem] = useState<InventoryItem | null>(null);
  const [activeNegotiation, setActiveNegotiation] = useState<ActiveNegotiation | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(1); // 1 = 3s per day, 2 = 1.5s per day

  // Computed Upgrade Effects
  const warehouseUpgrade = upgrades.find(u => u.effectType === 'warehouse_capacity');
  const maxWarehouseSlots = 8 + ((warehouseUpgrade ? warehouseUpgrade.level : 0) * 6);
  const usedWarehouseSlots = inventory.filter(i => i.status !== 'sold').length;

  const commissionUpgrade = upgrades.find(u => u.effectType === 'fee_discount');
  const currentCommissionRate = Math.max(0.03, 0.08 - ((commissionUpgrade ? commissionUpgrade.level : 0) * 0.012));

  const shippingUpgrade = upgrades.find(u => u.effectType === 'shipping_discount');
  const shippingDiscountRate = Math.min(0.6, (shippingUpgrade ? shippingUpgrade.level : 0) * 0.2);

  const qaUpgrade = upgrades.find(u => u.effectType === 'deal_radar');
  const qaBonus = (qaUpgrade ? qaUpgrade.level : 0) * 0.15;

  const repUpgrade = upgrades.find(u => u.effectType === 'reputation_boost');
  const repBonus = (repUpgrade ? repUpgrade.level : 0) * 0.12;

  const nextLevelDefinition = LEVEL_DEFINITIONS.find(l => l.level === level + 1);
  const nextLevelXp = nextLevelDefinition ? nextLevelDefinition.xpRequired : 999999;

  const dismissNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // Add Notification helper - automatically auto-dismisses in 2 seconds
  const addNotification = useCallback((title: string, message: string, type: 'success' | 'info' | 'warning' | 'deal' = 'info') => {
    const notifId = 'notif_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newNotif: NotificationItem = {
      id: notifId,
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 3)]);

    // 2-second auto-dismissal
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== notifId));
    }, 2000);
  }, []);

  // Generate Market Listings
  const generateMarketListings = useCallback((currentDay: number, currentLevel: number, events: MarketEvent[]) => {
    const availableTemplates = INITIAL_PRODUCT_TEMPLATES.filter(t => t.requiredLevel <= currentLevel);
    const conditions: ItemCondition[] = ['new', 'like_new', 'good', 'fair'];
    const count = 7 + Math.floor(Math.random() * 5); // 7 to 11 listings

    const sellerNotes = [
      'Срочно нужны деньги перед отпуском.',
      'Куплен в официальном магазине, чеки в наличии.',
      'Подарили на юбилей, не распечатывал.',
      'Бережное домашнее использование без сколов.',
      'Полный заводской комплект с коробкой.',
      'Перешел на старшую модель, продаю за ненадобностью.',
      'Витринный образец без царапин.'
    ];

    const newListings: MarketListing[] = [];

    for (let i = 0; i < count; i++) {
      const template = availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
      const condition = conditions[Math.floor(Math.random() * conditions.length)];
      const condMultiplier = CONDITION_LABELS[condition].multiplier;

      // Event multiplier if category matches
      const activeEvent = events.find(e => e.categoryAffected === template.category);
      const eventMultiplier = activeEvent ? activeEvent.priceMultiplier : 1.0;

      // Volatility variation
      const randomVariance = (Math.random() * 2 - 1) * template.volatility;
      const currentMarketPrice = Math.round(template.baseMarketPrice * condMultiplier * eventMultiplier * (1 + randomVariance));

      // Determine Archetype and Mood
      const rollArch = Math.random();
      let sellerArchetype: SellerArchetype = 'regular';
      if (rollArch < 0.18) sellerArchetype = 'urgent';
      else if (rollArch < 0.34) sellerArchetype = 'clueless';
      else if (rollArch < 0.50) sellerArchetype = 'regular';
      else if (rollArch < 0.68) sellerArchetype = 'pro';
      else if (rollArch < 0.84) sellerArchetype = 'stubborn';
      else sellerArchetype = 'reseller';

      let sellerMood: SellerMood = 'calm';
      let maxAttempts = 4;
      let minRatio = 0.72;

      if (sellerArchetype === 'urgent') {
        sellerMood = Math.random() < 0.7 ? 'urgent_cash' : 'ready_to_sell';
        maxAttempts = 5;
        minRatio = 0.56 + Math.random() * 0.08;
      } else if (sellerArchetype === 'stubborn') {
        sellerMood = Math.random() < 0.5 ? 'neutral' : 'irritated';
        maxAttempts = 3;
        minRatio = 0.88 + Math.random() * 0.05;
      } else if (sellerArchetype === 'pro') {
        sellerMood = 'calm';
        maxAttempts = 4;
        minRatio = 0.76 + Math.random() * 0.05;
      } else if (sellerArchetype === 'clueless') {
        sellerMood = Math.random() < 0.6 ? 'ready_to_sell' : 'calm';
        maxAttempts = 4;
        minRatio = 0.54 + Math.random() * 0.10;
      } else if (sellerArchetype === 'reseller') {
        sellerMood = 'neutral';
        maxAttempts = 3;
        minRatio = 0.83 + Math.random() * 0.05;
      } else {
        sellerMood = Math.random() < 0.3 ? 'ready_to_sell' : Math.random() < 0.6 ? 'calm' : 'neutral';
        maxAttempts = 4;
        minRatio = 0.68 + Math.random() * 0.08;
      }

      // Asking price tailored to archetype
      let askingRatio = minRatio + 0.07 + Math.random() * 0.12;
      if (sellerArchetype === 'urgent') askingRatio = Math.min(0.78, minRatio + 0.07);
      if (sellerArchetype === 'stubborn') askingRatio = Math.max(0.96, minRatio + 0.04);
      if (sellerArchetype === 'clueless') askingRatio = Math.min(0.74, minRatio + 0.08);

      const sellerAskingPrice = Math.round(currentMarketPrice * askingRatio);
      const minAcceptablePrice = Math.min(sellerAskingPrice, Math.round(currentMarketPrice * minRatio));
      const isBargain = sellerAskingPrice <= currentMarketPrice * 0.76;
      const isOverpriced = sellerAskingPrice >= currentMarketPrice * 0.98;

      // Shipping cost adjusted
      const baseShipping = Math.max(100, Math.round(template.shippingCost * (1 - shippingDiscountRate)));

      // Demand determination
      let demand: DemandLevel = 'medium';
      if (activeEvent?.demandShift) {
        demand = activeEvent.demandShift;
      } else if (isBargain) {
        demand = 'high';
      } else {
        const dRoll = Math.random();
        if (dRoll < 0.25) demand = 'low';
        else if (dRoll < 0.7) demand = 'medium';
        else demand = 'high';
      }

      newListings.push({
        id: `mkt_${currentDay}_${i}_${template.id}`,
        templateId: template.id,
        title: template.title,
        category: template.category,
        condition,
        sellerAskingPrice,
        currentMarketPrice,
        demand,
        shippingCost: baseShipping,
        image: template.image,
        brand: template.brand,
        daysRemaining: Math.floor(Math.random() * 3) + 2,
        sellerNote: sellerNotes[Math.floor(Math.random() * sellerNotes.length)],
        isBargainDeal: isBargain,
        isOverpriced,
        sellerArchetype,
        sellerMood,
        maxAttempts,
        minAcceptablePrice
      });
    }

    // Sort: bargains on top or mixed
    return newListings;
  }, [shippingDiscountRate]);

  // Advance Day Simulation
  const advanceDay = useCallback(() => {
    setDay(prevDay => {
      const nextDay = prevDay + 1;

      // 1. Process active market events (reduce duration or trigger new)
      let updatedEvents = activeEvents
        .map(e => ({ ...e, durationDays: e.durationDays - 1 }))
        .filter(e => e.durationDays > 0);

      // Random chance for a new event every 4-8 days
      if (updatedEvents.length === 0 && Math.random() < 0.28) {
        const potentialEvent = POSSIBLE_EVENTS[Math.floor(Math.random() * POSSIBLE_EVENTS.length)];
        const newEvent: MarketEvent = {
          ...potentialEvent,
          startDay: nextDay
        };
        updatedEvents = [newEvent];
        addNotification(newEvent.title, newEvent.description, 'deal');
      }
      setActiveEvents(updatedEvents);

      // 2. Process Sales for Listed Inventory Items
      let salesTodayProfit = 0;
      let salesTodayRevenue = 0;
      let salesTodayCount = 0;
      const newCompletedSales: CompletedSale[] = [];

      setInventory(prevInventory => {
        const nextInventory: InventoryItem[] = [];

        prevInventory.forEach(item => {
          if (item.status === 'in_warehouse') {
            // Aged in warehouse
            nextInventory.push({
              ...item,
              daysInWarehouse: item.daysInWarehouse + 1
            });
          } else if (item.status === 'listed') {
            const listPrice = item.listingPrice || item.currentMarketPrice;
            const priceRatio = listPrice / item.currentMarketPrice;

            // Calculate sale probability
            let prob = 0.45;
            if (priceRatio <= 0.82) prob = 0.92;
            else if (priceRatio <= 0.92) prob = 0.75;
            else if (priceRatio <= 1.02) prob = 0.52;
            else if (priceRatio <= 1.12) prob = 0.32;
            else if (priceRatio <= 1.25) prob = 0.15;
            else prob = 0.04; // Overpriced

            // Modifiers
            if (item.demand === 'surge') prob += 0.25;
            if (item.demand === 'high') prob += 0.12;
            if (item.demand === 'low') prob -= 0.18;

            prob += qaBonus;
            prob += repBonus;

            // Condition modifier
            if (item.condition === 'new') prob += 0.1;
            if (item.condition === 'fair') prob -= 0.1;

            const isSold = Math.random() < Math.max(0.05, Math.min(0.98, prob));

            if (isSold) {
              const fee = Math.round(listPrice * currentCommissionRate);
              const shipping = item.shippingCost;
              const netPayout = listPrice - fee - shipping;
              const netProfit = netPayout - item.purchasePrice;
              const margin = Math.round((netProfit / listPrice) * 100);
              const daysToSell = item.daysInWarehouse + 1;

              salesTodayRevenue += listPrice;
              salesTodayProfit += netProfit;
              salesTodayCount++;

              newCompletedSales.push({
                id: `sale_${item.id}_${nextDay}`,
                itemId: item.id,
                title: item.title,
                category: item.category,
                condition: item.condition,
                purchasePrice: item.purchasePrice,
                sellPrice: listPrice,
                fee,
                shipping,
                netProfit,
                marginPercent: margin,
                purchaseDay: item.purchaseDay,
                soldDay: nextDay,
                daysToSell
              });

              // Add funds
              setBalance(b => b + netPayout);

              // Add XP
              const earnedXp = Math.max(15, Math.floor(Math.abs(netProfit) * 1.8));
              setXp(x => x + earnedXp);

              // Update rating
              setReputation(r => Math.min(5.0, +(r + 0.01).toFixed(2)));

              addNotification(
                'Товар успешно продан',
                `${item.title} продан за ${listPrice.toLocaleString()} ₽. Чистая прибыль: ${netProfit >= 0 ? '+' : ''}${netProfit.toLocaleString()} ₽`,
                netProfit >= 0 ? 'success' : 'warning'
              );
            } else {
              // Still listed
              nextInventory.push({
                ...item,
                daysInWarehouse: item.daysInWarehouse + 1
              });
            }
          }
        });

        return nextInventory;
      });

      // 3. Update Sales History & Stats
      if (newCompletedSales.length > 0) {
        setSalesHistory(prev => [...newCompletedSales, ...prev]);

        setStats(prevStats => {
          let feesPaid = 0;
          let shipPaid = 0;
          let bestProfit = prevStats.bestSingleProfit;
          let fastest = prevStats.fastestSaleDays;
          let profitable = prevStats.profitableSales;
          let unprofitable = prevStats.unprofitableSales;

          newCompletedSales.forEach(s => {
            feesPaid += s.fee;
            shipPaid += s.shipping;
            if (s.netProfit > bestProfit) bestProfit = s.netProfit;
            if (s.daysToSell < fastest) fastest = s.daysToSell;
            if (s.netProfit >= 0) profitable++;
            else unprofitable++;
          });

          return {
            ...prevStats,
            totalRevenue: prevStats.totalRevenue + salesTodayRevenue,
            totalNetProfit: prevStats.totalNetProfit + salesTodayProfit,
            totalFeesPaid: prevStats.totalFeesPaid + feesPaid,
            totalShippingPaid: prevStats.totalShippingPaid + shipPaid,
            itemsSold: prevStats.itemsSold + salesTodayCount,
            profitableSales: profitable,
            unprofitableSales: unprofitable,
            bestSingleProfit: bestProfit,
            fastestSaleDays: fastest
          };
        });
      }

      // 4. Generate Fresh Market Listings
      const freshListings = generateMarketListings(nextDay, level, updatedEvents);
      setMarketListings(freshListings);

      // 5. Update Financial History Record
      setFinancialHistory(prev => {
        const lastRecord = prev[prev.length - 1];
        const record: DayFinancialRecord = {
          day: nextDay,
          balance: balance + salesTodayRevenue,
          dailyRevenue: salesTodayRevenue,
          dailyExpenses: 0,
          dailyNetProfit: salesTodayProfit,
          inventoryValuation: 0 // will be computed
        };
        return [...prev.slice(-30), record];
      });

      // 6. Check Level Up
      setLevel(currentLvl => {
        const nextDef = LEVEL_DEFINITIONS.find(l => l.level === currentLvl + 1);
        if (nextDef && xp >= nextDef.xpRequired) {
          addNotification(
            'Новый уровень бизнеса!',
            `Поздравляем! Вы достигли ранга "${nextDef.title}". Открыты новые категории товаров.`,
            'deal'
          );
          return currentLvl + 1;
        }
        return currentLvl;
      });

      return nextDay;
    });
  }, [
    activeEvents,
    qaBonus,
    repBonus,
    currentCommissionRate,
    level,
    xp,
    balance,
    generateMarketListings,
    addNotification
  ]);

  // Initial market listings on load
  useEffect(() => {
    if (marketListings.length === 0) {
      setMarketListings(generateMarketListings(1, 1, []));
    }
  }, [generateMarketListings, marketListings.length]);

  // Auto-play timer
  useEffect(() => {
    if (!isAutoPlay) return;
    const intervalMs = gameSpeed === 1 ? 3000 : gameSpeed === 2 ? 1800 : 900;
    const timer = setInterval(() => {
      advanceDay();
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isAutoPlay, gameSpeed, advanceDay]);

  // Negotiation Mechanics
  const startNegotiation = useCallback((listingId: string) => {
    const listing = marketListings.find(m => m.id === listingId);
    if (!listing) return;

    const initialRound: NegotiationRound = {
      sender: 'seller',
      price: listing.sellerAskingPrice,
      text: listing.sellerNote || `Цена — ${listing.sellerAskingPrice.toLocaleString()} ₽. Готов обсудить предложение.`,
      timestamp: Date.now()
    };

    setActiveNegotiation({
      listing,
      currentSellerOffer: listing.sellerAskingPrice,
      playerLastOffer: null,
      attemptsLeft: listing.maxAttempts,
      maxAttempts: listing.maxAttempts,
      sellerMood: listing.sellerMood,
      history: [initialRound],
      status: 'active'
    });
  }, [marketListings]);

  const proposeOffer = useCallback((offerPrice: number) => {
    if (!activeNegotiation || activeNegotiation.status !== 'active') {
      return { status: 'rejected' as const, message: 'Переговоры не активны' };
    }

    const { listing, currentSellerOffer, attemptsLeft } = activeNegotiation;
    const archetypeDef = SELLER_ARCHETYPES[listing.sellerArchetype] || SELLER_ARCHETYPES.regular;

    if (offerPrice <= 0 || isNaN(offerPrice)) {
      addNotification('Некорректная сумма', 'Укажите положительную цену предложения.', 'warning');
      return { status: 'rejected' as const, message: 'Некорректная сумма' };
    }

    if (balance < offerPrice) {
      addNotification('Недостаточно средств', `У вас только ${balance.toLocaleString()} ₽`, 'warning');
      return { status: 'rejected' as const, message: 'Недостаточно средств' };
    }

    const newAttemptsLeft = attemptsLeft - 1;
    const isOutOfAttempts = newAttemptsLeft <= 0;
    const discountFromAsking = (currentSellerOffer - offerPrice) / currentSellerOffer;
    const minFloor = listing.minAcceptablePrice;

    let outcomeStatus: 'accepted' | 'counter' | 'rejected' = 'counter';
    let responseText = '';
    let counterPrice: number | undefined;
    let nextMood: SellerMood = activeNegotiation.sellerMood;

    // 1. Instant accept if player meets or exceeds seller asking price
    if (offerPrice >= currentSellerOffer) {
      outcomeStatus = 'accepted';
      responseText = `Отлично! По рукам, забирайте за ${offerPrice.toLocaleString()} ₽.`;
      nextMood = 'ready_to_sell';
    }
    // 2. Insulting lowball
    else if (discountFromAsking > 0.40 || offerPrice < minFloor * 0.72) {
      nextMood = 'irritated';
      if (isOutOfAttempts || listing.sellerArchetype === 'stubborn' || listing.sellerArchetype === 'reseller') {
        outcomeStatus = 'rejected';
        responseText = 'Это несерьезно. За такие копейки я лучше оставлю вещь себе. Сделки не будет.';
      } else {
        outcomeStatus = 'counter';
        counterPrice = currentSellerOffer; // Refuses to lower price
        responseText = `Слишком низкая цена. Не тратьте моё время, меньше ${currentSellerOffer.toLocaleString()} ₽ не отдам.`;
      }
    }
    // 3. Realistic offer at or above minimum acceptable price
    else if (offerPrice >= minFloor) {
      const immediateAcceptDiscount = 
        listing.sellerArchetype === 'urgent' ? 0.16 :
        listing.sellerArchetype === 'clueless' ? 0.12 :
        listing.sellerArchetype === 'stubborn' ? 0.04 : 0.07;

      if (discountFromAsking <= immediateAcceptDiscount || (isOutOfAttempts && offerPrice >= minFloor * 1.02)) {
        outcomeStatus = 'accepted';
        responseText = `Хорошо, договорились! Забирайте за ${offerPrice.toLocaleString()} ₽.`;
        nextMood = 'ready_to_sell';
      } else {
        const flexibility = archetypeDef.flexibility;
        const drop = Math.max(200, Math.round((currentSellerOffer - offerPrice) * flexibility));
        counterPrice = Math.max(minFloor, currentSellerOffer - drop);

        if (counterPrice >= currentSellerOffer) {
          counterPrice = Math.max(minFloor, currentSellerOffer - 200);
        }

        if (isOutOfAttempts || newAttemptsLeft === 1) {
          responseText = `Моя последняя цена — ${counterPrice.toLocaleString()} ₽. Ни рублём меньше.`;
        } else {
          responseText = `Слишком мало. Могу уступить до ${counterPrice.toLocaleString()} ₽.`;
        }
      }
    }
    // 4. Offer below minFloor but not insulting
    else {
      if (isOutOfAttempts) {
        outcomeStatus = 'rejected';
        responseText = 'Мы не договорились по цене. Сделки не будет.';
        nextMood = 'calm';
      } else {
        outcomeStatus = 'counter';
        const step = Math.max(200, Math.round((currentSellerOffer - minFloor) * 0.35));
        counterPrice = Math.max(minFloor, currentSellerOffer - step);

        if (newAttemptsLeft === 1) {
          responseText = `Меньше ${counterPrice.toLocaleString()} ₽ я точно не отдам. Это предел.`;
        } else {
          responseText = `За ${offerPrice.toLocaleString()} ₽ не отдам. Могу снизить только до ${counterPrice.toLocaleString()} ₽.`;
        }
      }
    }

    setActiveNegotiation(prev => {
      if (!prev) return null;
      const playerRound: NegotiationRound = {
        sender: 'player',
        price: offerPrice,
        text: `Предлагаю ${offerPrice.toLocaleString()} ₽`,
        timestamp: Date.now()
      };
      const sellerRound: NegotiationRound = {
        sender: 'seller',
        price: counterPrice ?? offerPrice,
        text: responseText,
        timestamp: Date.now() + 10
      };

      return {
        ...prev,
        playerLastOffer: offerPrice,
        currentSellerOffer: counterPrice !== undefined ? counterPrice : prev.currentSellerOffer,
        attemptsLeft: newAttemptsLeft,
        sellerMood: nextMood,
        status: outcomeStatus === 'accepted' ? 'accepted' : outcomeStatus === 'rejected' ? 'rejected' : 'active',
        finalPrice: outcomeStatus === 'accepted' ? offerPrice : undefined,
        history: [...prev.history, playerRound, sellerRound]
      };
    });

    return { status: outcomeStatus, message: responseText, counterPrice };
  }, [activeNegotiation, balance, addNotification]);

  const acceptCurrentDeal = useCallback((): boolean => {
    if (!activeNegotiation) return false;
    const { listing, currentSellerOffer, status, finalPrice } = activeNegotiation;
    const dealPrice = status === 'accepted' && finalPrice ? finalPrice : currentSellerOffer;

    if (balance < dealPrice) {
      addNotification('Недостаточно средств', `Для покупки требуется ${dealPrice.toLocaleString()} ₽`, 'warning');
      return false;
    }

    if (usedWarehouseSlots >= maxWarehouseSlots) {
      addNotification('Склад переполнен', `Вместимость склада (${maxWarehouseSlots} мест) исчерпана.`, 'warning');
      return false;
    }

    // Deduct balance
    setBalance(b => b - dealPrice);

    // Create Inventory Item
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${listing.templateId}`,
      templateId: listing.templateId,
      title: listing.title,
      category: listing.category,
      condition: listing.condition,
      purchasePrice: dealPrice,
      purchaseDay: day,
      currentMarketPrice: listing.currentMarketPrice,
      shippingCost: listing.shippingCost,
      image: listing.image,
      status: 'in_warehouse',
      demand: listing.demand,
      daysInWarehouse: 0
    };

    setInventory(prev => [newItem, ...prev]);

    // Remove from market
    setMarketListings(prev => prev.filter(m => m.id !== listing.id));

    // Update Stats
    setStats(prev => ({
      ...prev,
      itemsBought: prev.itemsBought + 1,
      totalExpenses: prev.totalExpenses + dealPrice
    }));

    // XP Bonus for bargaining well
    const saved = Math.max(0, listing.sellerAskingPrice - dealPrice);
    const xpGained = 30 + Math.round(saved * 0.4);
    setXp(x => x + xpGained);

    // Quick auto-closing toast notification
    addNotification(`Куплено за ${dealPrice.toLocaleString()} ₽`, `«${listing.title}» добавлен на склад`, 'success');

    setActiveNegotiation(null);
    return true;
  }, [activeNegotiation, balance, usedWarehouseSlots, maxWarehouseSlots, day, addNotification]);

  const closeNegotiation = useCallback(() => {
    setActiveNegotiation(null);
  }, []);

  // Buy Item Action (direct or instant agreement)
  const buyItem = useCallback((listingId: string): boolean => {
    const listing = marketListings.find(m => m.id === listingId);
    if (!listing) return false;

    if (balance < listing.sellerAskingPrice) {
      addNotification('Недостаточно средств', `Для покупки требуется ${listing.sellerAskingPrice.toLocaleString()} ₽`, 'warning');
      return false;
    }

    if (usedWarehouseSlots >= maxWarehouseSlots) {
      addNotification('Склад переполнен', `Вместимость склада (${maxWarehouseSlots} мест) исчерпана. Улучшите склад или продайте товары.`, 'warning');
      return false;
    }

    // Deduct balance
    setBalance(b => b - listing.sellerAskingPrice);

    // Create Inventory Item
    const newItem: InventoryItem = {
      id: `inv_${Date.now()}_${listing.templateId}`,
      templateId: listing.templateId,
      title: listing.title,
      category: listing.category,
      condition: listing.condition,
      purchasePrice: listing.sellerAskingPrice,
      purchaseDay: day,
      currentMarketPrice: listing.currentMarketPrice,
      shippingCost: listing.shippingCost,
      image: listing.image,
      status: 'in_warehouse',
      demand: listing.demand,
      daysInWarehouse: 0
    };

    setInventory(prev => [newItem, ...prev]);

    // Remove from market
    setMarketListings(prev => prev.filter(m => m.id !== listingId));

    // Update Stats
    setStats(prev => ({
      ...prev,
      itemsBought: prev.itemsBought + 1,
      totalExpenses: prev.totalExpenses + listing.sellerAskingPrice
    }));

    addNotification(
      'Товар куплен',
      `«${listing.title}» за ${listing.sellerAskingPrice.toLocaleString()} ₽ отправлен на ваш склад.`,
      'success'
    );

    return true;
  }, [balance, usedWarehouseSlots, maxWarehouseSlots, marketListings, day, addNotification]);

  // List Item for sale
  const listItemForSale = useCallback((itemId: string, price: number) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'listed',
          listingPrice: price,
          listedDay: day
        };
      }
      return item;
    }));

    addNotification(
      'Выставлено на продажу',
      `Товар выставлен с ценой ${price.toLocaleString()} ₽. Ожидайте покупателей в течение игровых дней.`,
      'info'
    );
  }, [day, addNotification]);

  // Unlist item
  const unlistItem = useCallback((itemId: string) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        return {
          ...item,
          status: 'in_warehouse',
          listingPrice: undefined,
          listedDay: undefined
        };
      }
      return item;
    }));
    addNotification('Товар снят с витрины', 'Лот возвращен на склад.', 'info');
  }, [addNotification]);

  // Quick sell to wholesale broker (75% market value minus shipping for instant cash flow)
  const quickSellWholesale = useCallback((itemId: string) => {
    const item = inventory.find(i => i.id === itemId);
    if (!item) return;

    const wholesalePrice = Math.round(item.currentMarketPrice * 0.75);
    const fee = Math.round(wholesalePrice * 0.05); // low 5% broker fee
    const shipping = item.shippingCost;
    const netPayout = wholesalePrice - fee - shipping;
    const netProfit = netPayout - item.purchasePrice;

    setBalance(b => b + netPayout);
    setInventory(prev => prev.filter(i => i.id !== itemId));

    const quickSale: CompletedSale = {
      id: `qs_${item.id}_${day}`,
      itemId: item.id,
      title: `${item.title} (Срочный выкуп)`,
      category: item.category,
      condition: item.condition,
      purchasePrice: item.purchasePrice,
      sellPrice: wholesalePrice,
      fee,
      shipping,
      netProfit,
      marginPercent: Math.round((netProfit / wholesalePrice) * 100),
      purchaseDay: item.purchaseDay,
      soldDay: day,
      daysToSell: item.daysInWarehouse
    };

    setSalesHistory(prev => [quickSale, ...prev]);

    setStats(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + wholesalePrice,
      totalNetProfit: prev.totalNetProfit + netProfit,
      itemsSold: prev.itemsSold + 1,
      profitableSales: netProfit >= 0 ? prev.profitableSales + 1 : prev.profitableSales,
      unprofitableSales: netProfit < 0 ? prev.unprofitableSales + 1 : prev.unprofitableSales
    }));

    addNotification(
      'Срочный выкуп скупщиком',
      `Товар сдан по оптовой цене за ${wholesalePrice.toLocaleString()} ₽. Чистая выплата: ${netPayout.toLocaleString()} ₽.`,
      netProfit >= 0 ? 'success' : 'warning'
    );
  }, [inventory, day, addNotification]);

  // Purchase Upgrade
  const purchaseUpgrade = useCallback((upgradeId: string): boolean => {
    const upg = upgrades.find(u => u.id === upgradeId);
    if (!upg) return false;

    if (upg.level >= upg.maxLevel) {
      addNotification('Максимальный уровень', 'Это улучшение уже прокачано до предела.', 'info');
      return false;
    }

    if (balance < upg.cost) {
      addNotification('Недостаточно капитала', `Для улучшения требуется ${upg.cost.toLocaleString()} ₽`, 'warning');
      return false;
    }

    setBalance(b => b - upg.cost);
    setUpgrades(prev => prev.map(u => {
      if (u.id === upgradeId) {
        const nextLevel = u.level + 1;
        const nextCost = Math.round(u.cost * 1.6);
        return {
          ...u,
          level: nextLevel,
          cost: nextCost
        };
      }
      return u;
    }));

    addNotification(
      'Улучшение приобретено',
      `«${upg.title}» повышено до уровня ${upg.level + 1}!`,
      'success'
    );

    return true;
  }, [upgrades, balance, addNotification]);

  // Reset Game
  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setDay(1);
    setBalance(INITIAL_BALANCE);
    setLevel(1);
    setXp(0);
    setReputation(4.85);
    setInventory([]);
    setSalesHistory([]);
    setUpgrades(INITIAL_UPGRADES);
    setActiveEvents([]);
    setStats({
      totalRevenue: 0,
      totalExpenses: 0,
      totalFeesPaid: 0,
      totalShippingPaid: 0,
      totalNetProfit: 0,
      itemsBought: 0,
      itemsSold: 0,
      profitableSales: 0,
      unprofitableSales: 0,
      bestSingleProfit: 0,
      fastestSaleDays: 99
    });
    setMarketListings(generateMarketListings(1, 1, []));
    setFinancialHistory([
      {
        day: 1,
        balance: INITIAL_BALANCE,
        dailyRevenue: 0,
        dailyExpenses: 0,
        dailyNetProfit: 0,
        inventoryValuation: 0
      }
    ]);
    addNotification('Игра сброшена', 'Вы начали заново с начальным капиталом 125 000 ₽.', 'info');
  }, [generateMarketListings, addNotification]);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      const stateToSave = {
        day,
        balance,
        level,
        xp,
        reputation,
        inventory,
        salesHistory,
        upgrades,
        stats,
        financialHistory
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
    } catch {
      // ignore
    }
  }, [day, balance, level, xp, reputation, inventory, salesHistory, upgrades, stats, financialHistory]);

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.day) setDay(parsed.day);
        if (parsed.balance) setBalance(parsed.balance);
        if (parsed.level) setLevel(parsed.level);
        if (parsed.xp) setXp(parsed.xp);
        if (parsed.reputation) setReputation(parsed.reputation);
        if (parsed.inventory) setInventory(parsed.inventory);
        if (parsed.salesHistory) setSalesHistory(parsed.salesHistory);
        if (parsed.upgrades) setUpgrades(parsed.upgrades);
        if (parsed.stats) setStats(parsed.stats);
        if (parsed.financialHistory) setFinancialHistory(parsed.financialHistory);
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(() => ({
    day,
    balance,
    level,
    xp,
    nextLevelXp,
    reputation,
    inventory,
    marketListings,
    salesHistory,
    financialHistory,
    upgrades,
    activeEvents,
    stats,
    currentTab,
    setCurrentTab,
    selectedMarketItem,
    setSelectedMarketItem,
    listingModalItem,
    setListingModalItem,
    notifications,
    dismissNotification,
    maxWarehouseSlots,
    usedWarehouseSlots,
    currentCommissionRate,
    shippingDiscountRate,
    activeNegotiation,
    startNegotiation,
    proposeOffer,
    acceptCurrentDeal,
    closeNegotiation,
    buyItem,
    listItemForSale,
    unlistItem,
    quickSellWholesale,
    advanceDay,
    purchaseUpgrade,
    resetGame,
    isAutoPlay,
    setIsAutoPlay,
    gameSpeed,
    setGameSpeed
  }), [
    day,
    balance,
    level,
    xp,
    nextLevelXp,
    reputation,
    inventory,
    marketListings,
    salesHistory,
    financialHistory,
    upgrades,
    activeEvents,
    stats,
    currentTab,
    selectedMarketItem,
    listingModalItem,
    notifications,
    dismissNotification,
    maxWarehouseSlots,
    usedWarehouseSlots,
    currentCommissionRate,
    shippingDiscountRate,
    activeNegotiation,
    startNegotiation,
    proposeOffer,
    acceptCurrentDeal,
    closeNegotiation,
    buyItem,
    listItemForSale,
    unlistItem,
    quickSellWholesale,
    advanceDay,
    purchaseUpgrade,
    resetGame,
    isAutoPlay,
    gameSpeed
  ]);

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
