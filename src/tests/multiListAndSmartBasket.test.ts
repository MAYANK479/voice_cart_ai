import { describe, it, expect } from 'vitest';
import { generateSmartBasket } from '../services/recommendationEngine';
import { parseVoiceCommand } from '../services/nlpParser';
import { ShoppingItem, ShoppingHistoryRecord } from '../types/shopping';

describe('Multi-List Support & Voice Target Parsing', () => {
  it('extracts party list from voice command "Add 50 cups and paper plates to party list"', () => {
    const parsed = parseVoiceCommand('Add 50 cups and paper plates to party list', 'en-US');
    expect(parsed.intent).toBe('ADD_ITEM');
    expect(parsed.targetList).toBe('party');
    expect(parsed.items.length).toBeGreaterThanOrEqual(1);
    expect(parsed.items[0].targetList).toBe('party');
  });

  it('extracts office list from voice command "Add 2 boxes of green tea to office list"', () => {
    const parsed = parseVoiceCommand('Add 2 boxes of green tea to office list', 'en-US');
    expect(parsed.intent).toBe('ADD_ITEM');
    expect(parsed.targetList).toBe('office');
    expect(parsed.items.length).toBe(1);
    expect(parsed.items[0].name.toLowerCase()).toContain('tea');
  });

  it('extracts home essentials list from voice command "Add paper towels to home essentials list"', () => {
    const parsed = parseVoiceCommand('Add paper towels to home essentials list', 'en-US');
    expect(parsed.intent).toBe('ADD_ITEM');
    expect(parsed.targetList).toBe('home-essentials');
  });
});

describe('Smart Basket "Build My List" Engine', () => {
  const mockHistory: ShoppingHistoryRecord[] = [
    {
      id: 'h1',
      itemName: 'Whole Organic Milk',
      category: 'dairy',
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
      frequency: 9,
    },
    {
      id: 'h2',
      itemName: 'Organic Sourdough Bread',
      category: 'bakery',
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
      frequency: 7,
    },
    {
      id: 'h3',
      itemName: 'Grade A Large Eggs',
      category: 'dairy',
      purchaseDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      frequency: 11,
    },
  ];

  const currentList: ShoppingItem[] = [];

  it('generates a personalized basket with habit staples and recommended additions', () => {
    const basket = generateSmartBasket(mockHistory, currentList);
    expect(basket.habitItems.length).toBeGreaterThan(0);
    expect(basket.totalEstimatedCost).toBeGreaterThan(0);

    const habitNames = basket.habitItems.map((item: { name: string }) => item.name.toLowerCase());
    expect(habitNames.some((n: string) => n.includes('milk') || n.includes('eggs') || n.includes('bread'))).toBe(true);
  });

  it('excludes items already present on the current active shopping list', () => {
    const existingList: ShoppingItem[] = [
      {
        id: 'item-1',
        name: 'Whole Organic Milk',
        quantity: 1,
        unit: 'bottle',
        category: 'dairy',
        estimatedPrice: 4.49,
        completed: false,
        addedAt: new Date().toISOString(),
        source: 'manual',
      },
    ];

    const basket = generateSmartBasket(mockHistory, existingList);
    const habitNames = basket.habitItems.map((item: { name: string }) => item.name.toLowerCase());
    expect(habitNames.includes('whole organic milk')).toBe(false);
  });

  it('includes custom recurring marked staples', () => {
    const recurringStaples: ShoppingItem[] = [
      {
        id: 'rec-1',
        name: 'Cold Brew Concentrate',
        quantity: 2,
        unit: 'bottle',
        category: 'beverages',
        estimatedPrice: 6.49,
        completed: false,
        addedAt: new Date().toISOString(),
        source: 'manual',
        isRecurring: true,
        recurringDays: 7,
      },
    ];

    const basket = generateSmartBasket(mockHistory, [], recurringStaples);
    const habitNames = basket.habitItems.map((item: { name: string }) => item.name.toLowerCase());
    expect(habitNames.some((n: string) => n.includes('cold brew'))).toBe(true);
  });
});

