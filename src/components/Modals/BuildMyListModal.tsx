import React, { useState, useEffect } from 'react';
import { X, Sparkles, Check, RefreshCw, ShoppingCart } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

import { CATEGORIES } from '../../data/categories';

export const BuildMyListModal: React.FC = () => {
  const { buildMyListModalOpen, setBuildMyListModalOpen, buildMyListBasket, addSmartBasketItems, activeListName } = useShopping();

  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
  const [selectedRecs, setSelectedRecs] = useState<string[]>([]);

  useEffect(() => {
    if (buildMyListBasket) {
      setSelectedHabits(buildMyListBasket.habitItems.map((i) => i.name));
      setSelectedRecs(buildMyListBasket.recommendedItems.filter((i) => i.selected).map((i) => i.name));
    }
  }, [buildMyListBasket, buildMyListModalOpen]);

  if (!buildMyListModalOpen) return null;

  const toggleHabit = (name: string) => {
    setSelectedHabits((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const toggleRec = (name: string) => {
    setSelectedRecs((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]));
  };

  const selectedHabitObjects = buildMyListBasket.habitItems.filter((i) => selectedHabits.includes(i.name));
  const selectedRecObjects = buildMyListBasket.recommendedItems.filter((i) => selectedRecs.includes(i.name));
  const allSelected = [...selectedHabitObjects, ...selectedRecObjects];

  const totalCost = allSelected.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleAddSelected = () => {
    addSmartBasketItems(allSelected);
  };

  const handleAddAll = () => {
    const all = [...buildMyListBasket.habitItems, ...buildMyListBasket.recommendedItems];
    addSmartBasketItems(all);
  };

  return (
    <div className="modal-backdrop" onClick={() => setBuildMyListModalOpen(false)}>
      <div className="modal-glass-container build-list-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-badge sparkle-gradient">
              <Sparkles size={20} color="#173F32" />
            </div>
            <div>
              <h2 className="modal-title">✨ Build My List</h2>
              <p className="modal-subtitle">AI analysis of your purchase habits, restock velocity & seasonal deals for {activeListName}.</p>
            </div>
          </div>
          <button
            className="btn-icon modal-close-btn"
            onClick={() => setBuildMyListModalOpen(false)}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="modal-scroll-body build-list-body">
          {/* Section 1: Frequently Purchased Habit Staples */}
          <div className="build-section">
            <div className="build-section-header">
              <RefreshCw size={16} color="var(--accent-primary)" />
              <h3>Frequently Purchased Staples ({selectedHabits.length}/{buildMyListBasket.habitItems.length})</h3>
            </div>

            <div className="build-items-grid">
              {buildMyListBasket.habitItems.map((item, idx) => {
                const cat = CATEGORIES[item.category];
                const isSelected = selectedHabits.includes(item.name);
                return (
                  <div
                    key={idx}
                    className={`build-item-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleHabit(item.name)}
                  >
                    <div className="build-item-checkbox">
                      {isSelected ? <Check size={14} color="#FFFFFF" /> : null}
                    </div>
                    <span className="build-item-emoji">{cat?.emoji || '🛒'}</span>
                    <div className="build-item-details">
                      <div className="build-item-name">{item.name}</div>
                      <div className="build-item-reason">{item.reason}</div>
                    </div>
                    <div className="build-item-price">${item.price.toFixed(2)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Recommended Complements & Seasonal Deals */}
          {buildMyListBasket.recommendedItems.length > 0 && (
            <div className="build-section">
              <div className="build-section-header">
                <Sparkles size={16} color="var(--accent-secondary)" />
                <h3>Fresh Seasonal Deals & Recommended Complements</h3>
              </div>

              <div className="build-items-grid">
                {buildMyListBasket.recommendedItems.map((item, idx) => {
                  const cat = CATEGORIES[item.category];
                  const isSelected = selectedRecs.includes(item.name);
                  return (
                    <div
                      key={idx}
                      className={`build-item-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleRec(item.name)}
                    >
                      <div className="build-item-checkbox">
                        {isSelected ? <Check size={14} color="#FFFFFF" /> : null}
                      </div>
                      <span className="build-item-emoji">{cat?.emoji || '🌱'}</span>
                      <div className="build-item-details">
                        <div className="build-item-name">{item.name}</div>
                        <div className="build-item-reason">{item.reason}</div>
                      </div>
                      <div className="build-item-price">${item.price.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Summary & Action Buttons */}
        <div className="modal-footer build-modal-footer">
          <div className="build-cost-summary">
            <div className="summary-label">Estimated Total ({allSelected.length} items)</div>
            <div className="summary-amount">${totalCost.toFixed(2)}</div>
          </div>

          <div className="build-modal-actions">
            <button
              className="btn-subtle"
              onClick={handleAddAll}
              title="Add all habit and seasonal suggestions"
            >
              Add All ({buildMyListBasket.habitItems.length + buildMyListBasket.recommendedItems.length})
            </button>
            <button
              className="btn-primary-action"
              onClick={handleAddSelected}
              disabled={allSelected.length === 0}
            >
              <ShoppingCart size={15} />
              <span>Add Selected ({allSelected.length}) to List</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
