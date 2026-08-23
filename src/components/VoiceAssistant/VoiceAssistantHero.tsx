import React, { useMemo } from 'react';
import { Sparkles, X, Plus } from 'lucide-react';
import { VoiceOrb } from './VoiceOrb';
import { LiveTranscript } from './LiveTranscript';
import { QuickVoicePills } from './QuickVoicePills';
import { TextFallbackBar } from './TextFallbackBar';
import { NlpInterpretationCard } from './NlpInterpretationCard';
import { useShopping } from '../../context/ShoppingContext';

export const VoiceAssistantHero: React.FC = () => {
  const { activePairing, dismissPairing, acceptPairing } = useShopping();

  // Dynamic time greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <section className="glass-panel hero-voice-section" aria-label="Voice Assistant Center">
      {/* Title & Tagline Header */}
      <div className="hero-header-text">
        <div className="hero-greeting">
          {greeting} <span className="greeting-wave">👋</span>
        </div>
        <h2 className="hero-headline">Build your shopping list naturally.</h2>
        <p className="hero-tagline">"Talk to your shopping list."</p>
      </div>

      {/* Voice Orb Interaction */}
      <VoiceOrb />

      {/* Live Transcript Display */}
      <LiveTranscript />

      {/* Structured NLP Output Card */}
      <NlpInterpretationCard />

      {/* Demo Quick Command Chips */}
      <QuickVoicePills />

      {/* Text Input Fallback Bar */}
      <TextFallbackBar />

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

