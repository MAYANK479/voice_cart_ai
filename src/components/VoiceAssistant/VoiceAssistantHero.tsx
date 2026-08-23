import React from 'react';
import { Sparkles, X, Plus } from 'lucide-react';
import { VoiceOrb } from './VoiceOrb';
import { LiveTranscript } from './LiveTranscript';
import { QuickVoicePills } from './QuickVoicePills';
import { TextFallbackBar } from './TextFallbackBar';
import { useShopping } from '../../context/ShoppingContext';

export const VoiceAssistantHero: React.FC = () => {
  const { activePairing, dismissPairing, acceptPairing } = useShopping();

  return (
    <section className="glass-panel hero-voice-section">
      <VoiceOrb />
      <LiveTranscript />
      <QuickVoicePills />
      <TextFallbackBar />

      {/* Dynamic Companion Item Pairing Suggestion Banner */}
      {activePairing && (
        <div className="pairing-banner" style={{ marginTop: '1.5rem', width: '100%', maxWidth: '680px' }}>
          <div className="pairing-info">
            <div className="pairing-icon-box">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="pairing-title">
                Smart Companion Suggestion: <strong>{activePairing.suggestedItem}</strong> (${activePairing.price.toFixed(2)})
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
              Add Companion
            </button>
            <button
              className="btn-icon"
              style={{ width: '32px', height: '32px' }}
              onClick={dismissPairing}
              title="Dismiss suggestion"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
