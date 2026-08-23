import { ShoppingItem, ShoppingHistoryRecord } from '../types/shopping';
import { INITIAL_SHOPPING_HISTORY } from '../data/historyData';
import { SupportedLanguage } from '../types/speech';

const STORAGE_KEYS = {
  ITEMS: 'voicecart_shopping_items_v1',
  HISTORY: 'voicecart_shopping_history_v1',
  BUDGET: 'voicecart_budget_limit_v1',
  LANGUAGE: 'voicecart_preferred_lang_v1',
  TTS_ENABLED: 'voicecart_tts_enabled_v1',
  THEME: 'voicecart_theme_v1',
};

export const INITIAL_DEMO_ITEMS: ShoppingItem[] = [
  {
    id: 'item-demo-1',
    name: 'Organic Honeycrisp Apples',
    quantity: 3,
    unit: 'lb',
    category: 'produce',
    estimatedPrice: 3.99,
    completed: false,
    dietaryTags: ['Organic', 'Vegan'],
    addedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    source: 'voice',
  },
  {
    id: 'item-demo-2',
    name: 'Pasture-Raised Grade A Large Eggs',
    quantity: 1,
    unit: 'carton',
    category: 'dairy',
    estimatedPrice: 4.99,
    completed: false,
    dietaryTags: ['Organic', 'Keto'],
    addedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    source: 'voice',
  },
  {
    id: 'item-demo-3',
    name: 'Artisan Sourdough Loaf',
    quantity: 1,
    unit: 'loaf',
    category: 'bakery',
    estimatedPrice: 4.29,
    completed: true,
    dietaryTags: ['Vegan'],
    addedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    source: 'manual',
  },
  {
    id: 'item-demo-4',
    name: 'Cold Brew Coffee Concentrate',
    quantity: 2,
    unit: 'bottle',
    category: 'beverages',
    estimatedPrice: 6.49,
    completed: false,
    dietaryTags: ['Organic', 'Sugar-Free'],
    addedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    source: 'voice',
  },
  {
    id: 'item-demo-5',
    name: 'Organic Sea Salt Tortilla Chips',
    quantity: 1,
    unit: 'bag',
    category: 'snacks',
    estimatedPrice: 3.49,
    completed: false,
    dietaryTags: ['Organic', 'Gluten-Free'],
    addedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    source: 'suggestion',
  },
];

export const storageService = {
  getItems(): ShoppingItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ITEMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(INITIAL_DEMO_ITEMS));
        return INITIAL_DEMO_ITEMS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_DEMO_ITEMS;
    }
  },

  saveItems(items: ShoppingItem[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ITEMS, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving items to localStorage', e);
    }
  },

  getHistory(): ShoppingHistoryRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(INITIAL_SHOPPING_HISTORY));
        return INITIAL_SHOPPING_HISTORY;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SHOPPING_HISTORY;
    }
  },

  saveHistory(history: ShoppingHistoryRecord[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    } catch (e) {
      console.warn('Error saving history to localStorage', e);
    }
  },

  getBudget(): number {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BUDGET);
      return data ? parseFloat(data) : 60.0;
    } catch {
      return 60.0;
    }
  },

  saveBudget(budget: number): void {
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGET, budget.toString());
    } catch (e) {
      console.warn('Error saving budget', e);
    }
  },

  getLanguage(): SupportedLanguage {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE) as SupportedLanguage;
      return data || 'en-US';
    } catch {
      return 'en-US';
    }
  },

  saveLanguage(lang: SupportedLanguage): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn('Error saving language', e);
    }
  },

  getTTSEnabled(): boolean {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TTS_ENABLED);
      return data === null ? true : data === 'true';
    } catch {
      return true;
    }
  },

  saveTTSEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(STORAGE_KEYS.TTS_ENABLED, String(enabled));
    } catch (e) {
      console.warn('Error saving TTS setting', e);
    }
  },

  exportToCSV(items: ShoppingItem[]): void {
    const headers = ['Item Name', 'Quantity', 'Unit', 'Category', 'Estimated Price (USD)', 'Status', 'Added At'];
    const rows = items.map((item) => [
      `"${item.name.replace(/"/g, '""')}"`,
      item.quantity,
      item.unit,
      item.category,
      (item.estimatedPrice * item.quantity).toFixed(2),
      item.completed ? 'Completed' : 'Pending',
      item.addedAt,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shopping_list_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  exportToJSON(items: ShoppingItem[]): void {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `shopping_list_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
