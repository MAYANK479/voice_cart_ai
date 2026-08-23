import { ParsedCommand, SupportedLanguage } from '../types/speech';
import { CategoryId } from '../types/shopping';
import { categorizeItem } from './categorizer';


/**
 * Interface for free-tier LLM parser requests
 */
export interface LLMParseRequest {
  transcript: string;
  language: SupportedLanguage;
  apiKey?: string;
  provider?: 'gemini' | 'groq' | 'custom' | 'simulation';
}

/**
 * Free-Tier LLM Fallback Service
 * 
 * Used when the deterministic rule-based parser confidence is below threshold (< 0.70),
 * or directly inside the NLP Playground Lab to compare Rule-Based vs LLM parsing.
 * 
 * Supports free-tier Gemini / Groq API or zero-config smart AI heuristics.
 */
export class LLMFallbackService {
  private static userApiKey: string = '';

  public static setApiKey(key: string) {
    this.userApiKey = key;
    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('voicecart_llm_api_key', key);
      } catch (e) {
        console.warn('Could not persist API key', e);
      }
    }
  }

  public static getApiKey(): string {
    if (this.userApiKey) return this.userApiKey;
    if (typeof localStorage !== 'undefined') {
      try {
        return localStorage.getItem('voicecart_llm_api_key') || '';
      } catch {
        return '';
      }
    }
    return '';
  }

  /**
   * Parses complex or ambiguous voice input using an LLM or enhanced semantic heuristic
   */
  public static async parseWithLLM(
    transcript: string,
    language: SupportedLanguage = 'en-US'
  ): Promise<ParsedCommand> {
    const key = this.getApiKey();

    // If a real Gemini free-tier key is configured, call the Google Generative Language API
    if (key && key.startsWith('AIza')) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are an AI grocery assistant parser. Extract the structured intent and entities from the following voice command: "${transcript}" in language "${language}".
Respond ONLY with a valid JSON object matching this schema:
{
  "intent": "ADD_ITEM" | "REMOVE_ITEM" | "MODIFY_QUANTITY" | "SEARCH_CATALOG" | "GET_SUGGESTIONS" | "GET_SUBSTITUTE" | "CHECKOUT" | "HELP" | "UNKNOWN",
  "confidence": number between 0.8 and 0.99,
  "items": [
    { "name": string, "quantity": number, "unit": string, "category": "produce"|"dairy"|"bakery"|"meat"|"pantry"|"beverages"|"snacks"|"household"|"other", "attributes": string[] }
  ],
  "targetItemName": string or null,
  "targetList": string or null,
  "feedbackMessage": string
}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
          const cleanedJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanedJson);

          return {
            rawTranscript: transcript,
            normalizedTranscript: transcript.trim().toLowerCase(),
            intent: parsed.intent || 'ADD_ITEM',
            confidence: parsed.confidence || 0.95,
            language,
            items: (parsed.items || []).map((i: any) => ({
              name: i.name,
              quantity: i.quantity || 1,
              unit: i.unit || 'item',
              category: i.category || categorizeItem(i.name),
              attributes: i.attributes || [],
            })),
            targetItemName: parsed.targetItemName,
            targetList: parsed.targetList,
            feedbackMessage: parsed.feedbackMessage || `Processed with Gemini AI: ${transcript}`,
            suggestedAction: parsed.intent === 'ADD_ITEM' ? 'ADD' : undefined,
          };
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to local semantic parser', err);
      }
    }

    // Zero-config intelligent semantic fallback for complex / multi-entity queries
    return this.fallbackSemanticParser(transcript, language);
  }

  /**
   * Enhanced offline semantic parsing for complex natural phrasing
   */
  private static fallbackSemanticParser(transcript: string, language: SupportedLanguage): ParsedCommand {
    const text = transcript.toLowerCase().trim();

    // 1. Budget queries: "How much money do I have left in my budget?"
    if (text.includes('budget') || text.includes('how much money') || text.includes('spending left')) {
      return {
        rawTranscript: transcript,
        normalizedTranscript: text,
        intent: 'GET_SUGGESTIONS',
        confidence: 0.88,
        language,
        items: [],
        feedbackMessage: 'Checking your current grocery budget allocations.',
      };
    }

    // 2. Removal queries: "Please remove the 2 bottles of whole milk from my cart"
    if (text.startsWith('remove') || text.startsWith('please remove') || text.includes('delete') || text.includes('take off')) {
      const cleaned = text.replace(/^(please\s+)?(remove|delete|take\s+off|drop)\s+/i, '').replace(/\s+(from|out\s+of)\s+my\s+(cart|list)/i, '');
      const itemName = cleaned.replace(/^\d+\s+(bottles?|packs?|items?|lbs?|kg)?\s+(of\s+)?/i, '').trim();
      return {
        rawTranscript: transcript,
        normalizedTranscript: text,
        intent: 'REMOVE_ITEM',
        confidence: 0.85,
        language,
        items: [{
          name: itemName || 'item',
          quantity: 1,
          unit: 'item',
          category: categorizeItem(itemName),
          attributes: [],
        }],
        targetItemName: itemName,
        feedbackMessage: `Removing ${itemName} from your list.`,
        suggestedAction: 'REMOVE',
      };
    }

    // 3. Search / Price constraints: "Show me organic coffee under $8"
    if (text.includes('under $') || text.includes('less than $') || text.includes('show me') || text.includes('find')) {
      const match = text.match(/\$?(\d+(\.\d+)?)/);
      const price = match ? parseFloat(match[1]) : undefined;
      const term = text.replace(/^(show\s+me|find|search\s+for|look\s+up)\s+/i, '').replace(/\s+(under|less\s+than|below)\s+\$?\d+(\.\d+)?/i, '').trim();

      return {
        rawTranscript: transcript,
        normalizedTranscript: text,
        intent: 'SEARCH_CATALOG',
        confidence: 0.86,
        language,
        items: [{
          name: term || 'product',
          quantity: 1,
          unit: 'item',
          category: categorizeItem(term),
          attributes: price ? [`max:$${price}`] : [],
        }],
        feedbackMessage: `Searching for ${term}${price ? ` under $${price}` : ''}.`,
      };
    }


    // 4. Recipe or ingredient bundle context: e.g. "cook tacos", "strawberry cake", "creamy pasta"
    if (text.includes('taco') || text.includes('cake') || text.includes('smoothie') || text.includes('pasta') || text.includes('salad') || text.includes('burger')) {
      const isTaco = text.includes('taco');
      const isCake = text.includes('cake');
      const isPasta = text.includes('pasta');

      let generatedItems: Array<{ name: string; quantity: number; unit: string; category: CategoryId }> = [
        { name: 'Fresh Strawberries', quantity: 1, unit: 'pack', category: 'produce' },
        { name: 'Organic Whole Milk', quantity: 1, unit: 'bottle', category: 'dairy' },
      ];

      if (isTaco) {
        generatedItems = [
          { name: 'Corn Tortillas', quantity: 1, unit: 'pack', category: 'bakery' },
          { name: 'Ground Beef 85/15', quantity: 1, unit: 'lb', category: 'meat' },
          { name: 'Mild Salsa Roja', quantity: 1, unit: 'jar', category: 'pantry' },
          { name: 'Shredded Mexican Cheese', quantity: 1, unit: 'bag', category: 'dairy' },
          { name: 'Hass Avocados', quantity: 2, unit: 'item', category: 'produce' },
        ];
      } else if (isCake) {
        generatedItems = [
          { name: 'All-Purpose Flour', quantity: 1, unit: 'bag', category: 'pantry' },
          { name: 'Pasture-Raised Eggs', quantity: 12, unit: 'item', category: 'dairy' },
          { name: 'Organic Strawberries', quantity: 2, unit: 'pack', category: 'produce' },
        ];
      } else if (isPasta) {
        generatedItems = [
          { name: 'Organic Penne Pasta', quantity: 2, unit: 'box', category: 'pantry' },
          { name: 'Tomato Basil Sauce', quantity: 1, unit: 'jar', category: 'pantry' },
          { name: 'Parmesan Cheese', quantity: 1, unit: 'tub', category: 'dairy' },
        ];
      }

      return {
        rawTranscript: transcript,
        normalizedTranscript: text,
        intent: 'ADD_ITEM',
        confidence: 0.92,
        language,
        items: generatedItems,
        feedbackMessage: `AI detected recipe bundle intent. Added ${generatedItems.map((i) => i.name).join(', ')} to your cart.`,
        suggestedAction: 'ADD',
      };
    }

    // Default fallback
    return {
      rawTranscript: transcript,
      normalizedTranscript: text,
      intent: 'UNKNOWN',
      confidence: 0.5,
      language,
      items: [],
      feedbackMessage: "Couldn't parse phrase with high confidence. Try 'Add 2 apples' or 'Find milk under $5'.",
    };
  }
}

