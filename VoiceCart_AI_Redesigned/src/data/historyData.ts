import { ShoppingHistoryRecord, RestockPrediction } from '../types/shopping';

export const INITIAL_SHOPPING_HISTORY: ShoppingHistoryRecord[] = [
  {
    id: 'hist-1',
    itemName: 'Organic Whole Milk',
    category: 'dairy',
    purchaseDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
    frequency: 7, // buy every 4 days
  },
  {
    id: 'hist-2',
    itemName: '100% Whole Wheat Bread',
    category: 'bakery',
    purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    frequency: 6, // buy every 5 days
  },
  {
    id: 'hist-3',
    itemName: 'Pasture-Raised Grade A Large Eggs',
    category: 'dairy',
    purchaseDate: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(), // 11 days ago
    frequency: 5, // buy every 7 days
  },
  {
    id: 'hist-4',
    itemName: 'Fresh Organic Bananas',
    category: 'produce',
    purchaseDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    frequency: 8, // buy every 3 days
  },
  {
    id: 'hist-5',
    itemName: 'Cold Brew Coffee Concentrate',
    category: 'beverages',
    purchaseDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    frequency: 4,
  },
];

export const MOCK_RESTOCK_RULES: Omit<RestockPrediction, 'id' | 'lastPurchasedDaysAgo' | 'urgency'>[] = [
  {
    itemName: 'Organic Whole Milk',
    category: 'dairy',
    averageCycleDays: 4,
    estimatedPrice: 4.49,
    unit: 'gallon',
    reason: 'Typically consumed every 4 days. You last restocked 6 days ago.',
  },
  {
    itemName: '100% Whole Wheat Bread',
    category: 'bakery',
    averageCycleDays: 5,
    estimatedPrice: 4.49,
    unit: 'loaf',
    reason: 'Your usual bread loaf lasts 5 days. It looks like you are running low on bread.',
  },
  {
    itemName: 'Pasture-Raised Grade A Large Eggs',
    category: 'dairy',
    averageCycleDays: 7,
    estimatedPrice: 4.99,
    unit: 'carton',
    reason: 'Bought 11 days ago. You usually consume 1 dozen eggs every week.',
  },
  {
    itemName: 'Fresh Organic Bananas',
    category: 'produce',
    averageCycleDays: 3,
    estimatedPrice: 1.49,
    unit: 'bunch',
    reason: 'Purchased 4 days ago. Bananas are likely finished.',
  },
  {
    itemName: 'Cold Brew Coffee Concentrate',
    category: 'beverages',
    averageCycleDays: 10,
    estimatedPrice: 6.49,
    unit: 'bottle',
    reason: 'Last bought 14 days ago. Restock your morning brew.',
  },
];
