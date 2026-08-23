import { RestockPrediction, SeasonalProduct, SubstituteOption, PairingSuggestion, ShoppingHistoryRecord, ShoppingItem } from '../types/shopping';
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
