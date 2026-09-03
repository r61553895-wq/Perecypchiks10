import { ProductTemplate, BusinessUpgrade } from '../types';

export const INITIAL_PRODUCT_TEMPLATES: ProductTemplate[] = [
  // LEVEL 1: Accessories & Peripherals
  {
    id: 'prod_tws_earbuds',
    title: 'Pro Wireless Earbuds Gen 2',
    category: 'accessories',
    baseMarketPrice: 11000,
    minPrice: 6500,
    maxPrice: 15000,
    volatility: 0.12,
    shippingCost: 400,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    brand: 'AudioCraft'
  },
  {
    id: 'prod_mech_keyboard',
    title: 'Custom 75% Mechanical Keyboard',
    category: 'accessories',
    baseMarketPrice: 16500,
    minPrice: 10000,
    maxPrice: 22000,
    volatility: 0.1,
    shippingCost: 600,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    brand: 'KeyForge'
  },
  {
    id: 'prod_wireless_mouse',
    title: 'Precision Ergonomic Gaming Mouse',
    category: 'accessories',
    baseMarketPrice: 7500,
    minPrice: 4000,
    maxPrice: 10500,
    volatility: 0.14,
    shippingCost: 400,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80',
    brand: 'LogiTech'
  },
  {
    id: 'prod_game_controller',
    title: 'Elite Wireless Pro Gamepad',
    category: 'accessories',
    baseMarketPrice: 13500,
    minPrice: 8500,
    maxPrice: 18000,
    volatility: 0.11,
    shippingCost: 500,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=600&auto=format&fit=crop&q=80',
    brand: 'Nexus'
  },
  {
    id: 'prod_smartband',
    title: 'Fitness Tracker Ultra Watch',
    category: 'accessories',
    baseMarketPrice: 8500,
    minPrice: 4800,
    maxPrice: 12000,
    volatility: 0.13,
    shippingCost: 400,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
    brand: 'PulseTech'
  },

  // LEVEL 2: Smartphones & Tablets
  {
    id: 'prod_phone_flagship_14',
    title: 'Flagship Smartphone Pro 256GB',
    category: 'smartphones',
    baseMarketPrice: 62000,
    minPrice: 42000,
    maxPrice: 84000,
    volatility: 0.15,
    shippingCost: 1000,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    brand: 'Apex'
  },
  {
    id: 'prod_phone_compact',
    title: 'Compact OLED Phone 128GB',
    category: 'smartphones',
    baseMarketPrice: 41000,
    minPrice: 28000,
    maxPrice: 56000,
    volatility: 0.13,
    shippingCost: 900,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&auto=format&fit=crop&q=80',
    brand: 'Pixel'
  },
  {
    id: 'prod_tablet_air',
    title: 'Retina Tablet 11-inch Wi-Fi',
    category: 'smartphones',
    baseMarketPrice: 53000,
    minPrice: 36000,
    maxPrice: 69000,
    volatility: 0.12,
    shippingCost: 1100,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    brand: 'Slate'
  },
  {
    id: 'prod_phone_fold',
    title: 'Dual-Screen Foldable Smartphone',
    category: 'smartphones',
    baseMarketPrice: 89000,
    minPrice: 62000,
    maxPrice: 118000,
    volatility: 0.18,
    shippingCost: 1200,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=80',
    brand: 'Z-Fold'
  },

  // LEVEL 3: Audio & Photography
  {
    id: 'prod_anc_headphones',
    title: 'Studio ANC Wireless Over-Ear',
    category: 'audio_photo',
    baseMarketPrice: 32000,
    minPrice: 21000,
    maxPrice: 43000,
    volatility: 0.12,
    shippingCost: 800,
    requiredLevel: 3,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    brand: 'SennSound'
  },
  {
    id: 'prod_mirrorless_cam',
    title: 'Full-Frame Mirrorless Camera Body',
    category: 'audio_photo',
    baseMarketPrice: 125000,
    minPrice: 88000,
    maxPrice: 165000,
    volatility: 0.14,
    shippingCost: 1600,
    requiredLevel: 3,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
    brand: 'Lumina'
  },
  {
    id: 'prod_prime_lens',
    title: '50mm f/1.2 Fast Prime Lens',
    category: 'audio_photo',
    baseMarketPrice: 78000,
    minPrice: 56000,
    maxPrice: 102000,
    volatility: 0.1,
    shippingCost: 1000,
    requiredLevel: 3,
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=600&auto=format&fit=crop&q=80',
    brand: 'Optik'
  },
  {
    id: 'prod_mic_podcasting',
    title: 'Broadcast Dynamic Microphone',
    category: 'audio_photo',
    baseMarketPrice: 28000,
    minPrice: 19000,
    maxPrice: 36000,
    volatility: 0.09,
    shippingCost: 700,
    requiredLevel: 3,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
    brand: 'Acoustica'
  },

  // LEVEL 4: Laptops & Computing
  {
    id: 'prod_laptop_pro_14',
    title: 'Creator Ultrabook M-Pro 32GB',
    category: 'laptops_pc',
    baseMarketPrice: 185000,
    minPrice: 135000,
    maxPrice: 240000,
    volatility: 0.13,
    shippingCost: 2000,
    requiredLevel: 4,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    brand: 'SiliconCore'
  },
  {
    id: 'prod_gpu_rtx',
    title: 'High-Performance 16GB GPU',
    category: 'laptops_pc',
    baseMarketPrice: 88000,
    minPrice: 62000,
    maxPrice: 125000,
    volatility: 0.22,
    shippingCost: 1400,
    requiredLevel: 4,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80',
    brand: 'Vanguard'
  },
  {
    id: 'prod_ultrawide_monitor',
    title: '34" Curved QD-OLED Monitor',
    category: 'laptops_pc',
    baseMarketPrice: 79000,
    minPrice: 56000,
    maxPrice: 105000,
    volatility: 0.11,
    shippingCost: 2500,
    requiredLevel: 4,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80',
    brand: 'ViewMatrix'
  },

  // LEVEL 5: Luxury & Collectibles
  {
    id: 'prod_swiss_chronograph',
    title: 'Swiss Automatic Chronograph Watch',
    category: 'luxury_drops',
    baseMarketPrice: 380000,
    minPrice: 270000,
    maxPrice: 520000,
    volatility: 0.16,
    shippingCost: 3500,
    requiredLevel: 5,
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
    brand: 'Helvetia'
  },
  {
    id: 'prod_vintage_diver',
    title: 'Heritage Automatic Diver 300m',
    category: 'luxury_drops',
    baseMarketPrice: 460000,
    minPrice: 340000,
    maxPrice: 610000,
    volatility: 0.14,
    shippingCost: 4000,
    requiredLevel: 5,
    image: 'https://images.unsplash.com/photo-1547996160-71dfabb14c1e?w=600&auto=format&fit=crop&q=80',
    brand: 'Nautilus'
  },
  {
    id: 'prod_limited_sneakers',
    title: 'Deadstock Archive High Sneakers',
    category: 'luxury_drops',
    baseMarketPrice: 145000,
    minPrice: 90000,
    maxPrice: 230000,
    volatility: 0.25,
    shippingCost: 1500,
    requiredLevel: 5,
    image: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=600&auto=format&fit=crop&q=80',
    brand: 'HyperDrop'
  },

  // VEHICLES (Автоперекуп: от классики до немецкого премиума)
  {
    id: 'prod_car_lada_tuner',
    title: 'ВАЗ 2107 Тюнинг / Боевая Классика',
    category: 'vehicles',
    baseMarketPrice: 160000,
    minPrice: 95000,
    maxPrice: 240000,
    volatility: 0.18,
    shippingCost: 8000,
    requiredLevel: 1,
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=600&auto=format&fit=crop&q=80',
    brand: 'Lada Custom'
  },
  {
    id: 'prod_car_bmw_e46',
    title: 'BMW 3-Series E46 M-Пакет (Седан)',
    category: 'vehicles',
    baseMarketPrice: 580000,
    minPrice: 380000,
    maxPrice: 790000,
    volatility: 0.16,
    shippingCost: 12000,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1555353540-64580b51c258?w=600&auto=format&fit=crop&q=80',
    brand: 'BMW'
  },
  {
    id: 'prod_car_mark2_tourer',
    title: 'Toyota Mark II Tourer V (1JZ-GTE Turbo)',
    category: 'vehicles',
    baseMarketPrice: 890000,
    minPrice: 590000,
    maxPrice: 1250000,
    volatility: 0.19,
    shippingCost: 15000,
    requiredLevel: 2,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    brand: 'Toyota'
  },
  {
    id: 'prod_car_camry_35',
    title: 'Toyota Camry 3.5 V6 (Черный седан)',
    category: 'vehicles',
    baseMarketPrice: 1950000,
    minPrice: 1400000,
    maxPrice: 2600000,
    volatility: 0.14,
    shippingCost: 18000,
    requiredLevel: 3,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=600&auto=format&fit=crop&q=80',
    brand: 'Toyota'
  },
  {
    id: 'prod_car_mercedes_w212',
    title: 'Mercedes-Benz E-Class W212 AMG-Line',
    category: 'vehicles',
    baseMarketPrice: 2650000,
    minPrice: 1850000,
    maxPrice: 3500000,
    volatility: 0.15,
    shippingCost: 22000,
    requiredLevel: 4,
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&auto=format&fit=crop&q=80',
    brand: 'Mercedes-Benz'
  },
  {
    id: 'prod_car_porsche_911',
    title: 'Porsche 911 Carrera S (991 Coupe)',
    category: 'vehicles',
    baseMarketPrice: 8400000,
    minPrice: 5900000,
    maxPrice: 11200000,
    volatility: 0.22,
    shippingCost: 45000,
    requiredLevel: 5,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80',
    brand: 'Porsche'
  }
];

export const LEVEL_DEFINITIONS = [
  {
    level: 1,
    title: 'Начинающий перекуп',
    minCapital: 0,
    xpRequired: 0,
    description: 'Торговля популярными аксессуарами, периферией и контроллерами.'
  },
  {
    level: 2,
    title: 'Опытный байер',
    minCapital: 250000,
    xpRequired: 1500,
    description: 'Выход на рынок мобильных устройств: смартфоны, планшеты.'
  },
  {
    level: 3,
    title: 'Торговый эксперт',
    minCapital: 800000,
    xpRequired: 5000,
    description: 'Продажа профессиональной аудиотехники и фотооборудования.'
  },
  {
    level: 4,
    title: 'Складской оператор',
    minCapital: 2000000,
    xpRequired: 15000,
    description: 'Оборот премиальных ноутбуков, видеокарт и рабочих станций.'
  },
  {
    level: 5,
    title: 'Торговый синдикат',
    minCapital: 5000000,
    xpRequired: 40000,
    description: 'Элитные швейцарские хронографы и редкие коллекционные дропы.'
  }
];

export const INITIAL_UPGRADES: BusinessUpgrade[] = [
  {
    id: 'upg_warehouse',
    title: 'Расширение склада',
    description: 'Увеличивает вместимость склада для одновременного хранения товаров.',
    level: 1,
    maxLevel: 5,
    cost: 35000,
    unlockedAtPlayerLevel: 1,
    effectType: 'warehouse_capacity',
    effectValue: 6 // +6 slots per level
  },
  {
    id: 'upg_commission',
    title: 'Партнерский статус площадок',
    description: 'Снижает базовую комиссию маркетплейса с 8% до более выгодных ставок.',
    level: 0,
    maxLevel: 4,
    cost: 50000,
    unlockedAtPlayerLevel: 1,
    effectType: 'fee_discount',
    effectValue: 0.012 // -1.2% commission per tier
  },
  {
    id: 'upg_shipping',
    title: 'Корпоративный логист',
    description: 'Оптовый договор со службами курьерской экспресс-доставки.',
    level: 0,
    maxLevel: 3,
    cost: 40000,
    unlockedAtPlayerLevel: 2,
    effectType: 'shipping_discount',
    effectValue: 0.2 // -20% delivery cost per level
  },
  {
    id: 'upg_qa_desk',
    title: 'Станция диагностики и чистки',
    description: 'Предпродажная подготовка повышает привлекательность и скорость продажи лотов.',
    level: 0,
    maxLevel: 3,
    cost: 75000,
    unlockedAtPlayerLevel: 2,
    effectType: 'deal_radar',
    effectValue: 0.15 // +15% conversion speed
  },
  {
    id: 'upg_reputation',
    title: 'Сертификация топ-селлера',
    description: 'Знак проверенного магазина внушает доверие и привлекает покупателей на 20% быстрее.',
    level: 0,
    maxLevel: 3,
    cost: 120000,
    unlockedAtPlayerLevel: 3,
    effectType: 'reputation_boost',
    effectValue: 0.2
  }
];

export const POSSIBLE_EVENTS = [
  {
    id: 'ev_consoles_boom',
    title: 'Всплеск спроса на гейминг',
    description: 'Киберспортивный турнир поднял интерес к контроллерам и периферии.',
    categoryAffected: 'accessories' as const,
    priceMultiplier: 1.18,
    demandShift: 'surge' as const,
    durationDays: 4
  },
  {
    id: 'ev_phone_release',
    title: 'Анонс нового поколения устройств',
    description: 'Спрос на смартфоны смещается, цены на вторичном рынке упали на 12%.',
    categoryAffected: 'smartphones' as const,
    priceMultiplier: 0.88,
    demandShift: 'medium' as const,
    durationDays: 5
  },
  {
    id: 'ev_audio_trend',
    title: 'Тренд на качественный звук',
    description: 'Популярные блогеры подогрели интерес к профессиональным наушникам и микрофонам.',
    categoryAffected: 'audio_photo' as const,
    priceMultiplier: 1.15,
    demandShift: 'high' as const,
    durationDays: 4
  },
  {
    id: 'ev_silicon_shortage',
    title: 'Дефицит чипов памяти',
    description: 'Задержки поставок полупроводников: видеокарты и ноутбуки дорожают.',
    categoryAffected: 'laptops_pc' as const,
    priceMultiplier: 1.22,
    demandShift: 'surge' as const,
    durationDays: 6
  },
  {
    id: 'ev_luxury_auction',
    title: 'Международный часовой аукцион',
    description: 'Интерес к редким часам и коллекционным позициям на пике.',
    categoryAffected: 'luxury_drops' as const,
    priceMultiplier: 1.2,
    demandShift: 'high' as const,
    durationDays: 4
  },
  {
    id: 'ev_car_season',
    title: 'Сезонный бум на авторынке',
    description: 'Спрос на автомобили с пробегом вырос на 20%, машины раскупают мгновенно!',
    categoryAffected: 'vehicles' as const,
    priceMultiplier: 1.2,
    demandShift: 'surge' as const,
    durationDays: 5
  },
  {
    id: 'ev_auto_tax',
    title: 'Колебания утильсбора',
    description: 'Цены на вторичные автомобили подскочили, покупатели готовы платить больше.',
    categoryAffected: 'vehicles' as const,
    priceMultiplier: 1.15,
    demandShift: 'high' as const,
    durationDays: 4
  }
];

export const CATEGORY_LABELS: Record<string, string> = {
  accessories: 'Аксессуары',
  smartphones: 'Смартфоны',
  audio_photo: 'Аудио & Фото',
  laptops_pc: 'ПК & Ноутбуки',
  luxury_drops: 'Премиум & Дропы',
  vehicles: 'Автомобили'
};

export const CONDITION_LABELS: Record<string, { label: string; multiplier: number; badgeColor: string }> = {
  new: { label: 'Новое (упаковка)', multiplier: 1.0, badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  like_new: { label: 'Идеальное', multiplier: 0.93, badgeColor: 'text-sky-700 bg-sky-50 border-sky-200' },
  good: { label: 'Хорошее', multiplier: 0.84, badgeColor: 'text-zinc-700 bg-zinc-100 border-zinc-200' },
  fair: { label: 'Следы исп.', multiplier: 0.72, badgeColor: 'text-amber-700 bg-amber-50 border-amber-200' }
};

export const DEMAND_LABELS: Record<string, { label: string; badgeColor: string }> = {
  surge: { label: 'Ажиотаж', badgeColor: 'text-rose-700 bg-rose-50 border-rose-200' },
  high: { label: 'Высокий', badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
  medium: { label: 'Умеренный', badgeColor: 'text-zinc-700 bg-zinc-100 border-zinc-200' },
  low: { label: 'Низкий', badgeColor: 'text-stone-600 bg-stone-100 border-stone-200' }
};

export const SELLER_ARCHETYPES: Record<string, {
  label: string;
  description: string;
  badgeColor: string;
  flexibility: number; // How readily they drop price (0.1 to 0.7)
  patience: number;    // Rounds they tolerate (3 to 5)
  minPriceRatio: number; // Min % of market price they'd consider
}> = {
  urgent: {
    label: 'Срочный продавец',
    description: 'Нужны деньги как можно быстрее, охотно идет на уступки',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    flexibility: 0.65,
    patience: 5,
    minPriceRatio: 0.58
  },
  stubborn: {
    label: 'Упрямый продавец',
    description: 'Держится за свою цену, почти не уступает',
    badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
    flexibility: 0.15,
    patience: 3,
    minPriceRatio: 0.88
  },
  pro: {
    label: 'Опытный продавец',
    description: 'Отлично ориентируется в ценах и спросе',
    badgeColor: 'text-indigo-700 bg-indigo-50 border-indigo-200',
    flexibility: 0.28,
    patience: 4,
    minPriceRatio: 0.78
  },
  clueless: {
    label: 'Не разбирающийся продавец',
    description: 'Не следит за рынком, легко соглашается на скидку',
    badgeColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
    flexibility: 0.55,
    patience: 4,
    minPriceRatio: 0.62
  },
  reseller: {
    label: 'Перекуп',
    description: 'Сам считает маржу и борется за каждый рубль',
    badgeColor: 'text-zinc-800 bg-zinc-100 border-zinc-300',
    flexibility: 0.18,
    patience: 3,
    minPriceRatio: 0.84
  },
  regular: {
    label: 'Обычный продавец',
    description: 'Разумно реагирует на обоснованный торг',
    badgeColor: 'text-zinc-700 bg-zinc-50 border-zinc-200',
    flexibility: 0.38,
    patience: 4,
    minPriceRatio: 0.72
  }
};

export const SELLER_MOODS: Record<string, {
  label: string;
  badgeColor: string;
}> = {
  urgent_cash: {
    label: 'Срочно нужны деньги',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-300 font-medium'
  },
  ready_to_sell: {
    label: 'Готов продать',
    badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200 font-medium'
  },
  calm: {
    label: 'Спокойный',
    badgeColor: 'text-zinc-700 bg-zinc-100 border-zinc-200 font-medium'
  },
  neutral: {
    label: 'Нейтральный',
    badgeColor: 'text-zinc-600 bg-zinc-50 border-zinc-200 font-medium'
  },
  irritated: {
    label: 'Раздражён',
    badgeColor: 'text-rose-700 bg-rose-50 border-rose-200 font-medium'
  }
};
