import React from 'react';
import { Mic, Volume2, VolumeX, HelpCircle, ShoppingBag, Sparkles, RefreshCw } from 'lucide-react';
import { useShopping } from '../context/ShoppingContext';
import { SUPPORTED_LANGUAGES } from '../data/languageData';
import { SupportedLanguage } from '../types/speech';

export const Header: React.FC = () => {
  const {
    currentLanguage,
    setLanguage,
    ttsEnabled,
    setTtsEnabled,
    setCatalogModalOpen,
    setSuggestionsModalOpen,
    setHelpModalOpen,
    resetToDemo,
    pendingCount,
  } = useShopping();

  return (
    <header className="header-container">
      <div className="logo-group">
        <div className="logo-icon-wrapper">
          <Mic size={24} />
        </div>
        <div>
          <h1 className="logo-title">VoiceCart AI</h1>
          <div className="logo-subtitle">Smart Shopping Assistant</div>
        </div>
      </div>

      <div className="header-actions">
        {/* Language Selector */}
        <select
          aria-label="Select Language"
          className="select-language"
          value={currentLanguage}
          onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.flag} {lang.name}
            </option>
          ))}
        </select>

        {/* Suggestions Center Button */}
        <button
          className="btn-subtle"
          onClick={() => setSuggestionsModalOpen(true)}
          title="Smart Suggestions & Restock"
        >
          <Sparkles size={16} color="#fbbf24" />
          <span>Smart AI Picks</span>
        </button>

        {/* Store Catalog Search Button */}
        <button
          className="btn-subtle"
          onClick={() => setCatalogModalOpen(true)}
          title="Browse & Search Store Catalog"
        >
          <ShoppingBag size={16} color="#06b6d4" />
          <span>Catalog</span>
          {pendingCount > 0 && <span className="badge-counter">{pendingCount}</span>}
        </button>

        {/* TTS Toggle */}
        <button
          className={`btn-icon ${ttsEnabled ? 'active' : ''}`}
          onClick={() => setTtsEnabled(!ttsEnabled)}
          title={ttsEnabled ? 'Mute Voice Assistant' : 'Unmute Voice Assistant'}
          aria-label={ttsEnabled ? 'Mute Voice Assistant' : 'Unmute Voice Assistant'}
        >
          {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>

        {/* Help Modal Trigger */}
        <button
          className="btn-icon"
          onClick={() => setHelpModalOpen(true)}
          title="Voice Commands Guide"
          aria-label="Voice Commands Guide"
        >
          <HelpCircle size={18} />
        </button>

        {/* Reset Demo Data Button */}
        <button
          className="btn-icon"
          onClick={resetToDemo}
          title="Reset Sample Data"
          aria-label="Reset Sample Data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </header>
  );
};
