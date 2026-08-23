import React from 'react';
import { useShopping } from '../../context/ShoppingContext';

export const LiveTranscript: React.FC = () => {
  const { speechStatus, isListening, interimTranscript, lastTranscript, lastParsedCommand } = useShopping();

  let displayText = "Tap microphone or say 'Add 2 apples'...";
  let isLive = false;

  if (isListening && interimTranscript) {
    displayText = `"${interimTranscript}"`;
    isLive = true;
  } else if (isListening) {
    displayText = 'Listening for your command...';
    isLive = true;
  } else if (lastTranscript) {
    displayText = `Heard: "${lastTranscript}"`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', width: '100%' }}>
      <div className={`voice-status-badge ${speechStatus}`}>
        {isListening && <span className="transcript-pulse-dot" />}
        {speechStatus === 'listening'
          ? 'Listening Live...'
          : speechStatus === 'processing'
          ? 'Processing NLP...'
          : speechStatus === 'error'
          ? 'Mic Error'
          : 'Ready for Voice'}
      </div>

      <div className={`transcript-card ${lastTranscript || interimTranscript ? 'has-speech' : ''}`}>
        {isLive && <span className="transcript-pulse-dot" />}
        <span>{displayText}</span>
      </div>

      {lastParsedCommand && lastParsedCommand.intent !== 'UNKNOWN' && (
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Intent: <strong style={{ color: 'var(--accent-cyan)' }}>{lastParsedCommand.intent}</strong></span>
          <span>•</span>
          <span>Confidence: <strong style={{ color: '#10b981' }}>{Math.round(lastParsedCommand.confidence * 100)}%</strong></span>
        </div>
      )}
    </div>
  );
};
