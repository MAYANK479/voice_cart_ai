import React from 'react';
import { X, Mic, HelpCircle, Globe } from 'lucide-react';
import { useShopping } from '../../context/ShoppingContext';


export const HelpModal: React.FC = () => {
  const { helpModalOpen, setHelpModalOpen } = useShopping();

  if (!helpModalOpen) return null;

  return (
    <div className="modal-overlay" onClick={() => setHelpModalOpen(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <HelpCircle size={22} color="var(--accent-cyan)" />
            <div>
              <h3>Voice Commands & Capabilities Guide</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Master all natural phrasing, multi-item chaining, and search filters.
              </p>
            </div>
          </div>
          <button
            className="btn-icon"
            onClick={() => setHelpModalOpen(false)}
            title="Close help guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {/* Command Category: Adding Items */}
            <div className="category-group">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mic size={15} />
                <span>1. Adding & Chaining Items</span>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><code>"Add milk"</code> or <code>"I need 3 organic apples"</code></li>
                <li><code>"Buy 2 bottles of water"</code></li>
                <li><code>"Add 1 loaf of sourdough bread and 2 boxes of cereal"</code> (Chaining multi-items)</li>
                <li><code>"Put 1 gallon of oat milk on my list"</code></li>
              </ul>
            </div>

            {/* Command Category: Removing & Modifying */}
            <div className="category-group">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mic size={15} />
                <span>2. Removing & Modifying</span>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><code>"Remove milk from my list"</code></li>
                <li><code>"Delete apples"</code> or <code>"Drop bread"</code></li>
                <li><code>"Change apples quantity to 5"</code></li>
                <li><code>"Update eggs to 12"</code></li>
                <li><code>"Clear completed items"</code></li>
              </ul>
            </div>

            {/* Command Category: Search & Price Filtering */}
            <div className="category-group">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#06b6d4', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mic size={15} />
                <span>3. Search & Price Filtering</span>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><code>"Find me organic apples"</code></li>
                <li><code>"Find toothpaste under $5"</code></li>
                <li><code>"Search snacks below 4 dollars"</code></li>
                <li><code>"Show items between $2 and $6"</code></li>
              </ul>
            </div>

            {/* Command Category: Smart Suggestions & Substitutes */}
            <div className="category-group">
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Mic size={15} />
                <span>4. AI Suggestions & Substitutes</span>
              </div>
              <ul style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><code>"What is in season?"</code> or <code>"Show seasonal produce"</code></li>
                <li><code>"What should I restock?"</code> / <code>"Running low items"</code></li>
                <li><code>"Suggest a substitute for butter"</code></li>
                <li><code>"What can I use instead of sugar?"</code></li>
              </ul>
            </div>
          </div>

          {/* Multilingual Support Banner */}
          <div
            style={{
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(99, 102, 241, 0.12)',
              border: '1px solid rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <Globe size={24} color="var(--accent-primary)" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Multilingual Voice Recognition</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                Switch language in the top navbar to speak in <strong>English, Spanish, French, German, or Hindi</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
