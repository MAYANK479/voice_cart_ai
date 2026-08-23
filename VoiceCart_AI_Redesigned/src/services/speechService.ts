import { SupportedLanguage } from '../types/speech';

// Type declaration for browser SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface WebkitSpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onstart: ((this: WebkitSpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: WebkitSpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: WebkitSpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: WebkitSpeechRecognition, ev: Event) => any) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: {
      new (): WebkitSpeechRecognition;
    };
    webkitSpeechRecognition?: {
      new (): WebkitSpeechRecognition;
    };
  }
}

export class SpeechService {
  private recognition: WebkitSpeechRecognition | null = null;
  private isListening = false;
  private currentLanguage: SupportedLanguage = 'en-US';

  public onTranscriptCallback?: (transcript: string, isFinal: boolean, confidence: number) => void;
  public onStatusChangeCallback?: (status: 'idle' | 'listening' | 'processing' | 'error') => void;
  public onErrorCallback?: (errorMsg: string) => void;

  constructor() {
    this.initRecognition();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
  }

  private initRecognition() {
    if (!this.isSupported()) {
      return;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      this.recognition = new SpeechRecognitionClass();
      this.recognition.continuous = false; // Turn-based commands
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
      this.recognition.maxAlternatives = 1;

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStatusChangeCallback?.('listening');
      };

      this.recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';
        let confidence = 0.9;

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          if (res.isFinal) {
            final += res[0].transcript;
            confidence = res[0].confidence || 0.9;
          } else {
            interim += res[0].transcript;
          }
        }

        if (final) {
          this.onStatusChangeCallback?.('processing');
          this.onTranscriptCallback?.(final.trim(), true, confidence);
        } else if (interim) {
          this.onTranscriptCallback?.(interim.trim(), false, 0.7);
        }
      };

      this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech Recognition error:', event.error);
        this.isListening = false;
        this.onStatusChangeCallback?.('error');

        let msg = 'Microphone error occurred.';
        if (event.error === 'not-allowed') {
          msg = 'Microphone permission denied. Please allow microphone access in your browser.';
        } else if (event.error === 'no-speech') {
          msg = 'No speech detected. Please speak into your microphone.';
        } else if (event.error === 'network') {
          msg = 'Network connection issue with speech service.';
        }
        this.onErrorCallback?.(msg);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStatusChangeCallback?.('idle');
      };
    }
  }

  public setLanguage(lang: SupportedLanguage) {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public startListening() {
    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      this.onErrorCallback?.('Web Speech API is not supported in this browser. Please use Google Chrome or Edge.');
      return;
    }

    try {
      this.recognition.abort(); // reset if running
      this.recognition.lang = this.currentLanguage;
      this.recognition.start();
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
    }
  }

  public stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (err) {
        // ignore
      }
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
