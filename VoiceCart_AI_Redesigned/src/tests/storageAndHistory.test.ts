import { describe, it, expect } from 'vitest';
import { storageService } from '../services/storageService';
import { getRestockPredictions, getSubstitutesFor, findCompanionPairing } from '../services/recommendationEngine';
import { INITIAL_SHOPPING_HISTORY } from '../data/historyData';
import { ShoppingItem } from '../types/shopping';


describe('Storage & History Services', () => {
  it('should return initial demo items when storage is empty', () => {
    const items = storageService.getItems();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].name).toBeDefined();
  });

  it('should return initial command logs for recruiter demonstration', () => {
    const commands = storageService.getCommands();
    expect(commands.length).toBeGreaterThanOrEqual(4);
    expect(commands[0].intent).toBe('ADD_ITEM');
  });

  it('should calculate restock predictions based on history velocity', () => {
    const mockList: ShoppingItem[] = [];
    const predictions = getRestockPredictions(INITIAL_SHOPPING_HISTORY, mockList);
    expect(predictions.length).toBeGreaterThan(0);
    // Highest urgency should be sorted first
    expect(['high', 'medium', 'low']).toContain(predictions[0].urgency);
  });

  it('should not recommend items that are already on the current shopping list', () => {
    const mockList: ShoppingItem[] = [
      {
        id: 'test-bread',
        name: 'Whole Wheat Bread',
        quantity: 1,
        unit: 'loaf',
        category: 'bakery',
        estimatedPrice: 3.49,
        completed: false,
        addedAt: new Date().toISOString(),
        source: 'manual',
      },
    ];

    const predictions = getRestockPredictions(INITIAL_SHOPPING_HISTORY, mockList);
    const breadPrediction = predictions.find((p) => p.itemName.toLowerCase() === 'whole wheat bread');
    expect(breadPrediction).toBeUndefined();
  });

  it('should find smart substitutes for dairy butter', () => {
    const subs = getSubstitutesFor('butter');
    expect(subs.length).toBeGreaterThan(0);
    expect(subs.some((s) => s.substituteName.toLowerCase().includes('oil') || s.substituteName.toLowerCase().includes('spread'))).toBe(true);
  });

  it('should suggest companion item pairings (e.g. chips -> salsa)', () => {
    const currentList: ShoppingItem[] = [];
    const pairing = findCompanionPairing('Tortilla Chips', currentList);
    expect(pairing).not.toBeNull();
    expect(pairing?.suggestedItem.toLowerCase()).toContain('salsa');
  });
});
