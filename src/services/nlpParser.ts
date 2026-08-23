import { ParsedCommand, ParsedItemEntity, SupportedLanguage } from '../types/speech';
import { categorizeItem } from './categorizer';


// Word to number conversion dictionary
const NUMBER_WORDS: Record<string, number> = {
  a: 1,
  an: 1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
  dozen: 12,
  'half a dozen': 6,
  'half dozen': 6,
  twenty: 20,
  // Hindi number words
  एक: 1,
  दो: 2,
  तीन: 3,
  चार: 4,
  पांच: 5,
  छह: 6,
  // Spanish number words
  un: 1,
  una: 1,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  // French number words
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  // German number words
  ein: 1,
  eine: 1,
  einen: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
};

// Recognized Units
const COMMON_UNITS = [
  'bottle', 'bottles', 'carton', 'cartons', 'pack', 'packs', 'packet', 'packets',
  'box', 'boxes', 'bag', 'bags', 'bunch', 'bunches', 'loaf', 'loaves',
  'can', 'cans', 'jar', 'jars', 'tub', 'tubs', 'lb', 'lbs', 'pound', 'pounds',
  'kg', 'kgs', 'kilo', 'kilos', 'gram', 'grams', 'g', 'oz', 'ounce', 'ounces',
  'gallon', 'gallons', 'liter', 'liters', 'l', 'ml', 'roll', 'rolls', 'tube', 'tubes',
  'piece', 'pieces', 'bar', 'bars', 'buns', 'clamshell',
  // Multilingual units
  'botella', 'botellas', 'paquete', 'paquetes', 'bolsa', 'bolsas', 'litro', 'litros',
  'bouteille', 'bouteilles', 'paquet', 'paquets', 'litre', 'litres',
  'flasche', 'flaschen', 'packung', 'packungen',
  'पैकेट', 'किलो', 'लीटर', 'बोतल'
];

/**
 * Standardize unit names to singular clean labels
 */
function normalizeUnit(unit: string): string {
  const u = unit.toLowerCase();
  if (['bottles', 'botellas', 'bouteilles', 'flaschen', 'बोतल'].includes(u)) return 'bottle';
  if (['cartons', 'carton'].includes(u)) return 'carton';
  if (['packs', 'packets', 'paquetes', 'paquets', 'packungen', 'पैकेट', 'packet'].includes(u)) return 'pack';
  if (['boxes', 'box'].includes(u)) return 'box';
  if (['bags', 'bolsas', 'bag'].includes(u)) return 'bag';
  if (['bunches', 'bunch'].includes(u)) return 'bunch';
  if (['loaves', 'loaf'].includes(u)) return 'loaf';
  if (['cans', 'can'].includes(u)) return 'can';
  if (['jars', 'jar'].includes(u)) return 'jar';
  if (['tubs', 'tub'].includes(u)) return 'tub';
  if (['lbs', 'pounds', 'pound'].includes(u)) return 'lb';
  if (['kgs', 'kilos', 'kilo', 'किलो'].includes(u)) return 'kg';
  if (['grams', 'g', 'gram'].includes(u)) return 'g';
  if (['liters', 'litres', 'litros', 'लीटर', 'l'].includes(u)) return 'liter';
  if (['gallons', 'gallon'].includes(u)) return 'gallon';
  if (['rolls', 'roll'].includes(u)) return 'roll';
  if (['tubes', 'tube'].includes(u)) return 'tube';
  return u || 'item';
}

/**
 * Parses individual item string into entity structure (Quantity, Unit, Name, Category, Attributes)
 */
export function parseSingleItemString(itemStr: string): ParsedItemEntity {
  let text = itemStr.trim();
  let quantity = 1;
  let unit = 'item';
  const attributes: string[] = [];

  // Extract dietary/quality attributes
  const attrRegexes = [
    { tag: 'Organic', regex: /\b(organic|orgánico|orgánica|organico|organica|bio|biologique)\b/i },
    { tag: 'Gluten-Free', regex: /\b(gluten[\s-]?free|sin gluten|sans gluten|glutenfrei)\b/i },
    { tag: 'Vegan', regex: /\b(vegan|vegano|vegana|végétalien|végétalienne)\b/i },
    { tag: 'Sugar-Free', regex: /\b(sugar[\s-]?free|sin azucar|sans sucre|zuckerfrei)\b/i },
    { tag: 'Keto', regex: /\b(keto|ketogenic)\b/i },
    { tag: 'Dairy-Free', regex: /\b(dairy[\s-]?free|sin lactosa|sans lactose|laktosefrei)\b/i },
    { tag: 'Low-Fat', regex: /\b(low[\s-]?fat|desnatada|écrémé|fettarm)\b/i },
  ];


  for (const { tag, regex } of attrRegexes) {
    if (regex.test(text)) {
      attributes.push(tag);
    }
  }

  // Look for numeric quantity: e.g. "2.5", "3", "1/2", or word "two", "half a dozen"
  // Check half dozen first
  if (/half\s+a?\s*dozen/i.test(text)) {
    quantity = 6;
    text = text.replace(/half\s+a?\s*dozen/i, '').trim();
  } else if (/dozen/i.test(text)) {
    quantity = 12;
    text = text.replace(/\bdozen\b/i, '').trim();
  } else {
    // Check leading digits
    const digitMatch = text.match(/^(\d+(\.\d+)?)\s*/i);
    if (digitMatch) {
      quantity = parseFloat(digitMatch[1]);
      text = text.replace(digitMatch[0], '').trim();
    } else {
      // Check number words
      for (const [word, val] of Object.entries(NUMBER_WORDS)) {
        const wordRegex = new RegExp(`^${word}(\\s+|$)`, 'i');
        if (wordRegex.test(text)) {
          quantity = val;
          text = text.replace(wordRegex, '').trim();
          break;
        }
      }

    }
  }

  // Look for unit e.g. "bottles of", "kg", "carton of", "loaf of"
  for (const u of COMMON_UNITS) {
    const unitRegex = new RegExp(`^(${u})(\\s+of|\\s+de|\\s+d'|\\s+von)?\\s+`, 'i');
    if (unitRegex.test(text)) {
      unit = normalizeUnit(u);
      text = text.replace(unitRegex, '').trim();
      break;
    }
  }

  // Clean up leftover connectives e.g., "of", "some", "a few", "fresh", etc.
  text = text.replace(/^(of|some|a\s+few|more|extra|fresh|freshly|unos|unas|des|du|einige)\s+/i, '').trim();

  // Strip trailing punctuation
  text = text.replace(/[,.!?]+$/, '').trim();

  // If text is still empty, fallback
  if (!text) {
    text = itemStr;
  }

  const category = categorizeItem(text);

  return {
    name: text,
    quantity: Math.max(1, quantity),
    unit,
    category,
    attributes: attributes.length > 0 ? attributes : undefined,
  };
}

/**
 * Main Natural Language Processing Intent Classifier & Entity Extractor
 */
export function parseVoiceCommand(transcript: string, language: SupportedLanguage = 'en-US'): ParsedCommand {
  const raw = transcript.trim();
  const lower = raw.toLowerCase().trim();

  // Base parsed result template
  const result: ParsedCommand = {
    rawTranscript: raw,
    normalizedTranscript: lower,
    intent: 'UNKNOWN',
    confidence: 0.85,
    language,
    items: [],
    feedbackMessage: '',
  };

  if (!raw) {
    result.feedbackMessage = "I didn't catch that. Please speak or type your command.";
    return result;
  }

  // 1. HELP INTENT
  if (/^(help|what can you do|how does this work|commands|ayuda|aide|hilfe|मदद)$/i.test(lower)) {
    result.intent = 'HELP';
    result.confidence = 0.99;
    result.feedbackMessage = 'You can ask me to add, remove, search items, suggest substitutes, or check seasonal items!';
    return result;
  }

  // 2. CLEAR LIST / CLEAR COMPLETED INTENT
  if (/(clear all|empty list|delete all|clear shopping list|vaciar lista|tout effacer|alles löschen|सब हटाओ)/i.test(lower)) {
    result.intent = 'CLEAR_ALL';
    result.confidence = 0.95;
    result.feedbackMessage = 'Clearing all items from your shopping list.';
    return result;
  }

  if (/(clear completed|remove completed|delete checked|borrar completados|supprimer cochés)/i.test(lower)) {
    result.intent = 'CLEAR_COMPLETED';
    result.confidence = 0.95;
    result.feedbackMessage = 'Clearing all completed items from your list.';
    return result;
  }

  // 3. SEASONAL & ON SALE INTENT
  if (
    /(what('?s| is) in season|seasonal (items|fruits|produce|food|picks)|in season today|on sale|show discounts|de temporada|de saison|saisonal|मौसमी)/i.test(
      lower
    )
  ) {
    result.intent = 'GET_SEASONAL';
    result.confidence = 0.95;
    result.suggestedAction = 'SEASONAL';
    result.feedbackMessage = "Here are today's fresh seasonal harvest picks and on-sale items!";
    return result;
  }

  // 4. RESTOCK / SMART SUGGESTIONS INTENT
  if (
    /(what (should|do) i restock|running low|smart suggestions|what do i need|predict restock|sugerencias|recommandations|empfehlungen|सुझाव)/i.test(
      lower
    )
  ) {
    result.intent = 'GET_SUGGESTIONS';
    result.confidence = 0.95;
    result.suggestedAction = 'RESTOCK';
    result.feedbackMessage = "Analyzing your shopping history for items you're running low on...";
    return result;
  }

  // 5. SUBSTITUTE / ALTERNATIVE INTENT
  const substitutePattern = /(substitute|alternative|instead of|replace|swap|sustituto|reemplazo|remplacer|alternative für|का विकल्प)\s+(?:for\s+|de\s+|pour\s+|für\s+)?([a-z0-9\s]+)/i;
  const subMatch = lower.match(substitutePattern);
  if (subMatch) {
    const target = subMatch[2]?.replace(/(please|pls|item|the)/gi, '').trim();
    result.intent = 'GET_SUBSTITUTE';
    result.confidence = 0.95;
    result.targetItemName = target;
    result.suggestedAction = 'SUBSTITUTE';
    result.feedbackMessage = `Finding smart dietary & healthy substitutes for "${target}"...`;
    return result;
  }

  // 6. SEARCH CATALOG & PRICE FILTER INTENT
  // e.g. "Find me organic apples", "Find Colgate toothpaste under $5", "Search large eggs below 4 dollars"
  const searchPattern = /(find|search|look for|show me|buscar|trouver|suche|खोजें)\s+(.+)/i;
  const searchMatch = lower.match(searchPattern);
  const priceUnderPattern = /(under|below|less than|menos de|moins de|unter|से कम)\s+\$?(\d+(\.\d+)?)\s*(dollars|bucks|usd|\$)?/i;
  const priceBetweenPattern = /between\s+\$?(\d+(\.\d+)?)\s+and\s+\$?(\d+(\.\d+)?)/i;

  if (searchMatch || priceUnderPattern.test(lower)) {
    let query = searchMatch ? searchMatch[2] : lower;
    let maxPrice: number | undefined;
    let minPrice: number | undefined;
    let extractedBrand: string | undefined;
    let extractedSize: string | undefined;

    // Check for between prices
    const betweenMatch = query.match(priceBetweenPattern);
    if (betweenMatch) {
      minPrice = parseFloat(betweenMatch[1]);
      maxPrice = parseFloat(betweenMatch[3]);
      query = query.replace(betweenMatch[0], '').trim();
    } else {
      const priceMatch = query.match(priceUnderPattern);
      if (priceMatch) {
        maxPrice = parseFloat(priceMatch[2]);
        query = query.replace(priceMatch[0], '').trim();
      }
    }

    // Check known brands
    const KNOWN_BRANDS = [
      'colgate', 'crest', 'horizon', 'silk', 'chobani', 'oatly', 'heinz',
      'barilla', 'quaker', 'vital farms', "dave's", 'dawn', 'tide', 'kind',
      'nature valley', 'simple mills', 'lacroix', 'califia', 'beyond'
    ];
    for (const b of KNOWN_BRANDS) {
      const brandRegex = new RegExp(`\\b${b}\\b`, 'i');
      if (brandRegex.test(query)) {
        extractedBrand = b.charAt(0).toUpperCase() + b.slice(1);
        query = query.replace(brandRegex, '').trim();
        break;
      }
    }

    // Check known sizes
    const KNOWN_SIZES = ['family size', 'large', 'small', 'medium', 'gallon', 'half gallon', '16 oz', '32 oz', 'dozen'];
    for (const s of KNOWN_SIZES) {
      const sizeRegex = new RegExp(`\\b${s}\\b`, 'i');
      if (sizeRegex.test(query)) {
        extractedSize = s;
        query = query.replace(sizeRegex, '').trim();
        break;
      }
    }

    // Clean query words
    query = query.replace(/\b(me|items?|products?|for)\b/gi, '').trim();

    result.intent = maxPrice !== undefined ? 'FILTER_PRICE' : 'SEARCH_CATALOG';
    result.confidence = 0.90 + (maxPrice ? 0.04 : 0.02) + (extractedBrand ? 0.03 : 0);
    result.filterCriteria = {
      query: query || undefined,
      brand: extractedBrand,
      size: extractedSize,
      maxPrice,
      minPrice,
    };
    result.suggestedAction = 'SEARCH';
    result.feedbackMessage = maxPrice
      ? `Searching for "${query || 'products'}" with price under $${maxPrice.toFixed(2)}.`
      : `Searching catalog for "${query || 'products'}"...`;
    return result;
  }


  // 7. REMOVE / DELETE ITEM INTENT
  // e.g. "Remove milk from my list", "Delete 100% whole wheat bread", "Drop the toothpaste", "Take off bananas"
  const removePattern = /(remove|delete|drop|take off|get rid of|eliminar|borrar|supprimer|entferne|हटाओ|हटा दें)\s+(.+)/i;
  const removeMatch = lower.match(removePattern);
  if (removeMatch) {
    let target = removeMatch[2];
    // Strip trailing context like "from my list", "from cart", "de mi lista", "de ma liste"
    target = target.replace(/\b(from my list|from the list|from cart|from shopping list|de mi lista|de ma liste|von meiner liste|से)\b/gi, '').trim();
    target = target.replace(/^(the|a|an|el|la|le|die|das)\s+/i, '').trim();

    result.intent = 'REMOVE_ITEM';
    result.confidence = 0.94;
    result.targetItemName = target;
    result.suggestedAction = 'REMOVE';
    result.feedbackMessage = `Removed "${target}" from your shopping list.`;
    return result;
  }

  // 8. MODIFY / UPDATE QUANTITY INTENT
  // e.g. "Change apples quantity to 5", "Update eggs to 12", "Modify water to 4 bottles"
  const modifyPattern = /(change|update|modify|set|cambiar|actualizar|modifier|ändern|बदलें)\s+(.+)\s+(to|a|à|auf|को)\s+(\d+(\.\d+)?|[a-z]+)\s*(.*)/i;
  const modifyMatch = lower.match(modifyPattern);
  if (modifyMatch) {
    const itemName = modifyMatch[2].replace(/\b(quantity of|quantity|the)\b/gi, '').trim();
    const qtyStr = modifyMatch[4];
    const unitPart = modifyMatch[6]?.trim() || '';

    const qty = NUMBER_WORDS[qtyStr] || parseFloat(qtyStr) || 1;
    const unit = normalizeUnit(unitPart);

    result.intent = 'MODIFY_QUANTITY';
    result.confidence = 0.93;
    result.items = [
      {
        name: itemName,
        quantity: qty,
        unit: unit || 'item',
        category: categorizeItem(itemName),
      },
    ];
    result.targetItemName = itemName;
    result.suggestedAction = 'MODIFY';
    result.feedbackMessage = `Updated "${itemName}" quantity to ${qty} ${unit !== 'item' ? unit : ''}.`;
    return result;
  }

  // 9. ADD ITEM INTENT (Handles "Add X", "I need X", "I want to buy X", "Put X on my list", and chained "X and Y")
  // e.g. "Add 2 bottles of milk and 1 loaf of sourdough bread"
  const addLeadPattern = /^(please\s+)?(add|i need|i want to buy|i want|buy|put|get me|please add|añadir|agregar|comprar|necesito|ajouter|j'ai besoin de|achetez|füge|ich brauche|kauf)\s+/i;
  const addTrailPattern = /\s+(जोड़ें|खरीदना है|डालें|add kar do|daalo|चाहिए)$/i;

  const hasExplicitAdd = addLeadPattern.test(lower) || addTrailPattern.test(lower);
  let itemsContent = lower;

  if (addLeadPattern.test(itemsContent)) {
    itemsContent = itemsContent.replace(addLeadPattern, '');
  }
  if (addTrailPattern.test(itemsContent)) {
    itemsContent = itemsContent.replace(addTrailPattern, '');
  }

  // Strip trailing "to my list", "to the shopping list", "in my cart"
  itemsContent = itemsContent
    .replace(/\b(to my list|to the list|to my shopping list|in my cart|on my list|a mi lista|à ma liste|zu meiner liste|लिस्ट में)\b/gi, '')
    .trim();

  // Multi-item splitting: Split on " and ", " y ", " et ", " und ", " तथा ", " और ", or comma ","
  const itemStrings = itemsContent
    .split(/(?:\s+and\s+|\s+y\s+|\s+et\s+|\s+und\s+|\s+और\s+|\s*,\s*)/i)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const parsedItems: ParsedItemEntity[] = [];

  for (const rawItemStr of itemStrings) {
    // If the user said "find toothpaste under $5" inside, avoid treating as ADD
    if (priceUnderPattern.test(rawItemStr)) continue;

    const parsed = parseSingleItemString(rawItemStr);
    if (parsed.name && parsed.name.length > 1) {
      parsedItems.push(parsed);
    }
  }

  // Only proceed with ADD_ITEM if explicit add intent was stated OR items are recognized grocery entities
  const isRecognizedGrocery = parsedItems.some(
    (i) => i.category !== 'other' || i.quantity > 1 || i.unit !== 'item' || (i.attributes && i.attributes.length > 0)
  );

  if (parsedItems.length > 0 && (hasExplicitAdd || isRecognizedGrocery)) {
    result.intent = 'ADD_ITEM';
    let confidenceScore = 0.86;
    if (hasExplicitAdd) confidenceScore += 0.06;
    if (parsedItems.some((i) => i.quantity > 1 || i.unit !== 'item')) confidenceScore += 0.04;
    if (parsedItems.some((i) => i.attributes && i.attributes.length > 0)) confidenceScore += 0.03;
    result.confidence = Math.min(0.98, confidenceScore);
    result.items = parsedItems;
    result.suggestedAction = 'ADD';

    const itemNames = parsedItems.map((i) => `${i.quantity} ${i.unit !== 'item' ? i.unit + ' ' : ''}${i.name}`).join(', ');
    result.feedbackMessage = `Added ${itemNames} to your shopping list.`;
    return result;
  }



  // Fallback: If no explicit action matched, parse as item addition ONLY if recognized as a valid grocery category or item
  const fallbackItem = parseSingleItemString(lower);
  if (fallbackItem.name && fallbackItem.name.length > 1 && fallbackItem.category !== 'other') {
    result.intent = 'ADD_ITEM';
    result.confidence = 0.75;
    result.items = [fallbackItem];
    result.suggestedAction = 'ADD';
    result.feedbackMessage = `Added ${fallbackItem.quantity} ${fallbackItem.unit !== 'item' ? fallbackItem.unit + ' ' : ''}${fallbackItem.name} to your list.`;
    return result;
  }

  result.intent = 'UNKNOWN';
  result.confidence = 0.35;
  result.feedbackMessage = "I didn't understand that command. Try saying 'Add 2 apples' or 'Find milk under $4'.";
  return result;
}

