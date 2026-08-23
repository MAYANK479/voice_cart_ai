import { SupportedLanguage } from '../types/speech';

export class TTSService {
  private enabled: boolean = false; // Default to silent
  private voicePitch: number = 1.08; // Slightly elevated for a warm, friendly, pleasant tone

  private voiceRate: number = 1.0;   // Natural conversational cadence
  private currentLanguage: SupportedLanguage = 'en-US';
  private cachedVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.cachedVoices = window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.cachedVoices = window.speechSynthesis.getVoices();
      };
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled && this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  public getEnabled(): boolean {
    return this.enabled;
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
  }

  /**
   * Selects a pleasant, high-quality female voice across macOS/iOS, Chrome, Edge, and Android.
   */
  private selectPleasantFemaleVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (!this.isSupported()) return null;
    const voices = this.cachedVoices.length > 0 ? this.cachedVoices : window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return null;

    const langPrefix = lang.slice(0, 2).toLowerCase();
    const langMatching = voices.filter((v) => v.lang.toLowerCase().startsWith(langPrefix));

    // Priority list of pleasant female voice names
    const preferredFemaleNames = [
      /siri/i,
      /samantha/i,
      /karen/i,
      /victoria/i,
      /ava/i,
      /zoe/i,
      /serena/i,
      /jenny/i,
      /aria/i,
      /google.*female/i,
      /google us english/i,
      /google uk english female/i,
      /zira/i,
      /moira/i,
      /tessa/i,
      /kate/i,
      /female/i,
      /natural/i,
    ];

    // 1. Check for preferred pleasant female voice matching language
    for (const pattern of preferredFemaleNames) {
      const match = langMatching.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    // 2. Fallback to any voice matching language
    if (langMatching.length > 0) {
      return langMatching[0];
    }

    // 3. Fallback to any female voice in general
    for (const pattern of preferredFemaleNames) {
      const match = voices.find((v) => pattern.test(v.name));
      if (match) return match;
    }

    return voices[0] || null;
  }

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || !this.isSupported() || !text) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any overlapping speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.voiceRate;
      utterance.pitch = this.voicePitch;
      utterance.lang = this.currentLanguage;

      const pleasantVoice = this.selectPleasantFemaleVoice(this.currentLanguage);
      if (pleasantVoice) {
        utterance.voice = pleasantVoice;
      }

      utterance.onend = () => {
        onEnd?.();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis error:', e);
        onEnd?.();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('TTS playback error:', e);
      onEnd?.();
    }
  }

  public stop() {
    if (this.isSupported()) {
      window.speechSynthesis.cancel();
    }
  }
}

export const ttsService = new TTSService();

