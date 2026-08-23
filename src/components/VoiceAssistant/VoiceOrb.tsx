import React from 'react';
import { Mic, MicOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const VoiceOrb: React.FC = () => {
  const { speechStatus, isListening, lastParsedCommand, startVoiceListening, stopVoiceListening } = useShopping();

  const handleToggleListening = () => {
    if (isListening) {
      stopVoiceListening();
    } else {
      startVoiceListening();
    }
  };

  // Determine label and status state
  let stateLabel = 'Tap to start speaking';
  let stateSubtitle = 'VoiceCart AI is ready';
  let statusClass = 'idle';

  if (speechStatus === 'listening') {
    stateLabel = 'Listening...';
    stateSubtitle = 'Speak your command clearly';
    statusClass = 'listening';
  } else if (speechStatus === 'processing') {
    stateLabel = 'Understanding...';
    stateSubtitle = 'Processing natural language';
    statusClass = 'processing';
  } else if (speechStatus === 'error') {
    stateLabel = "I couldn't understand that";
    stateSubtitle = 'Tap to try again or type below';
    statusClass = 'error';
  } else if (lastParsedCommand && lastParsedCommand.intent !== 'UNKNOWN') {
    stateLabel = 'Command processed';
    stateSubtitle = 'Ready for your next request';
    statusClass = 'success';
  }

  return (
    <div className="voice-orb-wrapper">
      <div className="voice-orb-container">
        {/* Subtle Sound Wave Rings when active */}
        {isListening && (
          <>
            <div className="orb-wave wave-1" />
            <div className="orb-wave wave-2" />
            <div className="orb-wave wave-3" />
          </>
        )}

        <button
          className={`voice-orb-button ${statusClass}`}
          onClick={handleToggleListening}
          title={isListening ? 'Click to stop listening' : 'Click to start voice command'}
          aria-label={isListening ? 'Stop listening to microphone' : 'Start voice command recognition'}
        >
          {speechStatus === 'processing' ? (
            <Loader2 size={38} className="animate-spin" />
          ) : speechStatus === 'error' ? (
            <AlertCircle size={38} />
          ) : isListening ? (
            <MicOff size={38} />
          ) : lastParsedCommand && lastParsedCommand.intent !== 'UNKNOWN' ? (
            <CheckCircle2 size={38} />
          ) : (
            <Mic size={38} />
          )}
        </button>
      </div>

      <div className="voice-orb-status-text">
        <div className={`orb-main-label ${statusClass}`}>{stateLabel}</div>
        <div className="orb-sub-label">{stateSubtitle}</div>
      </div>
    </div>
  );
};

