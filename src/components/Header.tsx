import React from 'react';
import {
  Mic,
  Volume2,
  VolumeX,
  HelpCircle,
  ShoppingBag,
  Sparkles,
  BarChart3,
  History,
  Terminal,
  LayoutDashboard,
  ShoppingCart,
  Sun,
  Moon,
} from 'lucide-react';

import { useShopping } from '../context/ShoppingContext';
import { SUPPORTED_LANGUAGES } from '../data/languageData';
import { SupportedLanguage } from '../types/speech';

export const Header: React.FC = () => {
  const {
    activeView,
    setActiveView,
    theme,
    toggleTheme,
    currentLanguage,
    setLanguage,
    ttsEnabled,
    setTtsEnabled,
    setCatalogModalOpen,
    setSuggestionsModalOpen,
    setHelpModalOpen,
    pendingCount,
    items,
    commandLogs,
  } = useShopping();



  return (
    <header className="header-container" role="banner">
      {/* Brand Logo & Tagline */}
      <div className="logo-group" onClick={() => setActiveView('dashboard')} style={{ cursor: 'pointer' }}>
        <div className="logo-icon-wrapper">
          <Mic size={22} color="var(--accent-primary)" />
        </div>
        <div>
          <h1 className="logo-title">FreshFlow</h1>
          <div className="logo-subtitle">Talk to your shopping list.</div>
        </div>

      </div>

      {/* Main Navigation Views */}
      <nav className="nav-tabs-wrapper" aria-label="Main Navigation">
        <button
          className={`nav-tab-btn ${activeView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveView('dashboard')}
          aria-current={activeView === 'dashboard' ? 'page' : undefined}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
          {items.length > 0 && <span className="tab-badge">{items.length}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeView === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveView('insights')}
          aria-current={activeView === 'insights' ? 'page' : undefined}
        >
          <BarChart3 size={15} />
          <span>Insights</span>
        </button>

        <button
          className={`nav-tab-btn ${activeView === 'history' ? 'active' : ''}`}
          onClick={() => setActiveView('history')}
          aria-current={activeView === 'history' ? 'page' : undefined}
        >
          <History size={15} />
          <span>History</span>
          {commandLogs.length > 0 && <span className="tab-badge-subtle">{commandLogs.length}</span>}
        </button>

        <button
          className={`nav-tab-btn ${activeView === 'nlp-lab' ? 'active' : ''}`}
          onClick={() => setActiveView('nlp-lab')}
          aria-current={activeView === 'nlp-lab' ? 'page' : undefined}
        >
          <Terminal size={15} />
          <span>NLP Lab</span>
        </button>

        <button
          className={`nav-tab-btn checkout-tab ${activeView === 'checkout' ? 'active' : ''}`}
          onClick={() => setActiveView('checkout')}
          aria-current={activeView === 'checkout' ? 'page' : undefined}
        >
          <ShoppingCart size={15} />
          <span>Checkout</span>
          {items.length > 0 && <span className="tab-badge-checkout">{items.length}</span>}
        </button>
      </nav>


      {/* Action Controls & Utilities */}
      <div className="header-actions">
        {/* Theme Toggle Button (Dark / Light) - Prominently Placed */}
        <button
          className="btn-icon theme-toggle-btn"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          aria-label={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          style={{ background: theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255, 183, 178, 0.25)', borderColor: 'var(--accent-primary)' }}
        >
          {theme === 'dark' ? (
            <Sun size={17} color="#fbbf24" className="theme-icon-sun" />
          ) : (
            <Moon size={17} color="#78716c" className="theme-icon-moon" />
          )}
        </button>

        {/* Language Selector */}
        <select
          aria-label="Select Voice Recognition Language"
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
          aria-label="Smart AI Suggestions"
        >
          <Sparkles size={15} color="#fbbf24" />
          <span className="hide-on-compact">Smart AI</span>
        </button>

        {/* Store Catalog Search Button */}
        <button
          className="btn-subtle"
          onClick={() => setCatalogModalOpen(true)}
          title="Browse & Search Store Catalog"
          aria-label="Store Product Catalog"
        >
          <ShoppingBag size={15} color="#06b6d4" />
          <span className="hide-on-compact">Catalog</span>
          {pendingCount > 0 && <span className="badge-counter">{pendingCount}</span>}
        </button>

        {/* TTS Toggle */}
        <button
          className={`btn-icon ${ttsEnabled ? 'active' : ''}`}
          onClick={() => setTtsEnabled(!ttsEnabled)}
          title={ttsEnabled ? 'Mute Voice Assistant Feedback' : 'Unmute Voice Assistant Feedback'}
          aria-label={ttsEnabled ? 'Mute Voice Assistant' : 'Unmute Voice Assistant'}
        >
          {ttsEnabled ? <Volume2 size={16} color="var(--accent-mint-text)" /> : <VolumeX size={16} />}
        </button>

        {/* Help Modal Trigger */}
        <button
          className="btn-icon"
          onClick={() => setHelpModalOpen(true)}
          title="Voice Commands Guide & Cheatsheet"
          aria-label="Voice Commands Guide"
        >
          <HelpCircle size={16} />
        </button>
      </div>
    </header>
  );
};

