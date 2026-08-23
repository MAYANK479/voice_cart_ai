import { describe, it, expect } from 'vitest';
import { LLMFallbackService } from '../services/llmFallback';

describe('LLM Fallback & Semantic Recipe Parsing Service', () => {
  it('extracts taco ingredients from natural language prompt', async () => {
    const result = await LLMFallbackService.parseWithLLM('I want to cook tacos tonight for 4 people');
    expect(result.intent).toBe('ADD_ITEM');
    expect(result.items.length).toBeGreaterThan(0);
    const itemNames = result.items.map((i) => i.name.toLowerCase());
    expect(itemNames.some((n) => n.includes('tortilla') || n.includes('beef') || n.includes('salsa') || n.includes('cheese') || n.includes('taco'))).toBe(true);
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('extracts pasta ingredients from recipe phrase', async () => {
    const result = await LLMFallbackService.parseWithLLM('Let us make creamy pasta');
    expect(result.intent).toBe('ADD_ITEM');
    const itemNames = result.items.map((i) => i.name.toLowerCase());
    expect(itemNames.some((n) => n.includes('pasta') || n.includes('parmesan') || n.includes('cream') || n.includes('sauce') || n.includes('garlic'))).toBe(true);
  });

  it('correctly identifies budget queries in natural phrasing', async () => {
    const result = await LLMFallbackService.parseWithLLM('How much money do I have left in my budget?');
    expect(result.intent).toBe('GET_SUGGESTIONS');
    expect(result.confidence).toBeGreaterThanOrEqual(0.7);
  });

  it('identifies price check constraints', async () => {
    const result = await LLMFallbackService.parseWithLLM('Show me organic coffee under $8');
    expect(result.intent).toBe('SEARCH_CATALOG');
    expect(result.items[0].name.toLowerCase()).toContain('coffee');
  });


  it('identifies item removal commands', async () => {
    const result = await LLMFallbackService.parseWithLLM('Please remove the 2 bottles of whole milk from my cart');
    expect(result.intent).toBe('REMOVE_ITEM');
    expect(result.items[0].name.toLowerCase()).toContain('milk');
  });
});

