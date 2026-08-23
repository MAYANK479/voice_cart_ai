import React from 'react';
import { Sparkles, RefreshCw, Leaf, Plus, ChevronRight, UtensilsCrossed } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';
import { SUBSTITUTE_DATABASE } from '../../data/substituteData';

export const RestockWidget: React.FC = () => {
  const {
    restockPredictions,
    addItem,
    setSuggestionsModalOpen,
    setSuggestionsInitialTab,
    setBuildMyListModalOpen,
    activePairing,
    acceptPairing,
    dismissPairing,
  } = useShopping();

  const handleOpenTab = (tab: 'restock' | 'seasonal' | 'substitutes') => {
    setSuggestionsInitialTab(tab);
    setSuggestionsModalOpen(true);
  };

  const sampleSubstitute = SUBSTITUTE_DATABASE[0];

  return (
    <div className="glass-panel for-you-widget">
      {/* For You Header */}
      <div className="for-you-header">
        <div className="for-you-title">
          <Sparkles size={16} color="var(--accent-primary)" />
          <span>✨ FOR YOU</span>
        </div>
        <button
          className="btn-subtle text-xs"
          onClick={() => handleOpenTab('restock')}
          title="Open smart suggestions center"
        >
          <span>Explore All</span>
          <ChevronRight size={12} />
        </button>
      </div>

      {/* Build My List Callout Card */}
      <div className="build-my-list-card" onClick={() => setBuildMyListModalOpen(true)}>
        <div className="build-card-content">
          <div className="build-card-badge">✨ Smart Basket</div>
          <div className="build-card-title">What should I buy?</div>
          <div className="build-card-subtext">Auto-analyzed from your 60-day purchase patterns & restock cycle.</div>
        </div>
        <button className="btn-build-card-action">Build List →</button>
      </div>

      {/* 🔄 Restock Alerts */}
      <div className="for-you-section">
        <div className="section-label-row">
          <div className="section-label">
            <RefreshCw size={13} color="var(--accent-primary)" />
            <span>🔄 Restock Alerts</span>
          </div>
        </div>

        {restockPredictions.length === 0 ? (
          <div className="for-you-empty-text">All frequently bought staples are on your list! 🎉</div>
        ) : (
          <div className="for-you-items-stack">
            {restockPredictions.slice(0, 2).map((item) => (
              <div key={item.id} className="for-you-item-row">
                <div className="for-you-item-info">
                  <div className="for-you-item-name">{item.itemName}</div>
                  <div className="for-you-item-desc">{item.reason}</div>
                </div>
                <button
                  className="btn-for-you-add"
                  onClick={() =>
                    addItem({
                      name: item.itemName,
                      quantity: 1,
                      unit: item.unit,
                      category: item.category,
                      estimatedPrice: item.estimatedPrice,
                      source: 'suggestion',
                    })
                  }
                  title={`Add ${item.itemName}`}
                >
                  <Plus size={12} />
                  <span>+ Add (${item.estimatedPrice.toFixed(2)})</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌱 Healthy Substitutes */}
      {sampleSubstitute && (
        <div className="for-you-section">
          <div className="section-label-row">
            <div className="section-label">
              <Leaf size={13} color="var(--accent-primary)" />
              <span>🌱 Better Alternative</span>
            </div>
            <button className="subtle-link" onClick={() => handleOpenTab('substitutes')}>
              View substitutes
            </button>
          </div>

          <div className="for-you-substitute-card">
            <div className="substitute-text-group">
              <div className="substitute-prompt">
                Swap <strong>{sampleSubstitute.originalItem}</strong> with <strong>{sampleSubstitute.substituteName}</strong>
              </div>
              <div className="substitute-benefit">{sampleSubstitute.benefit}</div>
            </div>
            <button
              className="btn-for-you-add"
              onClick={() =>
                addItem({
                  name: sampleSubstitute.substituteName,
                  quantity: 1,
                  unit: sampleSubstitute.unit,
                  category: sampleSubstitute.category,
                  estimatedPrice: sampleSubstitute.estimatedPrice,
                  source: 'substitute',
                })
              }
            >
              <Plus size={12} />
              <span>+ Add</span>
            </button>
          </div>
        </div>
      )}

      {/* 🍽️ Companion Food Pairing (if active) */}
      {activePairing && (
        <div className="for-you-section pairing-callout">
          <div className="section-label-row">
            <div className="section-label">
              <UtensilsCrossed size={13} color="var(--accent-primary)" />
              <span>🍽️ Goes Well With</span>
            </div>
            <button className="subtle-link" onClick={dismissPairing}>
              Dismiss
            </button>
          </div>

          <div className="for-you-substitute-card">
            <div className="substitute-text-group">
              <div className="substitute-prompt">
                You added <strong>{activePairing.triggerItem}</strong>. Add <strong>{activePairing.suggestedItem}</strong>?
              </div>
              <div className="substitute-benefit">{activePairing.reason}</div>
            </div>
            <button className="btn-for-you-add" onClick={() => acceptPairing(activePairing)}>
              <Plus size={12} />
              <span>+ Add (${activePairing.price.toFixed(2)})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

