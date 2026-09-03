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
  NegotiationRound,
  AuctionLot,
  CustomerOrder
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

  // Auctions
  auctions: AuctionLot[];
  bidAuction: (lotId: string, amount: number) => boolean;

  // Customer Orders
  customerOrders: CustomerOrder[];
  fulfillOrder: (orderId: string, inventoryItemId: string) => boolean;

  // Showroom
  showroomRented: boolean;
  rentShowroom: () => boolean;

  // Skills
  skills: {
    bargain: number;
    analytics: number;
    appraisal: number;
    repair: number;
    logistics: number;
  };
  upgradeSkill: (skillKey: 'bargain' | 'analytics' | 'appraisal' | 'repair' | 'logistics') => boolean;

  // Location & FM Rep
  currentLocation: string;
  setCurrentLocation: (loc: string) => void;
  reputationPoints: number;

  // Visual Theme & Presentation Mode (Light by default as requested in prompt)
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  deviceFrame: boolean;
  setDeviceFrame: (frame: boolean) => void;
}

export const STORAGE_KEY = 'reseller_simulator_save_rub_v1';
export const LEGACY_STORAGE_KEY = 'reseller_simulator_save_v1';
const INITIAL_BALANCE = 125000; // Starting capital in ₽

const DEFAULT_STATS: GameStats = {
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
  fastestSaleDays: 99,
  repairsDone: 0,
  fakesDiscovered: 0,
  auctionsWon: 0
};

const DEFAULT_AUCTIONS: AuctionLot[] = [
  {
    id: 'auc_macbook_m3',
    title: 'MacBook Pro 16 M3 Max 1TB',
    category: 'laptops_pc',
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    marketPrice: 221000,
    currentBid: 131609,
    highestBidder: 'Игорь Скупщик',
    isPlayerWinning: false,
    secondsRemaining: 30,
    bidCount: 7
  },
  {
    id: 'auc_xbox_series_x',
    title: 'Xbox Series X 1TB Black',
    category: 'accessories',
    condition: 'like_new',
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
    marketPrice: 52000,
    currentBid: 32400,
    highestBidder: 'Иван Барыга',
    isPlayerWinning: false,
    secondsRemaining: 33,
    bidCount: 4
  },
  {
    id: 'auc_sony_xm5',
    title: 'Sony WH-1000XM5 Black',
    category: 'audio_photo',
    condition: 'good',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    marketPrice: 24500,
    currentBid: 14200,
    highestBidder: 'Олег Реселлер',
    isPlayerWinning: false,
    secondsRemaining: 16,
    bidCount: 5
  }
];

const DEFAULT_CUSTOMER_ORDERS: CustomerOrder[] = [
  {
    id: 'ord_leica',
    clientName: 'Александр',
    clientArchetype: 'Геймер',
    category: 'luxury_drops',
    requestedTitle: 'Камера Leica M6 TTL 0.72 Black',
    comment: 'Куплю в личную коллекцию Камера Leica M6 TTL 0.72 Black. Быстрый выкуп!',
    budget: 295801,
    bonusReward: 44370,
    isCompleted: false
  },
  {
    id: 'ord_s22',
    clientName: 'Михаил',
    clientArchetype: 'IT-специалист',
    category: 'smartphones',
    requestedTitle: 'Samsung Galaxy S22 128GB',
    comment: 'Срочно нужен надежный смартфон Samsung Galaxy S22 128GB для рабочего софта...',
    budget: 36376,
    bonusReward: 5456,
    isCompleted: false
  },
  {
    id: 'ord_ip15',
    clientName: 'Валентин',
    clientArchetype: 'Бизнесмен',
    category: 'smartphones',
    requestedTitle: 'iPhone 15 Pro 512GB Titanium',
    comment: 'iPhone 15 Pro 512GB Titanium в идеальном состоянии для командировки...',
    budget: 120690,
    bonusReward: 18103,
    isCompleted: false
  },
  {
    id: 'ord_rtx4090',
    clientName: 'Артем',
    clientArchetype: 'Фотограф',
    category: 'laptops_pc',
    requestedTitle: 'NVIDIA GeForce RTX 4090 24GB',
    comment: 'NVIDIA GeForce RTX 4090 24GB для рендера видео 8K и 3D-графики...',
    budget: 221059,
    bonusReward: 33158,
    isCompleted: false
  },
  {
    id: 'ord_audio',
    clientName: 'Константин',
    clientArchetype: 'Фотограф',
    category: 'audio_photo',
    requestedTitle: 'Studio ANC Wireless Over-Ear',
    comment: 'Качественные студийные наушники для сведения звука на выезде.',
    budget: 35000,
    bonusReward: 5200,
    isCompleted: false
  }
];

function getSavedGameState(): any | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch (err) {
    console.warn('Could not parse saved game from localStorage:', err);
  }
  return null;
}

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Synchronously load saved state so that all useState hooks receive restored data on first render
  const savedData = useMemo(() => getSavedGameState(), []);

  const [day, setDay] = useState<number>(() => savedData?.day ?? 1);
  const [balance, setBalance] = useState<number>(() => typeof savedData?.balance === 'number' ? savedData.balance : INITIAL_BALANCE);
  const [level, setLevel] = useState<number>(() => savedData?.level ?? 1);
  const [xp, setXp] = useState<number>(() => savedData?.xp ?? 0);
  const [reputation, setReputation] = useState<number>(() => savedData?.reputation ?? 4.85);
  const [inventory, setInventory] = useState<InventoryItem[]>(() => Array.isArray(savedData?.inventory) ? savedData.inventory : []);
  const [marketListings, setMarketListings] = useState<MarketListing[]>(() => {
    if (Array.isArray(savedData?.marketListings) && savedData.marketListings.length > 0) {
      return savedData.marketListings;
    }
    return [];
  });
  const [salesHistory, setSalesHistory] = useState<CompletedSale[]>(() => Array.isArray(savedData?.salesHistory) ? savedData.salesHistory : []);
  const [financialHistory, setFinancialHistory] = useState<DayFinancialRecord[]>(() => 
    Array.isArray(savedData?.financialHistory) && savedData.financialHistory.length > 0
      ? savedData.financialHistory
      : [{
          day: 1,
          balance: INITIAL_BALANCE,
          dailyRevenue: 0,
          dailyExpenses: 0,
          dailyNetProfit: 0,
          inventoryValuation: 0
        }]
  );
  const [upgrades, setUpgrades] = useState<BusinessUpgrade[]>(() => {
    if (Array.isArray(savedData?.upgrades) && savedData.upgrades.length > 0) {
      return INITIAL_UPGRADES.map(def => {
        const found = savedData.upgrades.find((u: BusinessUpgrade) => u.id === def.id);
        return found ? { ...def, level: found.level, cost: found.cost ?? def.cost } : def;
      });
    }
    return INITIAL_UPGRADES;
  });
  const [activeEvents, setActiveEvents] = useState<MarketEvent[]>(() => Array.isArray(savedData?.activeEvents) ? savedData.activeEvents : []);
  const [stats, setStats] = useState<GameStats>(() => savedData?.stats ? { ...DEFAULT_STATS, ...savedData.stats } : DEFAULT_STATS);
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => savedData?.currentTab ?? 'dashboard');
  const [selectedMarketItem, setSelectedMarketItem] = useState<MarketListing | null>(null);
  const [listingModalItem, setListingModalItem] = useState<InventoryItem | null>(null);
  const [activeNegotiation, setActiveNegotiation] = useState<ActiveNegotiation | null>(null);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isAutoPlay, setIsAutoPlay] = useState<boolean>(() => Boolean(savedData?.isAutoPlay));
  const [gameSpeed, setGameSpeed] = useState<number>(() => savedData?.gameSpeed ?? 1); // 1 = 3s per day, 2 = 1.5s per day

  // Showroom, Skills, Location, Reputation
  const [showroomRented, setShowroomRented] = useState<boolean>(() => Boolean(savedData?.showroomRented));
  const [skills, setSkills] = useState<{
    bargain: number;
    analytics: number;
    appraisal: number;
    repair: number;
    logistics: number;
  }>(() => savedData?.skills ?? {
    bargain: 0,
    analytics: 0,
    appraisal: 0,
    repair: 0,
    logistics: 0
  });
  const [currentLocation, setCurrentLocation] = useState<string>(() => savedData?.currentLocation ?? 'Блошиный рынок');
  const [reputationPoints, setReputationPoints] = useState<number>(() => savedData?.reputationPoints ?? 20);

  // Visual Theme & Device Frame
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('fl!p_theme');
      return (saved === 'dark' || saved === 'light') ? saved : 'light';
    } catch {
      return 'light';
    }
  });

  const [deviceFrame, setDeviceFrame] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('fl!p_device_frame');
      return saved !== null ? saved === 'true' : true;
    } catch {
      return true;
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('fl!p_theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch {
      // ignore
    }
  }, [theme]);

  useEffect(() => {
    try {
      localStorage.setItem('fl!p_device_frame', String(deviceFrame));
    } catch {
      // ignore
    }
  }, [deviceFrame]);

  // Live Auctions State (Screenshot 5)
  const [auctions, setAuctions] = useState<AuctionLot[]>(() => {
    return Array.isArray(savedData?.auctions) && savedData.auctions.length > 0
      ? savedData.auctions
      : DEFAULT_AUCTIONS;
  });

  // Customer Orders State (Screenshot 4)
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>(() => {
    return Array.isArray(savedData?.customerOrders) && savedData.customerOrders.length > 0
      ? savedData.customerOrders
      : DEFAULT_CUSTOMER_ORDERS;
  });

  // Computed Upgrade Effects
  const warehouseUpgrade = upgrades.find(u => u.effectType === 'warehouse_capacity');
  const maxWarehouseSlots = 8 + (skills.logistics * 3) + ((warehouseUpgrade ? warehouseUpgrade.level : 0) * 6) + (showroomRented ? 15 : 0);
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

    const carSellerNotes = [
      'Не бит, не крашен, один хозяин. ПТС оригинал на руках.',
      'Сел и поехал! Двигатель шепчет, коробка плавная, торг строго у капота.',
      'Срочно в связи с покупкой недвижимости. Комплект зимней резины в подарок!',
      'Гаражное хранение, родной подтвержденный пробег, любые автоэксперты приветствуются.',
      'Масло и фильтры поменяны 400 км назад, подвеска обслужена, чистый салон.',
      'Второй авто в семье, ездила супруга очень аккуратно, без ДТП.'
    ];

    const newListings: MarketListing[] = [];
    const chosenTemplates: typeof availableTemplates = [];
    const vehicleTemplates = availableTemplates.filter(t => t.category === 'vehicles');

    // Guarantee at least 1-2 car deals in the market
    if (vehicleTemplates.length > 0) {
      const carCount = Math.min(vehicleTemplates.length, Math.random() < 0.6 ? 2 : 1);
      for (let c = 0; c < carCount; c++) {
        chosenTemplates.push(vehicleTemplates[Math.floor(Math.random() * vehicleTemplates.length)]);
      }
    }
    while (chosenTemplates.length < count) {
      chosenTemplates.push(availableTemplates[Math.floor(Math.random() * availableTemplates.length)]);
    }

    for (let i = 0; i < chosenTemplates.length; i++) {
      const template = chosenTemplates[i];
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
        sellerNote: template.category === 'vehicles' 
          ? carSellerNotes[Math.floor(Math.random() * carSellerNotes.length)]
          : sellerNotes[Math.floor(Math.random() * sellerNotes.length)],
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

  // Live Auction Bidding
  const bidAuction = useCallback((lotId: string, amount: number) => {
    let success = false;
    setAuctions(prev => prev.map(lot => {
      if (lot.id !== lotId) return lot;
      const newBid = lot.currentBid + amount;
      if (balance < newBid) {
        addNotification('Недостаточно средств', `Для ставки ${newBid.toLocaleString()} ₽ необходимо иметь сумму на балансе`, 'warning');
        return lot;
      }
      setBalance(b => b - amount);
      success = true;
      addNotification('Ставка принята!', `Вы лидируете со ставкой ${newBid.toLocaleString()} ₽ на ${lot.title}`, 'success');
      return {
        ...lot,
        currentBid: newBid,
        highestBidder: 'Вы лидируете!',
        isPlayerWinning: true,
        bidCount: lot.bidCount + 1,
        secondsRemaining: Math.max(12, lot.secondsRemaining + 6)
      };
    }));
    return success;
  }, [balance, addNotification]);

  // Fulfill Customer Order
  const fulfillOrder = useCallback((orderId: string, inventoryItemId: string) => {
    const order = customerOrders.find(o => o.id === orderId);
    const item = inventory.find(i => i.id === inventoryItemId);
    if (!order || !item) return false;

    const totalPayout = order.budget + order.bonusReward;
    const profit = totalPayout - item.purchasePrice;

    setBalance(b => b + totalPayout);
    setInventory(prev => prev.filter(i => i.id !== inventoryItemId));
    setCustomerOrders(prev => prev.map(o => o.id === orderId ? { ...o, isCompleted: true } : o));

    setStats(prev => ({
      ...prev,
      totalRevenue: prev.totalRevenue + totalPayout,
      totalNetProfit: prev.totalNetProfit + profit,
      itemsSold: prev.itemsSold + 1,
      profitableSales: prev.profitableSales + 1
    }));

    setReputationPoints(r => r + 5);
    setXp(x => x + 250);

    addNotification(
      'Заказ успешно выполнен!',
      `Вы передали ${item.title} клиенту ${order.clientName} и заработали ${totalPayout.toLocaleString()} ₽ (Бонус: +${order.bonusReward.toLocaleString()} ₽)`,
      'success'
    );
    return true;
  }, [customerOrders, inventory, addNotification]);

  // Rent Showroom
  const rentShowroom = useCallback(() => {
    const RENT_COST = 45000;
    if (balance < RENT_COST) {
      addNotification('Недостаточно средств', `Для аренды шоурума необходимо 45 000 ₽`, 'warning');
      return false;
    }
    setBalance(b => b - RENT_COST);
    setShowroomRented(true);
    addNotification('Шоурум открыт!', 'Вы арендовали торговое пространство. Склад расширен, витрины активированы!', 'success');
    return true;
  }, [balance, addNotification]);

  // Upgrade Skill
  const upgradeSkill = useCallback((skillKey: 'bargain' | 'analytics' | 'appraisal' | 'repair' | 'logistics') => {
    const skillBaseCosts = {
      bargain: 4200,
      analytics: 5600,
      appraisal: 4900,
      repair: 7000,
      logistics: 6300
    };
    const currentLvl = skills[skillKey];
    if (currentLvl >= 5) {
      addNotification('Максимальный уровень', 'Навык уже прокачан до 5-го уровня!', 'info');
      return false;
    }
    const cost = skillBaseCosts[skillKey] * (currentLvl + 1);
    if (balance < cost) {
      addNotification('Недостаточно средств', `Для прокачки требуется ${cost.toLocaleString()} ₽`, 'warning');
      return false;
    }
    setBalance(b => b - cost);
    setSkills(prev => ({
      ...prev,
      [skillKey]: prev[skillKey] + 1
    }));
    addNotification('Навык прокачан!', `Навык повышен до уровня ${currentLvl + 1}/5!`, 'success');
    return true;
  }, [skills, balance, addNotification]);

  // Auction countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setAuctions(prev => prev.map(lot => {
        if (lot.secondsRemaining <= 1) {
          if (lot.isPlayerWinning) {
            const wonItem: InventoryItem = {
              id: 'auc_won_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
              templateId: lot.id,
              title: lot.title,
              category: lot.category,
              condition: lot.condition,
              purchasePrice: lot.currentBid,
              purchaseDay: day,
              currentMarketPrice: lot.marketPrice,
              shippingCost: 0,
              image: lot.image,
              status: 'in_warehouse',
              demand: 'high',
              daysInWarehouse: 0
            };
            setInventory(inv => [wonItem, ...inv]);
            setStats(s => ({ ...s, auctionsWon: s.auctionsWon + 1, itemsBought: s.itemsBought + 1 }));
            addNotification('Аукцион выигран!', `Поздравляем! Вы забрали ${lot.title} за ${lot.currentBid.toLocaleString()} ₽!`, 'success');
          }
          return {
            ...lot,
            currentBid: Math.round(lot.marketPrice * (0.5 + Math.random() * 0.15)),
            highestBidder: ['Игорь Скупщик', 'Иван Барыга', 'Олег Реселлер', 'Артур Профи'][Math.floor(Math.random() * 4)],
            isPlayerWinning: false,
            secondsRemaining: 30 + Math.floor(Math.random() * 15),
            bidCount: 1
          };
        }

        let lotUpdate = { ...lot, secondsRemaining: lot.secondsRemaining - 1 };
        if (lot.isPlayerWinning && lot.secondsRemaining > 6 && Math.random() < 0.08) {
          const npcRaise = Math.random() < 0.5 ? 1000 : 5000;
          lotUpdate = {
            ...lotUpdate,
            currentBid: lot.currentBid + npcRaise,
            highestBidder: 'Игорь Скупщик',
            isPlayerWinning: false,
            bidCount: lot.bidCount + 1
          };
        }
        return lotUpdate;
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, [day, addNotification]);

  // Reset Game
  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } catch {
      // ignore
    }
    setDay(1);
    setBalance(INITIAL_BALANCE);
    setLevel(1);
    setXp(0);
    setReputation(4.85);
    setInventory([]);
    setSalesHistory([]);
    setUpgrades(INITIAL_UPGRADES);
    setActiveEvents([]);
    setStats(DEFAULT_STATS);
    setSkills({
      bargain: 0,
      analytics: 0,
      appraisal: 0,
      repair: 0,
      logistics: 0
    });
    setShowroomRented(false);
    setCurrentLocation('Блошиный рынок');
    setReputationPoints(20);
    setAuctions(DEFAULT_AUCTIONS);
    setCustomerOrders(DEFAULT_CUSTOMER_ORDERS);
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

  // Comprehensive Save to localStorage
  const saveToDisk = useCallback(() => {
    try {
      const stateToSave = {
        day,
        balance,
        level,
        xp,
        reputation,
        inventory,
        marketListings,
        salesHistory,
        upgrades,
        activeEvents,
        stats,
        financialHistory,
        skills,
        showroomRented,
        currentLocation,
        reputationPoints,
        auctions,
        customerOrders,
        gameSpeed,
        isAutoPlay,
        currentTab
      };
      const serialized = JSON.stringify(stateToSave);
      localStorage.setItem(STORAGE_KEY, serialized);
      localStorage.setItem(LEGACY_STORAGE_KEY, serialized);
    } catch (err) {
      console.warn('Failed to save to localStorage:', err);
    }
  }, [
    day,
    balance,
    level,
    xp,
    reputation,
    inventory,
    marketListings,
    salesHistory,
    upgrades,
    activeEvents,
    stats,
    financialHistory,
    skills,
    showroomRented,
    currentLocation,
    reputationPoints,
    auctions,
    customerOrders,
    gameSpeed,
    isAutoPlay,
    currentTab
  ]);

  // Persist whenever game state changes
  useEffect(() => {
    saveToDisk();
  }, [saveToDisk]);

  // Guaranteed save right before page reload or window close
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToDisk();
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveToDisk]);

  // Generate initial market listings if empty or without vehicles
  useEffect(() => {
    setMarketListings(prev => {
      if (prev.length === 0 || !prev.some(m => m.category === 'vehicles')) {
        return generateMarketListings(day, level, activeEvents);
      }
      return prev;
    });
  }, [day, level, activeEvents, generateMarketListings]);

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
    setGameSpeed,
    auctions,
    bidAuction,
    customerOrders,
    fulfillOrder,
    showroomRented,
    rentShowroom,
    skills,
    upgradeSkill,
    currentLocation,
    setCurrentLocation,
    reputationPoints,
    theme,
    setTheme,
    toggleTheme,
    deviceFrame,
    setDeviceFrame
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
    gameSpeed,
    auctions,
    bidAuction,
    customerOrders,
    fulfillOrder,
    showroomRented,
    rentShowroom,
    skills,
    upgradeSkill,
    currentLocation,
    reputationPoints,
    theme,
    toggleTheme,
    deviceFrame
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
