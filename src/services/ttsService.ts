import { SupportedLanguage } from '../types/speech';

export class TTSService {
  private enabled: boolean = true;
  private voicePitch: number = 1.0;
  private voiceRate: number = 1.05;
  private currentLanguage: SupportedLanguage = 'en-US';

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

  public speak(text: string, onEnd?: () => void) {
    if (!this.enabled || !this.isSupported() || !text) {
      onEnd?.();
      return;
    }

    try {
      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = this.voiceRate;
      utterance.pitch = this.voicePitch;
      utterance.lang = this.currentLanguage;

      // Match natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const matchingVoice = voices.find((v) => v.lang.startsWith(this.currentLanguage.slice(0, 2)));
      if (matchingVoice) {
        utterance.voice = matchingVoice;
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
