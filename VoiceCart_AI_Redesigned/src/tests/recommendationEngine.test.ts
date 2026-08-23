import { describe, it, expect } from 'vitest';
import { getRestockPredictions, getSubstitutesFor, findCompanionPairing } from '../services/recommendationEngine';
import { INITIAL_SHOPPING_HISTORY } from '../data/historyData';

describe('Recommendation Engine', () => {
  it('should predict restock items when history shows consumption cycle exceeded', () => {
    const predictions = getRestockPredictions(INITIAL_SHOPPING_HISTORY, []);
    expect(predictions.length).toBeGreaterThan(0);
    const highUrgency = predictions.filter((p) => p.urgency === 'high');
    expect(highUrgency.length).toBeGreaterThan(0);
  });

  it('should exclude items already on the active shopping list from restock alerts', () => {
    const predictions = getRestockPredictions(INITIAL_SHOPPING_HISTORY, [
      {
        id: '1',
        name: 'Organic Whole Milk',
        quantity: 1,
        unit: 'gallon',
        category: 'dairy',
        estimatedPrice: 4.49,
        completed: false,
        addedAt: new Date().toISOString(),
        source: 'manual',
      },
    ]);

    const hasMilk = predictions.some((p) => p.itemName.toLowerCase().includes('milk'));
    expect(hasMilk).toBe(false);
  });

  it('should find relevant substitutes for common dietary ingredients', () => {
    const milkSubs = getSubstitutesFor('milk');
    expect(milkSubs.length).toBeGreaterThan(0);
    expect(milkSubs.some((s) => s.substituteName.toLowerCase().includes('almond') || s.substituteName.toLowerCase().includes('oat'))).toBe(true);

    const butterSubs = getSubstitutesFor('butter');
    expect(butterSubs.length).toBeGreaterThan(0);
  });

  it('should identify companion item pairings when trigger product is added', () => {
    const pairing = findCompanionPairing('pasta', []);
    expect(pairing).not.toBeNull();
    expect(pairing?.suggestedItem).toContain('Marinara');

    const chipsPairing = findCompanionPairing('tortilla chips', []);
    expect(chipsPairing).not.toBeNull();
    expect(chipsPairing?.suggestedItem).toContain('Salsa');
  });
});
