import { CategoryId, CategoryInfo } from '../types/shopping';

export const CATEGORIES: Record<CategoryId, CategoryInfo> = {
  produce: {
    id: 'produce',
    name: 'Produce & Fruits',
    emoji: '🥑',
    color: '#6AA874',
    bgColor: '#E8EFE8',
  },
  dairy: {
    id: 'dairy',
    name: 'Dairy & Eggs',
    emoji: '🥛',
    color: '#719CBF',
    bgColor: '#E8F1F8',
  },
  bakery: {
    id: 'bakery',
    name: 'Bakery & Bread',
    emoji: '🍞',
    color: '#DDA458',
    bgColor: '#FAF2E6',
  },
  meat: {
    id: 'meat',
    name: 'Meat & Seafood',
    emoji: '🥩',
    color: '#D97777',
    bgColor: '#FAECEC',
  },
  pantry: {
    id: 'pantry',
    name: 'Pantry & Grains',
    emoji: '🥫',
    color: '#9588B2',
    bgColor: '#EFEDF4',
  },
  beverages: {
    id: 'beverages',
    name: 'Beverages & Drinks',
    emoji: '🧃',
    color: '#5DA1AC',
    bgColor: '#E6F4F6',
  },
  snacks: {
    id: 'snacks',
    name: 'Snacks & Sweets',
    emoji: '🍿',
    color: '#FF9E97',
    bgColor: '#FFEBE9',
  },
  household: {
    id: 'household',
    name: 'Household & Care',
    emoji: '🧼',
    color: '#6FA499',
    bgColor: '#E8F5F2',
  },
  other: {
    id: 'other',
    name: 'Other Items',
    emoji: '📦',
    color: '#8C857E',
    bgColor: '#F5F2EA',
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
