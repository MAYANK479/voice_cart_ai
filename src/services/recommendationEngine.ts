import {
  RestockPrediction,
  SeasonalProduct,
  SubstituteOption,
  PairingSuggestion,
  ShoppingHistoryRecord,
  ShoppingItem,
  SmartBasketSuggestion,
} from '../types/shopping';

import { MOCK_RESTOCK_RULES } from '../data/historyData';
import { SUBSTITUTE_DATABASE } from '../data/substituteData';
import { SEASONAL_PRODUCTS } from '../data/seasonalData';
import { PAIRING_DATABASE } from '../data/pairingsData';

/**
 * Calculates restock predictions comparing current shopping list, history, and consumption cycle.
 */
export function getRestockPredictions(
  history: ShoppingHistoryRecord[],
  currentList: ShoppingItem[]
): RestockPrediction[] {
  const currentItemNames = new Set(currentList.map((i) => i.name.toLowerCase()));
  const predictions: RestockPrediction[] = [];

  for (const rule of MOCK_RESTOCK_RULES) {
    // If the item is already on the shopping list, do not repeat it as a restock alert
    if (currentItemNames.has(rule.itemName.toLowerCase())) {
      continue;
    }

    const historyEntry = history.find((h) => h.itemName.toLowerCase() === rule.itemName.toLowerCase());
    let daysAgo = 5;

    if (historyEntry) {
      const diffMs = Date.now() - new Date(historyEntry.purchaseDate).getTime();
      daysAgo = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }

    // Determine urgency
    let urgency: 'high' | 'medium' | 'low' = 'low';
    if (daysAgo >= rule.averageCycleDays + 2) {
      urgency = 'high';
    } else if (daysAgo >= rule.averageCycleDays) {
      urgency = 'medium';
    }

    predictions.push({
      id: `restock-${rule.itemName.replace(/\s+/g, '-').toLowerCase()}`,
      itemName: rule.itemName,
      category: rule.category,
      lastPurchasedDaysAgo: daysAgo,
      averageCycleDays: rule.averageCycleDays,
      urgency,
      estimatedPrice: rule.estimatedPrice,
      unit: rule.unit,
      reason: rule.reason,
    });
  }

  // Sort by urgency: high -> medium -> low
  const urgencyWeight = { high: 3, medium: 2, low: 1 };
  return predictions.sort((a, b) => urgencyWeight[b.urgency] - urgencyWeight[a.urgency]);
}

/**
 * Finds dietary/healthy substitute alternatives for a product name or category.
 */
export function getSubstitutesFor(itemName: string): SubstituteOption[] {
  if (!itemName) return SUBSTITUTE_DATABASE.slice(0, 6);

  const clean = itemName.toLowerCase().trim();

  // Find exact or partial matching items
  const matched = SUBSTITUTE_DATABASE.filter(
    (s) =>
      clean.includes(s.originalItem.toLowerCase()) ||
      s.originalItem.toLowerCase().includes(clean) ||
      s.substituteName.toLowerCase().includes(clean)
  );

  return matched.length > 0 ? matched : SUBSTITUTE_DATABASE.slice(0, 6);
}

/**
 * Retrieves current seasonal and on-sale recommendations.
 */
export function getSeasonalRecommendations(season?: 'Spring' | 'Summer' | 'Autumn' | 'Winter'): SeasonalProduct[] {
  if (!season) {
    return SEASONAL_PRODUCTS;
  }
  return SEASONAL_PRODUCTS.filter((p) => p.season === season || p.season === 'All-Year' || p.onSale);
}

/**
 * Discovers companion item pairings when a user adds specific items.
 */
export function findCompanionPairing(addedItemName: string, currentList: ShoppingItem[]): PairingSuggestion | null {
  const clean = addedItemName.toLowerCase();
  const currentNames = new Set(currentList.map((i) => i.name.toLowerCase()));

  for (const pair of PAIRING_DATABASE) {
    if (clean.includes(pair.triggerItem.toLowerCase())) {
      // Don't suggest if already in list
      if (!currentNames.has(pair.suggestedItem.toLowerCase())) {
        return pair;
      }
    }
  }

  return null;
}

/**
 * Generates an intelligent personalized basket ("✨ Build My List")
 * analyzing past purchase frequencies, consumption cycles, and complementary staples.
 */
export function generateSmartBasket(
  history: ShoppingHistoryRecord[],
  currentList: ShoppingItem[],
  customRecurringItems: ShoppingItem[] = []
): SmartBasketSuggestion {
  const currentNames = new Set(currentList.map((i) => i.name.toLowerCase()));

  // 1. Habit Staples (frequently purchased in history e.g. Milk, Eggs, Bread)
  const habitItems: SmartBasketSuggestion['habitItems'] = [];
  for (const record of history) {
    if (currentNames.has(record.itemName.toLowerCase())) continue;
    if (habitItems.some((h) => h.name.toLowerCase() === record.itemName.toLowerCase())) continue;

    const rule = MOCK_RESTOCK_RULES.find((r) => r.itemName.toLowerCase() === record.itemName.toLowerCase());
    const price = rule ? rule.estimatedPrice : 3.49;
    const unit = rule ? rule.unit : 'item';

    habitItems.push({
      name: record.itemName,
      quantity: 1,
      unit,
      category: record.category,
      price,
      reason: `Purchased ${record.frequency}x in the last 60 days`,
      selected: true,
    });
  }

  // Include custom recurring items
  for (const rec of customRecurringItems) {
    if (currentNames.has(rec.name.toLowerCase())) continue;
    if (habitItems.some((h) => h.name.toLowerCase() === rec.name.toLowerCase())) continue;

    habitItems.push({
      name: rec.name,
      quantity: rec.quantity || 1,
      unit: rec.unit || 'item',
      category: rec.category,
      price: rec.estimatedPrice || 3.99,
      reason: `Recurring auto-restock (${rec.recurringDays || 7}d cycle)`,
      selected: true,
    });
  }

  // 2. Recommended additions (peak seasonal harvest and deals)
  const recommendedItems: SmartBasketSuggestion['recommendedItems'] = [];
  const seasonalPicks = SEASONAL_PRODUCTS.slice(0, 3);
  for (const pick of seasonalPicks) {
    if (currentNames.has(pick.name.toLowerCase())) continue;
    if (habitItems.some((h) => h.name.toLowerCase() === pick.name.toLowerCase())) continue;
    if (recommendedItems.some((r) => r.name.toLowerCase() === pick.name.toLowerCase())) continue;

    recommendedItems.push({
      name: pick.name,
      quantity: 1,
      unit: pick.unit,
      category: pick.category,
      price: pick.discountedPrice || pick.originalPrice,
      reason: `Peak freshness deal (${pick.badge})`,
      selected: false,
    });
  }

  const selectedHabits = habitItems.slice(0, 4);
  const selectedRecs = recommendedItems.slice(0, 3);
  const totalCost = [...selectedHabits, ...selectedRecs].reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    habitItems: selectedHabits,
    recommendedItems: selectedRecs,
    totalEstimatedCost: parseFloat(totalCost.toFixed(2)),
  };
}

