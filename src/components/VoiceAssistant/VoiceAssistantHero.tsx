import React, { useMemo, useState } from 'react';
import { Sparkles, X, Plus, Mic, MicOff, Send, Loader2 } from 'lucide-react';
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
    activePairing,
    dismissPairing,
    acceptPairing,
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
    { label: '2 Bottles Organic Milk', cmd: 'Add 2 bottles of organic milk', icon: '🥛' },
    { label: '5 Apples', cmd: 'Add 5 apples', icon: '🍎' },
    { label: 'Remove Milk', cmd: 'Remove milk', icon: '🗑️' },
    { label: 'Toothpaste < $5', cmd: 'Find toothpaste under $5', icon: '🔍' },
    { label: 'Restock Staples', cmd: 'What should I restock?', icon: '📦' },
    { label: 'Butter Substitute', cmd: 'Suggest a substitute for butter', icon: '🧈' },
    { label: 'Seasonal Deals', cmd: 'What is in season today?', icon: '🌱' },
  ];

  return (
    <section className="glass-panel hero-command-deck" aria-label="AI Voice Command Deck">
      {/* Top Banner: Greeting & Live Orb Capsule */}
      <div className="deck-top-row">
        <div className="deck-title-area">
          <div className="deck-greeting-badge">
            <span className="deck-glow-dot" />
            <span>{greeting}</span>
            <span className="deck-divider">•</span>
            <span className="deck-tagline">AI Voice Assistant</span>
          </div>
          <h2 className="deck-headline">What would you like to add today?</h2>
        </div>

        {/* Live Audio Capsule Button */}
        <button
          type="button"
          className={`deck-orb-pill ${isListening ? 'listening' : speechStatus === 'processing' ? 'processing' : ''}`}
          onClick={handleToggleListening}
          title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
          aria-label={isListening ? 'Stop listening' : 'Start voice command'}
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
            {isListening ? 'Listening...' : speechStatus === 'processing' ? 'Analyzing...' : 'Tap to Speak'}
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
          aria-label={isListening ? 'Stop microphone' : 'Start microphone'}
        >
          {isListening ? <MicOff size={18} /> : <Mic size={18} />}
        </button>

        <input
          type="text"
          className="deck-input-field"
          placeholder="Speak or type: 'Add 2 bottles of milk', 'Find snacks under $5', 'What should I restock?'..."
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
            {interimTranscript || 'Listening to your voice... Speak now.'}
          </span>
        </div>
      )}

      {/* Structured NLP Output Card */}
      <NlpInterpretationCard />

      {/* Quick Demo Chips Strip */}
      <div className="deck-chips-scroll">
        <span className="deck-chips-label">
          <Sparkles size={13} color="#fbbf24" /> Quick Prompts:
        </span>
        <div className="deck-chips-group">
          {demoChips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="deck-chip-btn"
              onClick={() => processTextInputCommand(chip.cmd, 'demo')}
              title={`Run: "${chip.cmd}"`}
            >
              <span className="chip-icon">{chip.icon}</span>
              <span>{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Companion Item Pairing Suggestion Banner */}
      {activePairing && (
        <div className="pairing-banner" role="alert">
          <div className="pairing-info">
            <div className="pairing-icon-box">
              <Sparkles size={18} />
            </div>
            <div>
              <div className="pairing-title">
                Smart Companion Pairing: <strong>{activePairing.suggestedItem}</strong> (${activePairing.price.toFixed(2)})
              </div>
              <div className="pairing-desc">{activePairing.reason}</div>
            </div>
          </div>

          <div className="pairing-actions">
            <button
              className="btn-accept-pair"
              onClick={() => acceptPairing(activePairing)}
            >
              <Plus size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Add to List
            </button>
            <button
              className="btn-icon"
              style={{ width: '30px', height: '30px' }}
              onClick={dismissPairing}
              title="Dismiss suggestion"
              aria-label="Dismiss companion recommendation"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};


