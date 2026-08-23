export type ActiveView = 'dashboard' | 'insights' | 'history' | 'nlp-lab' | 'checkout';


export type CategoryId =
  | 'produce'
  | 'dairy'
  | 'bakery'
  | 'meat'
  | 'pantry'
  | 'beverages'
  | 'snacks'
  | 'household'
  | 'other';


export interface CategoryInfo {
  id: CategoryId;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export interface ShoppingListInfo {
  id: string;
  name: string;
  emoji: string;
  description: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: CategoryId;
  estimatedPrice: number; // in USD
  completed: boolean;
  notes?: string;
  brand?: string;
  dietaryTags?: string[];
  addedAt: string; // ISO date string
  updatedAt?: string;
  source: 'voice' | 'manual' | 'suggestion' | 'substitute' | 'catalog';
  listId?: string; // target list ID e.g. 'weekly-grocery'
  isRecurring?: boolean;
  recurringDays?: number; // e.g. 7 for every 7 days
}

export interface SmartBasketSuggestion {
  habitItems: Array<{
    name: string;
    quantity: number;
    unit: string;
    category: CategoryId;
    price: number;
    reason: string;
    selected: boolean;
  }>;
  recommendedItems: Array<{
    name: string;
    quantity: number;
    unit: string;
    category: CategoryId;
    price: number;
    reason: string;
    selected: boolean;
  }>;
  totalEstimatedCost: number;
}

export interface RestockPrediction {
  id: string;
  itemName: string;
  category: CategoryId;
  lastPurchasedDaysAgo: number;
  averageCycleDays: number;
  urgency: 'high' | 'medium' | 'low';
  estimatedPrice: number;
  unit: string;
  reason: string;
  isRecurring?: boolean;
}

export interface SeasonalProduct {
  id: string;
  name: string;
  category: CategoryId;
  season: 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All-Year';
  onSale: boolean;
  originalPrice: number;
  discountedPrice: number;
  unit: string;
  badge: string;
  description: string;
  nutritionalHighlight?: string;
}

export interface SubstituteOption {
  originalItem: string;
  substituteName: string;
  category: CategoryId;
  type: 'dietary' | 'healthier' | 'budget' | 'allergy-friendly';
  estimatedPrice: number;
  unit: string;
  benefit: string;
  dietaryTags: string[];
}

export interface PairingSuggestion {
  triggerItem: string;
  suggestedItem: string;
  category: CategoryId;
  reason: string;
  price: number;
  unit: string;
}

export interface ShoppingHistoryRecord {
  id: string;
  itemName: string;
  category: CategoryId;
  purchaseDate: string;
  frequency: number; // times purchased in past 60 days
}

