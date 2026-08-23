import { CategoryId } from '../types/shopping';

// Department dictionary with high-frequency grocery keywords
const CATEGORY_KEYWORDS: Record<CategoryId, string[]> = {
  produce: [
    'apple', 'apples', 'banana', 'bananas', 'orange', 'oranges', 'grape', 'grapes',
    'berry', 'berries', 'strawberry', 'strawberries', 'blueberry', 'blueberries',
    'lemon', 'lemons', 'lime', 'limes', 'avocado', 'avocados', 'tomato', 'tomatoes',
    'potato', 'potatoes', 'onion', 'onions', 'garlic', 'spinach', 'kale', 'lettuce',
    'carrot', 'carrots', 'broccoli', 'cucumber', 'cucumbers', 'pepper', 'peppers',
    'celery', 'mushroom', 'mushrooms', 'watermelon', 'peach', 'peaches', 'mango',
    'mangoes', 'herb', 'herbs', 'cilantro', 'basil', 'fruit', 'fruits', 'vegetable',
    'vegetables', 'salad', 'ginger', 'mint', 'zucchini', 'cabbage', 'cauliflower',
    'asparagus', 'papaya', 'pineapple', 'pear', 'pears', 'plum', 'plums', 'cherry', 'cherries'
  ],
  dairy: [
    'milk', 'almond milk', 'oat milk', 'soy milk', 'cheese', 'cheddar', 'mozzarella',
    'parmesan', 'swiss cheese', 'yogurt', 'yoghurt', 'greek yogurt', 'egg', 'eggs',
    'butter', 'cream', 'heavy cream', 'sour cream', 'cream cheese', 'curd', 'paneer',
    'tofu', 'buttermilk', 'half and half', 'cottage cheese', 'ghee', 'dairy'
  ],
  bakery: [
    'bread', 'loaf', 'sourdough', 'bagel', 'bagels', 'croissant', 'croissants',
    'muffin', 'muffins', 'bun', 'buns', 'brioche', 'roll', 'rolls', 'pita', 'naan',
    'tortilla', 'tortillas', 'baguette', 'cake', 'cookies', 'cookie', 'pastry',
    'donut', 'donuts', 'doughnut', 'crust', 'pie crust', 'wheat bread', 'white bread'
  ],
  meat: [
    'chicken', 'chicken breast', 'chicken wings', 'beef', 'ground beef', 'steak',
    'pork', 'bacon', 'ham', 'sausage', 'sausages', 'turkey', 'lamb', 'salmon',
    'fish', 'tuna', 'shrimp', 'prawns', 'crab', 'lobster', 'cod', 'tilapia',
    'meatball', 'meatballs', 'ribs', 'mutton', 'seafood', 'meat'
  ],
  pantry: [
    'rice', 'pasta', 'spaghetti', 'macaroni', 'noodle', 'noodles', 'sauce', 'marinara',
    'olive oil', 'vegetable oil', 'oil', 'flour', 'sugar', 'salt', 'black pepper',
    'spice', 'spices', 'honey', 'maple syrup', 'cereal', 'oats', 'oatmeal', 'beans',
    'black beans', 'chickpeas', 'lentils', 'soup', 'canned tomato', 'tuna can',
    'peanut butter', 'jam', 'jelly', 'ketchup', 'mustard', 'mayo', 'mayonnaise',
    'vinegar', 'soy sauce', 'pasta sauce', 'broth', 'baking powder', 'yeast', 'quinoa'
  ],
  beverages: [
    'water', 'sparkling water', 'mineral water', 'juice', 'orange juice', 'apple juice',
    'coffee', 'cold brew', 'tea', 'green tea', 'black tea', 'soda', 'coke', 'pepsi',
    'beer', 'wine', 'kombucha', 'energy drink', 'lemonade', 'smoothie', 'coconut water',
    'tonic', 'espresso', 'latte', 'chai', 'cider'
  ],
  snacks: [
    'chip', 'chips', 'tortilla chips', 'potato chips', 'cracker', 'crackers', 'popcorn',
    'nuts', 'almonds', 'cashews', 'peanuts', 'walnuts', 'chocolate', 'candy', 'gummies',
    'granola bar', 'protein bar', 'pretzel', 'pretzels', 'trail mix', 'salsa', 'dip',
    'hummus', 'wafers', 'snack'
  ],
  household: [
    'soap', 'dish soap', 'hand soap', 'body wash', 'shampoo', 'conditioner',
    'toothpaste', 'toothbrush', 'detergent', 'laundry detergent', 'paper towel',
    'paper towels', 'toilet paper', 'tissue', 'tissues', 'trash bags', 'sponge',
    'sponges', 'cleaner', 'spray cleaner', 'bleach', 'foil', 'aluminum foil',
    'ziploc', 'baggies', 'shaving cream', 'deodorant', 'lotion', 'battery', 'batteries'
  ],
  other: [],
};

// Flatten and sort keywords by length descending so longest/most specific phrases match first
const SORTED_KEYWORD_PAIRS: { keyword: string; categoryId: CategoryId }[] = [];
for (const [categoryId, keywords] of Object.entries(CATEGORY_KEYWORDS) as [CategoryId, string[]][]) {
  for (const keyword of keywords) {
    SORTED_KEYWORD_PAIRS.push({ keyword, categoryId });
  }
}
SORTED_KEYWORD_PAIRS.sort((a, b) => b.keyword.length - a.keyword.length);

/**
 * Automatically categorizes an item by its name and modifiers.
 */
export function categorizeItem(itemName: string): CategoryId {
  if (!itemName) return 'other';

  const normalized = itemName.toLowerCase().trim();

  // 1. Longest specific keyword match first
  for (const { keyword, categoryId } of SORTED_KEYWORD_PAIRS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(normalized)) {
      return categoryId;
    }
  }

  // 2. Secondary fuzzy heuristics
  if (/(drink|juice|water|tea|coffee|brew|beverage|soda)/i.test(normalized)) return 'beverages';
  if (/(fruit|berry|veg|greens|leaf|herb|organic fresh)/i.test(normalized)) return 'produce';
  if (/(milk|cheese|curd|dairy|yogurt)/i.test(normalized)) return 'dairy';
  if (/(bread|bake|pastry|cake|dough)/i.test(normalized)) return 'bakery';
  if (/(meat|steak|fish|seafood|poultry)/i.test(normalized)) return 'meat';
  if (/(clean|soap|wash|paper|towel|hygiene)/i.test(normalized)) return 'household';
  if (/(snack|sweet|crisp|bar|choco)/i.test(normalized)) return 'snacks';
  if (/(sauce|spice|oil|grain|rice|flour|bean|can)/i.test(normalized)) return 'pantry';

  return 'other';
}

