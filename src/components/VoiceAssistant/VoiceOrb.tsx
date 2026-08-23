import React from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const VoiceOrb: React.FC = () => {
  const { speechStatus, isListening, startVoiceListening, stopVoiceListening } = useShopping();

  const handleToggleListening = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  return (
    <div className="voice-orb-container">
      {/* Animated Sound Wave Rings when active */}
      {isListening && (
        <>
          <div className="orb-wave wave-1"></div>
          <div className="orb-wave wave-2"></div>
          <div className="orb-wave wave-3"></div>
        </>
      )}

      <button
        className={`voice-orb-button ${isListening ? 'listening' : ''}`}
        onClick={handleToggleListening}
        title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
        aria-label={isListening ? 'Stop listening' : 'Start voice command'}
      >
        {speechStatus === 'processing' ? (
          <Loader2 size={36} className="animate-spin" />
        ) : isListening ? (
          <MicOff size={36} />
        ) : (
          <Mic size={36} />
        )}
      </button>
    </div>
  );
};
