import { describe, it, expect } from 'vitest';
import { categorizeItem, getDepartmentName, getCategoryEmoji, guessPrice } from '../services/categorizer';

describe('Department Categorizer & Heuristics Service', () => {
  it('correctly maps produce items to produce category', () => {
    expect(categorizeItem('Honeycrisp Apples')).toBe('produce');
    expect(categorizeItem('Organic Bananas')).toBe('produce');
    expect(categorizeItem('Fresh Spinach')).toBe('produce');
    expect(categorizeItem('Avocado')).toBe('produce');
  });

  it('correctly maps dairy items to dairy category', () => {
    expect(categorizeItem('Whole Milk 1 Gallon')).toBe('dairy');
    expect(categorizeItem('Greek Yogurt')).toBe('dairy');
    expect(categorizeItem('Cheddar Cheese Block')).toBe('dairy');
    expect(categorizeItem('Salted Butter')).toBe('dairy');
    expect(categorizeItem('Grade A Large Eggs')).toBe('dairy');
  });

  it('correctly maps bakery, meat, pantry, beverages, and snacks', () => {
    expect(categorizeItem('Sourdough Bread')).toBe('bakery');
    expect(categorizeItem('Boneless Chicken Breast')).toBe('meat');
    expect(categorizeItem('Extra Virgin Olive Oil')).toBe('pantry');
    expect(categorizeItem('Cold Brew Coffee')).toBe('beverages');
    expect(categorizeItem('Sea Salt Potato Chips')).toBe('snacks');
    expect(categorizeItem('Toothpaste and Floss')).toBe('household');
  });

  it('falls back to other for unknown items', () => {
    expect(categorizeItem('Quantum Teleporter 3000')).toBe('other');
  });

  it('provides category emojis and department names', () => {
    expect(getCategoryEmoji('produce')).toBe('🥑');
    expect(getCategoryEmoji('dairy')).toBe('🥛');
    expect(getDepartmentName('produce')).toBe('Produce & Fruits');
    expect(getDepartmentName('dairy')).toBe('Dairy & Eggs');
  });

  it('estimates reasonable realistic price bounds for known items', () => {
    const milkPrice = guessPrice('Whole Milk');
    expect(milkPrice).toBeGreaterThan(1.0);
    expect(milkPrice).toBeLessThan(10.0);

    const salmonPrice = guessPrice('Atlantic Salmon');
    expect(salmonPrice).toBeGreaterThan(5.0);
  });
});
