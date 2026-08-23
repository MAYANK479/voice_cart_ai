import React, { useMemo, useState } from 'react';
import { Sparkles, Mic, MicOff, Send, Loader2 } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { NlpInterpretationCard } from './NlpInterpretationCard';

export const VoiceAssistantHero: React.FC = () => {
  const {
    speechStatus,
    isListening,
    interimTranscript,
    startVoiceListening,
    stopVoiceListening,
    processTextInputCommand,
  } = useShopping();


  const [inputVal, setInputVal] = useState('');

  // Dynamic time greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    processTextInputCommand(inputVal, 'text');
    setInputVal('');
  };

  const demoChips = [
    { label: 'Add 2 bottles organic milk', cmd: 'Add 2 bottles of organic milk', icon: '🥛' },
    { label: 'Buy 5 apples', cmd: 'Buy 5 apples', icon: '🍎' },
    { label: 'Remove bread', cmd: 'Remove bread', icon: '🗑️' },
    { label: 'What should I restock?', cmd: 'What should I restock?', icon: '📦' },
    { label: 'Find toothpaste < $5', cmd: 'Find toothpaste under $5', icon: '🔍' },
    { label: 'Substitute for butter', cmd: 'Suggest a substitute for butter', icon: '🧈' },
  ];

  return (
    <section className="glass-panel hero-command-deck" aria-label="AI Voice Command Center">
      {/* Softly Floating Ambient Blobs */}
      <div className="hero-floating-blobs" aria-hidden="true">
        <div className="hero-blob blob-1" />
        <div className="hero-blob blob-2" />
      </div>

      {/* Top Banner: Greeting & Voice Assistant Orb */}
      <div className="deck-top-row" style={{ position: 'relative', zIndex: 1 }}>

        <div className="deck-title-area">
          <div className="deck-greeting-badge">
            <span className="deck-glow-dot" />
            <span>{greeting}, Mayank 👋</span>
            <span className="deck-divider">•</span>
            <span className="deck-tagline">Your shopping, just one conversation away.</span>
          </div>
          <h2 className="deck-headline">What would you like to buy?</h2>
          <p className="deck-subtext">Speak naturally in English, Hindi, Spanish, French, or German. I'll organize the rest.</p>
        </div>

        {/* Central Voice Assistant Orb Button */}
        <button
          type="button"
          className={`deck-orb-pill ${isListening ? 'listening' : speechStatus === 'processing' ? 'processing' : speechStatus === 'error' ? 'error' : ''}`}
          onClick={handleToggleListening}
          title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
          aria-label={isListening ? 'Stop voice command' : 'Start voice command'}
        >
          <div className="orb-pill-icon">
            {isListening ? (
              <span className="live-sound-bars">
                <span className="bar bar-1" />
                <span className="bar bar-2" />
                <span className="bar bar-3" />
                <span className="bar bar-4" />
              </span>
            ) : speechStatus === 'processing' ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Mic size={16} />
            )}
          </div>
          <span className="orb-pill-label">
            {isListening
              ? 'Listening...'
              : speechStatus === 'processing'
              ? 'Understanding...'
              : speechStatus === 'error'
              ? 'Try again'
              : '● Tap to speak'}
          </span>
        </button>
      </div>

      {/* Main Unified Input Box */}
      <form className="deck-input-box" onSubmit={handleFormSubmit}>
        <button
          type="button"
          className={`deck-mic-btn ${isListening ? 'active' : ''}`}
          onClick={handleToggleListening}
          title={isListening ? 'Stop microphone' : 'Start microphone voice input'}
          aria-label="Start voice command"
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          className="deck-input-field"
          placeholder="Speak or type: 'Add 2 bottles of organic milk', 'Find toothpaste under $5', 'What should I restock?'..."
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />

        <button type="submit" className="deck-send-btn" disabled={!inputVal.trim()} title="Execute Command">
          <span>Run</span>
          <Send size={13} />
        </button>
      </form>

      {/* Live Transcript Strip */}
      {(interimTranscript || isListening) && (
        <div className="deck-transcript-bar">
          <span className="transcript-pulse-dot" />
          <span className="transcript-live-text">
            <strong>YOU SAID:</strong> "{interimTranscript || 'Listening to your voice... Speak now.'}"
          </span>
        </div>
      )}

      {/* Structured NLP Output Card */}
      <NlpInterpretationCard />

      {/* Quick Demo Prompts */}
      <div className="deck-chips-scroll">
        <span className="deck-chips-label">
          <Sparkles size={13} color="var(--accent-primary)" /> Try saying:
        </span>
        <div className="deck-chips-group">
          {demoChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="deck-chip-btn"
              onClick={() => processTextInputCommand(chip.cmd, 'demo')}
              title={`Run command: "${chip.cmd}"`}
            >
              <span className="chip-icon">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
