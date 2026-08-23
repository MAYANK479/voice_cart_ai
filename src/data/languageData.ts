import { LanguageOption, SupportedLanguage } from '../types/speech';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    code: 'en-US',
    name: 'English (US)',
    nativeName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'en-IN',
    name: 'English (India)',
    nativeName: 'English (India)',
    flag: '🇮🇳',
  },
  {
    code: 'es-ES',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'fr-FR',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
  },
  {
    code: 'de-DE',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
  },
  {
    code: 'hi-IN',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
  },
];

export interface LanguageExamplePrompts {
  language: SupportedLanguage;
  addSample: string;
  removeSample: string;
  searchSample: string;
  substituteSample: string;
  seasonalSample: string;
}

export const LANGUAGE_EXAMPLE_PROMPTS: Record<SupportedLanguage, LanguageExamplePrompts> = {
  'en-US': {
    language: 'en-US',
    addSample: 'Add 2 bottles of organic milk',
    removeSample: 'Remove bread from my list',
    searchSample: 'Find apples under $5',
    substituteSample: 'Suggest a substitute for butter',
    seasonalSample: 'What is in season today?',
  },
  'en-GB': {
    language: 'en-GB',
    addSample: 'Add 2 pints of organic milk',
    removeSample: 'Remove sourdough bread from my list',
    searchSample: 'Find apples under 5 pounds',
    substituteSample: 'Suggest an alternative to butter',
    seasonalSample: 'What produce is in season?',
  },
  'en-IN': {

    language: 'en-IN',
    addSample: 'Add 1 kg basmati rice and 2 packs of eggs',
    removeSample: 'Remove coffee from my cart',
    searchSample: 'Find snacks under 5 dollars',
    substituteSample: 'What can I use instead of sugar?',
    seasonalSample: 'Show me seasonal fruits',
  },
  'es-ES': {
    language: 'es-ES',
    addSample: 'Añadir 2 botellas de leche orgánica',
    removeSample: 'Eliminar el pan de mi lista',
    searchSample: 'Buscar manzanas de menos de 5 dólares',
    substituteSample: 'Sustituto de la mantequilla',
    seasonalSample: '¿Qué hay de temporada?',
  },
  'fr-FR': {
    language: 'fr-FR',
    addSample: 'Ajouter 2 bouteilles de lait bio',
    removeSample: 'Supprimer le pain de ma liste',
    searchSample: 'Trouver des pommes à moins de 5 dollars',
    substituteSample: 'Remplacer le beurre',
    seasonalSample: 'Quels sont les fruits de saison?',
  },
  'de-DE': {
    language: 'de-DE',
    addSample: 'Füge 2 Flaschen Biomilch hinzu',
    removeSample: 'Entferne Brot von meiner Liste',
    searchSample: 'Finde Äpfel unter 5 Dollar',
    substituteSample: 'Alternative für Butter',
    seasonalSample: 'Was hat gerade Saison?',
  },
  'hi-IN': {
    language: 'hi-IN',
    addSample: 'दो पैकेट दूध जोड़ें (Add 2 packets milk)',
    removeSample: 'ब्रेड हटाओ (Remove bread)',
    searchSample: 'सेब खोजें (Find apples under $5)',
    substituteSample: 'दूध का विकल्प (Substitute for milk)',
    seasonalSample: 'मौसमी फल दिखाओ (Seasonal items)',
  },
};
