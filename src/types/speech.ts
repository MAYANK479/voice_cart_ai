import { CategoryId } from './shopping';

export type SpeechStatus = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export type SupportedLanguage = 'en-US' | 'en-GB' | 'en-IN' | 'es-ES' | 'fr-FR' | 'de-DE' | 'hi-IN';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export type IntentType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'MODIFY_QUANTITY'
  | 'CLEAR_COMPLETED'
  | 'CLEAR_ALL'
  | 'TOGGLE_ITEM'
  | 'SEARCH_CATALOG'
  | 'FILTER_PRICE'
  | 'GET_SUGGESTIONS'
  | 'GET_SUBSTITUTE'
  | 'GET_SEASONAL'
  | 'CHECKOUT'
  | 'HELP'
  | 'UNKNOWN';


export interface ParsedItemEntity {
  name: string;
  quantity: number;
  unit: string;
  category: CategoryId;
  brand?: string;
  size?: string;
  attributes?: string[];
  maxPrice?: number;
  minPrice?: number;
  targetList?: string;
}

export interface ParsedCommand {
  rawTranscript: string;
  normalizedTranscript: string;
  intent: IntentType;
  confidence: number;
  language: SupportedLanguage;
  items: ParsedItemEntity[];
  targetList?: string;
  filterCriteria?: {
    query?: string;
    brand?: string;
    size?: string;
    maxPrice?: number;
    minPrice?: number;
    category?: CategoryId;
    dietaryTag?: string;
  };
  targetItemName?: string;
  feedbackMessage: string;
  suggestedAction?: 'ADD' | 'REMOVE' | 'MODIFY' | 'SEARCH' | 'SUBSTITUTE' | 'SEASONAL' | 'RESTOCK' | 'CHECKOUT';

}


export interface SpeechRecognitionResultState {
  transcript: string;
  interimTranscript: string;
  isFinal: boolean;
  confidence: number;
}

export interface CommandLogEntry {
  id: string;
  timestamp: string;
  command: string;
  intent: IntentType;
  actionName: string;
  resultMessage: string;
  confidence: number;
  source: 'voice' | 'text' | 'demo';
  success: boolean;
  itemCount?: number;
}

