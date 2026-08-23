import { describe, it, expect } from 'vitest';
import { parseVoiceCommand, parseSingleItemString } from '../services/nlpParser';
import { categorizeItem } from '../services/categorizer';

describe('NLP Parser Engine', () => {
  it('should parse simple "Add milk" command', () => {
    const cmd = parseVoiceCommand('Add milk');
    expect(cmd.intent).toBe('ADD_ITEM');
    expect(cmd.items.length).toBe(1);
    expect(cmd.items[0].name).toBe('milk');
    expect(cmd.items[0].category).toBe('dairy');
    expect(cmd.items[0].quantity).toBe(1);
  });

  it('should parse quantity, unit, and item from varied phrasing: "I need 2 bottles of water"', () => {
    const cmd = parseVoiceCommand('I need 2 bottles of water');
    expect(cmd.intent).toBe('ADD_ITEM');
    expect(cmd.items.length).toBe(1);
    expect(cmd.items[0].quantity).toBe(2);
    expect(cmd.items[0].unit).toBe('bottle');
    expect(cmd.items[0].name).toBe('water');
    expect(cmd.items[0].category).toBe('beverages');
  });

  it('should parse multi-item chaining: "Add 2 boxes of cereal and 1 gallon of milk"', () => {
    const cmd = parseVoiceCommand('Add 2 boxes of cereal and 1 gallon of milk');
    expect(cmd.intent).toBe('ADD_ITEM');
    expect(cmd.items.length).toBe(2);
    expect(cmd.items[0].name).toBe('cereal');
    expect(cmd.items[0].quantity).toBe(2);
    expect(cmd.items[0].unit).toBe('box');
    expect(cmd.items[0].category).toBe('pantry');

    expect(cmd.items[1].name).toBe('milk');
    expect(cmd.items[1].quantity).toBe(1);
    expect(cmd.items[1].unit).toBe('gallon');
    expect(cmd.items[1].category).toBe('dairy');
  });

  it('should parse remove command: "Remove milk from my list"', () => {
    const cmd = parseVoiceCommand('Remove milk from my list');
    expect(cmd.intent).toBe('REMOVE_ITEM');
    expect(cmd.targetItemName).toBe('milk');
  });

  it('should parse modification command: "Change apples quantity to 5"', () => {
    const cmd = parseVoiceCommand('Change apples quantity to 5');
    expect(cmd.intent).toBe('MODIFY_QUANTITY');
    expect(cmd.targetItemName).toBe('apples');
    expect(cmd.items[0].quantity).toBe(5);
  });

  it('should parse search with price filter: "Find toothpaste under $5"', () => {
    const cmd = parseVoiceCommand('Find toothpaste under $5');
    expect(cmd.intent).toBe('FILTER_PRICE');
    expect(cmd.filterCriteria?.query).toBe('toothpaste');
    expect(cmd.filterCriteria?.maxPrice).toBe(5);
  });

  it('should parse price range search: "Find snacks between $2 and $6"', () => {
    const cmd = parseVoiceCommand('Find snacks between $2 and $6');
    expect(cmd.intent).toBe('FILTER_PRICE');
    expect(cmd.filterCriteria?.minPrice).toBe(2);
    expect(cmd.filterCriteria?.maxPrice).toBe(6);
  });

  it('should parse seasonal recommendation intent: "What is in season?"', () => {
    const cmd = parseVoiceCommand('What is in season?');
    expect(cmd.intent).toBe('GET_SEASONAL');
  });

  it('should parse substitute intent: "Suggest a substitute for butter"', () => {
    const cmd = parseVoiceCommand('Suggest a substitute for butter');
    expect(cmd.intent).toBe('GET_SUBSTITUTE');
    expect(cmd.targetItemName).toBe('butter');
  });

  it('should parse restock intent: "What should I restock?"', () => {
    const cmd = parseVoiceCommand('What should I restock?');
    expect(cmd.intent).toBe('GET_SUGGESTIONS');
  });

  it('should extract word-based quantities (half a dozen, dozen, three)', () => {
    const dozenEggs = parseSingleItemString('dozen eggs');
    expect(dozenEggs.quantity).toBe(12);

    const halfDozen = parseSingleItemString('half a dozen donuts');
    expect(halfDozen.quantity).toBe(6);

    const threeApples = parseSingleItemString('three organic apples');
    expect(threeApples.quantity).toBe(3);
    expect(threeApples.attributes).toContain('Organic');
  });
});

describe('Categorization Engine', () => {
  it('should categorize produce, dairy, bakery, meat, pantry, beverages, snacks, household correctly', () => {
    expect(categorizeItem('Organic Bananas')).toBe('produce');
    expect(categorizeItem('Almond Milk')).toBe('dairy');
    expect(categorizeItem('Sourdough Loaf')).toBe('bakery');
    expect(categorizeItem('Salmon Fillet')).toBe('meat');
    expect(categorizeItem('Spaghetti Pasta')).toBe('pantry');
    expect(categorizeItem('Orange Juice')).toBe('beverages');
    expect(categorizeItem('Tortilla Chips')).toBe('snacks');
    expect(categorizeItem('Toothpaste')).toBe('household');
    expect(categorizeItem('Dish Soap')).toBe('household');
  });
});
