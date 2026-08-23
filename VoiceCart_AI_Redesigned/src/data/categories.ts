import { CategoryId, CategoryInfo } from '../types/shopping';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  produce: {
    id: 'produce',
    name: 'Produce & Fruits',
    emoji: '🥑',
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
  },
  dairy: {
    id: 'dairy',
    name: 'Dairy & Eggs',
    emoji: '🥛',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.12)',
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery & Bread',
    emoji: '🍞',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.12)',
  },
  meat: {
    id: 'meat',
    name: 'Meat & Seafood',
    emoji: '🥩',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.12)',
  },
  pantry: {
    id: 'pantry',
    name: 'Pantry & Grains',
    emoji: '🥫',
    color: '#8b5cf6',
    bgColor: 'rgba(139, 92, 246, 0.12)',
  },
  beverages: {
    id: 'beverages',
    name: 'Beverages & Drinks',
    emoji: '🧃',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.12)',
  },
  snacks: {
    id: 'snacks',
    name: 'Snacks & Sweets',
    emoji: '🍿',
    color: '#ec4899',
    bgColor: 'rgba(236, 72, 153, 0.12)',
  },
  household: {
    id: 'household',
    name: 'Household & Care',
    emoji: '🧼',
    color: '#14b8a6',
    bgColor: 'rgba(20, 184, 166, 0.12)',
  },
  other: {
    id: 'other',
    name: 'General Items',
    emoji: '🛒',
    color: '#64748b',
    bgColor: 'rgba(100, 116, 139, 0.12)',
  },
};

export const DEFAULT_CATEGORY_ORDER: CategoryId[] = [
  'produce',
  'dairy',
  'bakery',
  'meat',
  'pantry',
  'beverages',
  'snacks',
  'household',
  'other',
];
