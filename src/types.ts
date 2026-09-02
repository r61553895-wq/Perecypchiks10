export type ItemCategory = 
  | 'accessories'       // Аксессуары & Периферия
  | 'smartphones'       // Смартфоны & Планшеты
  | 'audio_photo'       // Аудио & Фото
  | 'laptops_pc'        // Комплектующие & Ноутбуки
  | 'luxury_drops';     // Премиум часы & Коллекционные вещи

export type ItemCondition = 'new' | 'like_new' | 'good' | 'fair';

export type DemandLevel = 'low' | 'medium' | 'high' | 'surge';

export type SellerArchetype = 
  | 'urgent'      // Срочный продавец
  | 'stubborn'    // Упрямый продавец
  | 'pro'         // Опытный продавец
  | 'clueless'    // Не разбирающийся продавец
  | 'reseller'    // Перекуп
  | 'regular';    // Обычный продавец

export type SellerMood = 
  | 'calm'          // Спокойный
  | 'neutral'       // Нейтральный
  | 'irritated'     // Раздражён
  | 'ready_to_sell' // Готов продать
  | 'urgent_cash';  // Срочно нужны деньги

export interface ProductTemplate {
  id: string;
  title: string;
  category: ItemCategory;
  baseMarketPrice: number;
  minPrice: number;
  maxPrice: number;
  volatility: number;      // 0.05 to 0.25 (price variation range)
  shippingCost: number;    // Delivery fee in ₽
  requiredLevel: number;   // Business level to see this item
  image: string;
  brand: string;
}

export interface MarketListing {
  id: string;
  templateId: string;
  title: string;
  category: ItemCategory;
  condition: ItemCondition;
  sellerAskingPrice: number;
  currentMarketPrice: number;
  demand: DemandLevel;
  shippingCost: number;
  image: string;
  brand: string;
  daysRemaining: number;
  sellerNote: string;
  isBargainDeal?: boolean; // Rare advantageous deal
  isOverpriced?: boolean;  // Bad deal warning
  sellerArchetype: SellerArchetype;
  sellerMood: SellerMood;
  maxAttempts: number;
  minAcceptablePrice: number;
}

export interface NegotiationRound {
  sender: 'player' | 'seller';
  price?: number;
  text: string;
  timestamp: number;
}

export interface ActiveNegotiation {
  listing: MarketListing;
  currentSellerOffer: number;
  playerLastOffer: number | null;
  attemptsLeft: number;
  maxAttempts: number;
  sellerMood: SellerMood;
  history: NegotiationRound[];
  status: 'active' | 'accepted' | 'rejected';
  finalPrice?: number;
}

export type InventoryItemStatus = 'in_warehouse' | 'listed' | 'sold';

export interface InventoryItem {
  id: string;
  templateId: string;
  title: string;
  category: ItemCategory;
  condition: ItemCondition;
  purchasePrice: number;
  purchaseDay: number;
  currentMarketPrice: number;
  shippingCost: number;
  image: string;
  status: InventoryItemStatus;
  listingPrice?: number;
  listedDay?: number;
  demand: DemandLevel;
  daysInWarehouse: number;
}

export interface CompletedSale {
  id: string;
  itemId: string;
  title: string;
  category: ItemCategory;
  condition: ItemCondition;
  purchasePrice: number;
  sellPrice: number;
  fee: number;
  shipping: number;
  netProfit: number;
  marginPercent: number;
  purchaseDay: number;
  soldDay: number;
  daysToSell: number;
}

export interface MarketEvent {
  id: string;
  title: string;
  description: string;
  categoryAffected?: ItemCategory;
  priceMultiplier: number;
  demandShift?: DemandLevel;
  durationDays: number;
  startDay: number;
}

export interface BusinessUpgrade {
  id: string;
  title: string;
  description: string;
  level: number;
  maxLevel: number;
  cost: number;
  unlockedAtPlayerLevel: number;
  effectType: 'warehouse_capacity' | 'fee_discount' | 'shipping_discount' | 'deal_radar' | 'reputation_boost';
  effectValue: number;
}

export interface DayFinancialRecord {
  day: number;
  balance: number;
  dailyRevenue: number;
  dailyExpenses: number;
  dailyNetProfit: number;
  inventoryValuation: number;
}

export interface GameStats {
  totalRevenue: number;
  totalExpenses: number;
  totalFeesPaid: number;
  totalShippingPaid: number;
  totalNetProfit: number;
  itemsBought: number;
  itemsSold: number;
  profitableSales: number;
  unprofitableSales: number;
  bestSingleProfit: number;
  fastestSaleDays: number;
}

export type NavigationTab = 
  | 'dashboard' 
  | 'market' 
  | 'warehouse' 
  | 'sales' 
  | 'finances' 
  | 'upgrades' 
  | 'settings';
