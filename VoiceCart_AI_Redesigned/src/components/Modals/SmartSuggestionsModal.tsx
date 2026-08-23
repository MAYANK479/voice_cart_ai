import React, { useState } from 'react';
import { X, Sparkles, History, Sun, Repeat, Plus, Search, Tag } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';

export const SmartSuggestionsModal: React.FC = () => {
  const {
    suggestionsModalOpen,
    setSuggestionsModalOpen,
    suggestionsInitialTab,
    restockPredictions,
    seasonalPicks,
    searchSubstitutes,
    addItem,
  } = useShopping();

  const [activeTab, setActiveTab] = useState<'restock' | 'seasonal' | 'substitutes'>(suggestionsInitialTab);
  const [substituteQuery, setSubstituteQuery] = useState('');

  // Keep activeTab in sync with initial tab when modal opens
  React.useEffect(() => {
    setActiveTab(suggestionsInitialTab);
  }, [suggestionsInitialTab, suggestionsModalOpen]);

  const matchedSubstitutes = searchSubstitutes(substituteQuery);

  if (!suggestionsModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setSuggestionsModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Sparkles size={22} color="#fbbf24" />
            <div>
              <h3>Smart AI Suggestions & Insights</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Predictive restock alerts, seasonal harvest items, and healthy dietary substitutes.
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={() => setSuggestionsModalOpen(false)}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-glass)',
            padding: '0 1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            gap: '0.5rem',
          }}
        >
          <button
            className={`btn-subtle ${activeTab === 'restock' ? 'active' : ''}`}
            style={{
              border: 'none',
              borderRadius: '0',
              borderBottom: activeTab === 'restock' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '0.85rem 1rem',
              color: activeTab === 'restock' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              fontWeight: 600,
            }}
            onClick={() => setActiveTab('restock')}
          >
            <History size={15} color="#fbbf24" />
            <span>Restock Predictions ({restockPredictions.length})</span>
          </button>

          <button
            className={`btn-subtle ${activeTab === 'seasonal' ? 'active' : ''}`}
            style={{
              border: 'none',
              borderRadius: '0',
              borderBottom: activeTab === 'seasonal' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '0.85rem 1rem',
              color: activeTab === 'seasonal' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              fontWeight: 600,
            }}
            onClick={() => setActiveTab('seasonal')}
          >
            <Sun size={15} color="#f59e0b" />
            <span>Seasonal & Deals ({seasonalPicks.length})</span>
          </button>

          <button
            className={`btn-subtle ${activeTab === 'substitutes' ? 'active' : ''}`}
            style={{
              border: 'none',
              borderRadius: '0',
              borderBottom: activeTab === 'substitutes' ? '2px solid var(--accent-primary)' : '2px solid transparent',
              padding: '0.85rem 1rem',
              color: activeTab === 'substitutes' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: 'transparent',
              fontWeight: 600,
            }}
            onClick={() => setActiveTab('substitutes')}
          >
            <Repeat size={15} color="#10b981" />
            <span>Smart Substitutes</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="modal-body">
          {/* TAB 1: RESTOCK PREDICTIONS */}
          {activeTab === 'restock' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Based on your previous shopping frequency and average consumption cycles, we predict you are running low on these essentials:
              </div>

              {restockPredictions.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <h4>No items currently low!</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Your shopping list already covers all your regular pantry essentials.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                  {restockPredictions.map((pred) => (
                    <div
                      key={pred.id}
                      className="product-card"
                      style={{
                        borderColor: pred.urgency === 'high' ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-glass)',
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              background:
                                pred.urgency === 'high'
                                  ? 'rgba(239, 68, 68, 0.2)'
                                  : pred.urgency === 'medium'
                                  ? 'rgba(245, 158, 11, 0.2)'
                                  : 'rgba(59, 130, 246, 0.2)',
                              color:
                                pred.urgency === 'high'
                                  ? '#fca5a5'
                                  : pred.urgency === 'medium'
                                  ? '#fcd34d'
                                  : '#93c5fd',
                            }}
                          >
                            {pred.urgency} Urgency
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            Cycle: {pred.averageCycleDays} days
                          </span>
                        </div>

                        <div className="product-card-title" style={{ marginTop: '0.5rem' }}>
                          {pred.itemName}
                        </div>
                        <p style={{ fontSize: '0.78rem', color: '#fbbf24', marginTop: '0.25rem' }}>
                          {pred.reason}
                        </p>
                      </div>

                      <div className="product-card-bottom">
                        <div className="product-card-price">${pred.estimatedPrice.toFixed(2)}</div>
                        <button
                          className="btn-quick-add"
                          onClick={() =>
                            addItem({
                              name: pred.itemName,
                              quantity: 1,
                              unit: pred.unit,
                              category: pred.category,
                              estimatedPrice: pred.estimatedPrice,
                              source: 'suggestion',
                            })
                          }
                        >
                          <Plus size={13} style={{ display: 'inline', marginRight: '3px' }} />
                          Restock Item
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SEASONAL & ON-SALE RECOMMENDATIONS */}
          {activeTab === 'seasonal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Fresh harvest picks currently in peak season with maximum flavor, highest nutrient density, and seasonal discounts:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {seasonalPicks.map((seasonItem) => (
                  <div key={seasonItem.id} className="product-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="tag-badge" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                          {seasonItem.badge}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{seasonItem.season}</span>
                      </div>

                      <div className="product-card-title" style={{ marginTop: '0.5rem' }}>
                        {seasonItem.name}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {seasonItem.description}
                      </p>

                      {seasonItem.nutritionalHighlight && (
                        <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.4rem', fontWeight: 600 }}>
                          🌱 {seasonItem.nutritionalHighlight}
                        </div>
                      )}
                    </div>

                    <div className="product-card-bottom">
                      <div>
                        <div className="product-card-price">${seasonItem.discountedPrice.toFixed(2)}</div>
                        {seasonItem.onSale && (
                          <span style={{ fontSize: '0.72rem', textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                            ${seasonItem.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <button
                        className="btn-quick-add"
                        onClick={() =>
                          addItem({
                            name: seasonItem.name,
                            quantity: 1,
                            unit: seasonItem.unit,
                            category: seasonItem.category,
                            estimatedPrice: seasonItem.discountedPrice,
                            source: 'suggestion',
                          })
                        }
                      >
                        <Plus size={13} style={{ display: 'inline', marginRight: '3px' }} />
                        Add Seasonal
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SMART SUBSTITUTES FINDER */}
          {activeTab === 'substitutes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type="text"
                    className="catalog-search-input"
                    style={{ width: '100%', paddingLeft: '2.5rem' }}
                    placeholder="Search an ingredient (e.g., 'milk', 'butter', 'sugar', 'pasta', 'beef')..."
                    value={substituteQuery}
                    onChange={(e) => setSubstituteQuery(e.target.value)}
                  />
                  <Search
                    size={16}
                    style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {matchedSubstitutes.map((sub, idx) => (
                  <div key={idx} className="product-card">
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Alternative for: <strong style={{ color: 'var(--accent-cyan)' }}>{sub.originalItem}</strong>
                        </span>
                        <span
                          style={{
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.4rem',
                            borderRadius: '4px',
                            background: 'rgba(16, 185, 129, 0.15)',
                            color: '#6ee7b7',
                          }}
                        >
                          {sub.type}
                        </span>
                      </div>

                      <div className="product-card-title" style={{ marginTop: '0.4rem' }}>
                        {sub.substituteName}
                      </div>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {sub.benefit}
                      </p>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.5rem' }}>
                        {sub.dietaryTags.map((tag) => (
                          <span key={tag} className="tag-badge" style={{ fontSize: '0.65rem' }}>
                            <Tag size={9} style={{ display: 'inline', marginRight: '2px' }} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="product-card-bottom">
                      <div className="product-card-price">${sub.estimatedPrice.toFixed(2)}</div>
                      <button
                        className="btn-quick-add"
                        onClick={() =>
                          addItem({
                            name: sub.substituteName,
                            quantity: 1,
                            unit: sub.unit,
                            category: sub.category,
                            estimatedPrice: sub.estimatedPrice,
                            dietaryTags: sub.dietaryTags,
                            source: 'substitute',
                          })
                        }
                      >
                        <Plus size={13} style={{ display: 'inline', marginRight: '3px' }} />
                        Add Substitute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
